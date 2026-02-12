# Reporter — Decisoes Tecnicas de Audio e Transcricao

**Data:** Fevereiro 2026
**Autores:** Eduardo Caminha + AI assistants
**Status:** Draft para revisao com socio

---

## 1. Contexto do Produto

O Reporter e um app web para radiologistas ditarem achados de exames de TC
e receberem laudos estruturados gerados por IA. O fluxo principal e:

```
Medico fala → Transcricao (STT) → Texto no textarea → LLM estrutura o laudo
```

O ambiente tipico e um pronto-socorro (PS) barulhento ou uma sala de laudos.
Frases sao curtas e tecnicas: "apendicite 1,2 cm fossa iliaca direita",
"derrame pleural bilateral moderado", "sem alteracoes significativas".

---

## 2. Arquitetura Implementada

```
Browser                          Our Server                 OpenAI
  |                                  |                        |
  |-- POST /api/realtime/session --> |                        |
  |                                  |-- POST /client_secrets |
  |                                  |<-- ephemeral token --- |
  |<-- { clientSecret } ----------- |                        |
  |                                                           |
  |-- getUserMedia (mic) ---------------------------------->  |
  |-- RTCPeerConnection + SDP offer ---------------------->  |
  |<-- SDP answer ----------------------------------------- |
  |                                                           |
  |== WebRTC audio stream (Opus, automatico) =============>  |
  |<== Data channel: transcription deltas + completed ====== |
  |                                                           |
  |-- AudioContext + AnalyserNode (local, para waveform)     |
```

**Stack:**
- **Transporte:** WebRTC (recomendado pela OpenAI para browsers)
- **Modelo STT:** `gpt-4o-transcribe` (melhor WER que whisper-1)
- **Modo da sessao:** `type: "transcription"` (sem resposta do modelo)
- **VAD:** Server-side, `silence_duration_ms: 1500`
- **Reducao de ruido:** `near_field` (server-side, OpenAI)
- **Token de acesso:** Efemero via `/v1/realtime/client_secrets` (TTL ~60s)

---

## 3. Decisoes Tecnicas e Justificativas

### 3.1 Modelo: gpt-4o-transcribe (nao whisper-1)

| Criterio | whisper-1 | gpt-4o-transcribe |
|----------|-----------|-------------------|
| WER geral | Bom | Melhor (~20-30% menos erros) |
| Streaming deltas | Nao (texto completo por turn) | Sim (texto aparece enquanto fala) |
| Robustez a ruido | Moderada | Superior |
| Robustez a sotaque | Moderada | Superior |
| Suporte a prompt | Sim (limitado) | Sim (mais eficaz) |
| Suporte a logprobs | Nao | Sim |
| Custo | US$ 0.006/min | US$ 0.012/min |

**Decisao:** Usar `gpt-4o-transcribe`. O custo dobra em relacao ao whisper-1,
mas para o volume tipico de um radiologista (estimativa: 5-15 min de audio
por dia), a diferenca e de centavos. A melhora em acuracia de termos medicos
e a experiencia de streaming justificam.

**Alternativa descartada:** Usar `gpt-4o-mini-transcribe` ao vivo e rodar
um "2o passe" com `gpt-4o-transcribe` ao soltar o botao. Isso reduziria
custo de streaming mas adicionaria complexidade de codigo (gerenciar dois
pipelines, merge de transcripts, latencia do 2o passe). Para o volume atual,
nao compensa.

### 3.2 PTT com VAD (nao PTT puro)

Foram consideradas tres abordagens:

| Abordagem | Como funciona | Pros | Contras |
|-----------|---------------|------|---------|
| **VAD automatico (sem botao)** | Modelo detecta fala/silencio sozinho | Hands-free | Instavel em PS barulhento; corta frases |
| **PTT puro (sem VAD)** | Medico aperta/solta; audio e um blob unico | Controle total; sem cortes | Sem streaming de texto enquanto fala |
| **PTT + VAD (nossa escolha)** | Medico aperta para iniciar; VAD segmenta turns internamente | Streaming de texto + controle | Precisa tunar silence_duration |

**Decisao:** PTT + VAD com `silence_duration_ms: 1500`.

- O medico clica no mic (ou Cmd+G) para comecar e clica no check para parar.
- Enquanto grava, o VAD server-side segmenta automaticamente em "turns" a cada
  pausa de 1.5s, permitindo que o texto apareca em tempo real no textarea.
- O valor de 1500ms foi escolhido para tolerar pausas naturais de pensamento
  sem cortar a frase. O default de 500ms era agressivo demais.
- Se em producao percebermos que 1500ms ainda corta (ex: medico olha imagem
  por 3s e volta a falar), podemos aumentar para 2000-2500ms sem impacto.

### 3.3 Formato de audio: WebRTC (nao WebSocket + PCM)

| Aspecto | WebSocket + PCM manual | WebRTC |
|---------|------------------------|--------|
| Encoding | Dev controla (PCM16, 16/24kHz) | Browser negocia (Opus) |
| Complexidade | Alta (converter AudioWorklet → PCM → WS) | Baixa (addTrack e pronto) |
| Latencia | Boa | Melhor (otimizado para real-time) |
| Compatibilidade | Ampla | Ampla (todos browsers modernos) |
| Controle de codec | Total | Nenhum (mas desnecessario) |

**Decisao:** WebRTC. O browser lida com codec, jitter buffer, e adaptacao de
bitrate automaticamente. Nao precisamos de controle granular de encoding
porque o OpenAI aceita e decodifica Opus server-side.

### 3.4 Reducao de ruido: near_field server-side (sem client-side)

- `near_field` e o preset da OpenAI para microfone proximo (headset, lapela).
- Adicionar WebRTC noise suppression no client (`echoCancellation`,
  `noiseSuppression` via `getUserMedia` constraints) poderia causar artefatos
  duplos se interagir com o pipeline server-side.
- Decisao: usar apenas `near_field` da OpenAI. Se em producao houver problemas
  em ambientes muito ruidosos, podemos experimentar `far_field` ou adicionar
  suppression client-side.

### 3.5 Prompt com glossario medico

O campo `prompt` dentro da config de transcription aceita texto livre que
guia o modelo na escolha de vocabulario. Implementamos glossarios por idioma:

- **PT:** ~150 termos (apendicite, diverticulite, pneumoperitonio, TEP, AVC,
  hematoma subdural, estenose de canal, etc.) + formato de medidas (1,2 cm)
  + termos de laudo (achados, impressao diagnostica, controle evolutivo).
- **EN:** Equivalentes em ingles + formato com ponto decimal (1.2 cm).
- **ES:** Equivalentes em espanhol + formato com virgula.

**Impacto esperado:** Reducao significativa de erros em termos tecnicos.
O modelo passa a preferir "diverticulite" em vez de "diver ti cu lite",
"pneumoperitonio" em vez de "pneumo perito neo", etc.

**Manutencao:** O glossario vive no codigo (`MEDICAL_PROMPTS` no `route.ts`).
Conforme o produto crescer, pode migrar para um banco de dados editavel
pelo admin (ou ate pelo proprio medico, como "vocabulario pessoal").

---

## 4. O que NAO implementamos (e por que)

### 4.1 Logprobs + highlight de confianca

O modelo `gpt-4o-transcribe` suporta retornar `logprobs` (probabilidades
por token). Com isso, poderiamos:
- Destacar em amarelo termos com baixa confianca no textarea.
- Oferecer autocomplete com 2-3 sugestoes de um dicionario medico.
- O medico corrige com 1 clique em vez de digitar.

**Por que nao agora:** Requer mudancas no hook (parsear logprobs dos eventos),
no componente (renderizar tokens com cor condicional no textarea, que vira
um contenteditable), e montar o banco de termos para autocomplete. E uma
feature de v2 que adiciona ~2-3 dias de desenvolvimento.

**Quando implementar:** Apos validarmos com usuarios reais que a transcricao
base (sem logprobs) ja e util. Se os erros forem frequentes, essa feature
sera prioridade.

### 4.2 Segundo passe de transcricao (out-of-band)

Apos cada turn, poderiamos enviar o audio completo para a Audio API
(nao-realtime) com `gpt-4o-transcribe` para obter um transcript "limpo"
e substituir o streaming.

**Por que nao agora:** Para frases curtas (5-15 palavras), o primeiro passe
com prompt ja deve ser suficiente. O segundo passe adicionaria latencia
(~1-2s por turn) e complexidade (gerenciar dois transcripts, decidir quando
substituir, lidar com race conditions).

**Quando implementar:** Apenas se detectarmos em producao que o primeiro
passe erra consistentemente em termos criticos (ex: confunde "colecistite"
com "colestisite" mesmo com prompt).

### 4.3 Whisper + fine-tuning em vocabulario medico

A OpenAI nao oferece fine-tuning de modelos de transcricao. Se no futuro
oferecer, seria o caminho ideal: treinar com audio medico em PT-BR.
Ate la, o prompt com glossario e a melhor alternativa.

---

## 5. Estimativa de Custos (Audio)

### Premissas
- 1 radiologista, 1 turno de 6h no PS
- ~40 laudos por turno
- ~20 segundos de audio por laudo (frases curtas)
- Total: ~13 minutos de audio/dia

### Custo por modelo

| Modelo | Preco/min | Custo/dia | Custo/mes (22 dias) |
|--------|-----------|-----------|---------------------|
| whisper-1 | $0.006 | $0.08 | $1.72 |
| gpt-4o-mini-transcribe | $0.006 | $0.08 | $1.72 |
| gpt-4o-transcribe | $0.012 | $0.16 | $3.43 |

**Nota:** Esses valores sao so do STT. O custo do LLM para gerar o laudo
(Claude Sonnet, ~$0.003-0.01 por laudo) e adicional. O custo total de
audio e negligivel — menos de $4/mes por medico.

### Impacto de negocio

Se cobrarmos R$ 99/mes (plano Pro) ou R$ 249/mes (plano Enterprise),
o custo de audio representa <1% da receita por usuario. Nao ha razao
economica para usar um modelo inferior.

---

## 6. Recomendacoes de Hardware para Usuarios

Incluir nas orientacoes de onboarding:

1. **Headset com microfone:** Qualquer headset USB/Bluetooth com mic boom
   (ex: Logitech H390, Jabra Evolve2 30). Custo: R$ 80-200. Melhora
   drasticamente consoantes (p/t/k) criticas em termos medicos.

2. **Evitar microfone do notebook:** Em ambiente de PS, o mic do notebook
   capta tudo — teclado, conversas, monitores. Piora WER em 30-50%.

3. **Navegador:** Chrome ou Edge recomendados (melhor suporte WebRTC).
   Safari funciona mas tem historico de bugs com getUserMedia.

---

## 7. Roadmap de Melhorias (Audio)

| Prioridade | Feature | Esforco | Impacto |
|------------|---------|---------|---------|
| P0 (feito) | Transcricao real-time com waveform | 2 dias | Base funcional |
| P0 (feito) | Glossario medico via prompt | 1h | Reducao de erros |
| P1 | Logprobs + highlight de confianca | 2-3 dias | UX de correcao |
| P1 | Vocabulario pessoal do medico | 1-2 dias | Personalizacao |
| P2 | 2o passe out-of-band | 1 dia | Acuracia extra |
| P2 | Metricas de WER em producao | 1 dia | Dados para otimizar |
| P3 | Modo offline (gravacao local) | 3-5 dias | Resiliencia |
| P3 | Suporte a audio de arquivo (upload) | 2 dias | Workflow alternativo |

---

## 8. Riscos e Mitigacoes

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|---------------|---------|-----------|
| OpenAI muda pricing do Realtime API | Media | Baixo (custo ja negligivel) | Monitorar changelog; budget alertas |
| Medico fala rapido e modelo erra | Alta | Medio | Prompt + logprobs (P1) |
| PS muito barulhento degrada audio | Media | Alto | Headset obrigatorio; testar far_field |
| Latencia alta em conexoes ruins | Baixa | Medio | WebRTC adapta bitrate; fallback graceful |
| Browser nao suporta WebRTC | Muito baixa | Alto | 99%+ dos browsers suportam; fallback WS |
| Idioma do site != idioma falado | Media | Alto | Alerta visual implementado (locale-pulse) |

---

## 9. Perguntas para Discussao com Socio

1. **Pricing:** O custo de audio e tao baixo que nao precisa ser item
   separado na precificacao. Concordamos em absorver no plano?

2. **Headset:** Devemos incluir recomendacao de headset no onboarding?
   Ou ate oferecer um headset como "kit starter" na venda enterprise?

3. **Limite de audio:** Devemos limitar minutos de transcricao por plano
   (ex: Free = 5 min/dia, Pro = ilimitado)? Ou nao faz sentido dado o
   custo baixo?

4. **Logprobs (P1):** Priorizamos isso antes de lancar ou lançamos o
   MVP de audio sem e iteramos com feedback real?

5. **Privacidade:** O audio e enviado para OpenAI via WebRTC. Precisamos
   de consentimento explicito do medico? Devemos mencionar em termos de uso
   que audio e processado por terceiro (OpenAI)? Considerar que pode
   haver dados de paciente indiretamente (ex: "paciente Joao, apendicite").

6. **Offline:** Em hospitais com internet instavel, devemos planejar
   gravacao local com transcricao posterior? Isso mudaria significativamente
   a UX.

---

*Documento gerado para discussao interna. Valores de custo baseados na
tabela publica da OpenAI em fev/2026.*
