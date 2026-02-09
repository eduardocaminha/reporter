import { NextResponse } from 'next/server';
import { gerarLaudoStream } from '@/lib/claude';
import { getTranslations } from 'next-intl/server';

export async function POST(request: Request) {
  const t = await getTranslations('Api');
  try {
    const { texto, modoPS, modoComparativo, usarPesquisa } = await request.json();

    if (!texto || typeof texto !== 'string' || texto.trim() === '') {
      return NextResponse.json(
        { erro: t('emptyText'), laudo: null, sugestoes: [] },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { erro: t('apiKeyNotConfigured'), laudo: null, sugestoes: [] },
        { status: 500 }
      );
    }

    const stream = await gerarLaudoStream(
      texto.trim(), modoPS ?? false, modoComparativo ?? false, usarPesquisa ?? false
    );

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Erro ao gerar laudo:', error);

    const mensagem = error instanceof Error ? error.message : 'Erro desconhecido';

    if (mensagem.includes('timeout') || mensagem.includes('ETIMEDOUT')) {
      return NextResponse.json(
        { erro: t('timeout'), laudo: null, sugestoes: [] },
        { status: 504 }
      );
    }

    if (mensagem.includes('401') || mensagem.includes('authentication')) {
      return NextResponse.json(
        { erro: t('invalidApiKey'), laudo: null, sugestoes: [] },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { erro: t('processingError'), laudo: null, sugestoes: [] },
      { status: 500 }
    );
  }
}
