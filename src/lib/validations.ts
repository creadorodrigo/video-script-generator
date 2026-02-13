import { prisma } from './prisma';

const MAX_GENERATIONS = parseInt(process.env.MAX_GENERATIONS_PER_USER_MONTH || '4');

/**
 * Verifica se o usuário pode fazer uma nova geração
 */
export async function canUserGenerate(userId: string): Promise<{
  canGenerate: boolean;
  generationsUsed: number;
  generationsRemaining: number;
  resetDate: Date;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Verifica se precisa resetar o contador (novo mês)
  const now = new Date();
  const lastReset = new Date(user.lastReset);
  const shouldReset = 
    now.getMonth() !== lastReset.getMonth() || 
    now.getFullYear() !== lastReset.getFullYear();

  let generationsUsed = user.generationsUsed;

  if (shouldReset) {
    // Reseta o contador
    await prisma.user.update({
      where: { id: userId },
      data: {
        generationsUsed: 0,
        lastReset: now,
      },
    });
    generationsUsed = 0;
  }

  const canGenerate = generationsUsed < MAX_GENERATIONS;
  const generationsRemaining = Math.max(0, MAX_GENERATIONS - generationsUsed);

  // Calcula próxima data de reset (primeiro dia do próximo mês)
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return {
    canGenerate,
    generationsUsed,
    generationsRemaining,
    resetDate,
  };
}

/**
 * Incrementa o contador de gerações do usuário
 */
export async function incrementUserGenerations(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      generationsUsed: {
        increment: 1,
      },
    },
  });
}

/**
 * Valida os dados de entrada da geração
 */
export function validateGenerationRequest(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validar vídeos de referência
  if (data.videos_referencia) {
    if (!Array.isArray(data.videos_referencia)) {
      errors.push('videos_referencia deve ser um array');
    } else if (data.videos_referencia.length === 0) {
      errors.push('Envie pelo menos 1 vídeo de referência');
    } else if (data.videos_referencia.length > 5) {
      errors.push('Máximo de 5 vídeos de referência permitido');
    }

    // Validar cada vídeo
    data.videos_referencia.forEach((video: any, index: number) => {
      if (!video.url) {
        errors.push(`Vídeo ${index + 1}: URL é obrigatória`);
      }
      if (!video.platform || !['instagram', 'tiktok', 'youtube'].includes(video.platform)) {
        errors.push(`Vídeo ${index + 1}: Plataforma inválida`);
      }
    });
  } else if (!data.padrao_salvo_id) {
    errors.push('Envie vídeos de referência ou selecione um padrão salvo');
  }

  // Validar novo tema
  if (!data.novo_tema) {
    errors.push('novo_tema é obrigatório');
  } else {
    if (!data.novo_tema.tipo || !['descricao', 'link'].includes(data.novo_tema.tipo)) {
      errors.push('novo_tema.tipo deve ser "descricao" ou "link"');
    }
    if (!data.novo_tema.conteudo || data.novo_tema.conteudo.trim().length < 20) {
      errors.push('novo_tema.conteudo deve ter pelo menos 20 caracteres');
    }
  }

  // Validar configurações
  if (!data.configuracoes) {
    errors.push('configuracoes é obrigatório');
  } else {
    const numVar = data.configuracoes.num_variacoes;
    if (!numVar || numVar < 5 || numVar > 10) {
      errors.push('num_variacoes deve estar entre 5 e 10');
    }

    const duracoes = ['15-30s', '30-60s', '60-90s', '90s+'];
    if (!data.configuracoes.duracao_video || !duracoes.includes(data.configuracoes.duracao_video)) {
      errors.push('duracao_video inválida');
    }

    const plataformas = ['instagram', 'tiktok', 'youtube', 'todas'];
    if (!data.configuracoes.plataforma_principal || !plataformas.includes(data.configuracoes.plataforma_principal)) {
      errors.push('plataforma_principal inválida');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
