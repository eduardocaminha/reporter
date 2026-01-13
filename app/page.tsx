'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Editor } from '@/components/editor';
import { Resultado } from '@/components/resultado';
import { Sugestoes } from '@/components/sugestoes';
import { CopyButtons } from '@/components/copy-buttons';
import { Historico, useHistorico } from '@/components/historico';

interface ResultadoAPI {
  laudo: string | null;
  sugestoes: string[];
  erro: string | null;
}

export default function HomePage() {
  const [texto, setTexto] = useState('');
  const [modoPS, setModoPS] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoAPI>({
    laudo: null,
    sugestoes: [],
    erro: null,
  });
  const { adicionarAoHistorico } = useHistorico();

  // Carregar modo PS do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('modoPS');
    if (saved !== null) {
      setModoPS(JSON.parse(saved));
    }
  }, []);

  // Salvar modo PS no localStorage
  useEffect(() => {
    localStorage.setItem('modoPS', JSON.stringify(modoPS));
  }, [modoPS]);

  const gerarLaudo = useCallback(async () => {
    if (!texto.trim()) {
      setResultado({
        laudo: null,
        sugestoes: [],
        erro: 'Digite ou cole um texto para gerar o laudo',
      });
      return;
    }

    setCarregando(true);
    setResultado({ laudo: null, sugestoes: [], erro: null });

    try {
      const response = await fetch('/api/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto, modoPS }),
      });

      const data = await response.json();
      setResultado(data);
      
      // Adicionar ao histórico se gerou laudo com sucesso
      if (data.laudo) {
        adicionarAoHistorico(texto, data.laudo);
      }
    } catch {
      setResultado({
        laudo: null,
        sugestoes: [],
        erro: 'Erro de conexão. Verifique sua internet',
      });
    } finally {
      setCarregando(false);
    }
  }, [texto, modoPS, adicionarAoHistorico]);

  // Atalho Ctrl+Enter para gerar
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        gerarLaudo();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gerarLaudo]);

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    window.location.href = '/login';
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">RadReport</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="modo-ps"
                checked={modoPS}
                onCheckedChange={setModoPS}
              />
              <Label htmlFor="modo-ps" className="text-gray-600 text-sm">
                Modo PS
              </Label>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700"
            >
              Sair
            </Button>
          </div>
        </div>

        {/* Input */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-900">Texto ditado</CardTitle>
              <Historico onSelecionar={setTexto} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Editor
              valor={texto}
              onChange={setTexto}
              disabled={carregando}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Ctrl+Enter para gerar
              </span>
              <Button
                onClick={gerarLaudo}
                disabled={carregando || !texto.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {carregando ? 'Gerando...' : 'Gerar Laudo'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultado */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-900">Resultado</CardTitle>
              <CopyButtons laudo={resultado.laudo} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Resultado
              laudo={resultado.laudo}
              erro={resultado.erro}
              carregando={carregando}
            />
            <Sugestoes sugestoes={resultado.sugestoes} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
