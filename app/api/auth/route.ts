import { NextResponse } from 'next/server';
import { verificarSenha, criarSessao, encerrarSessao } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';

export async function POST(request: Request) {
  const t = await getTranslations('Api');
  try {
    const { senha } = await request.json();

    if (!senha) {
      return NextResponse.json(
        { erro: t('passwordNotProvided') },
        { status: 400 }
      );
    }

    const senhaValida = await verificarSenha(senha);

    if (!senhaValida) {
      return NextResponse.json(
        { erro: t('incorrectPassword') },
        { status: 401 }
      );
    }

    await criarSessao();

    return NextResponse.json({ sucesso: true });
  } catch {
    return NextResponse.json(
      { erro: t('loginError') },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const t = await getTranslations('Api');
  try {
    await encerrarSessao();
    return NextResponse.json({ sucesso: true });
  } catch {
    return NextResponse.json(
      { erro: t('logoutError') },
      { status: 500 }
    );
  }
}
