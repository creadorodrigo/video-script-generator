import Anthropic from '@anthropic-ai/sdk';
import {
  VideoWithTranscription,
  AnaliseConsolidada,
  Roteiro,
  NovoTema,
  ConfiguracoesGeracao,
} from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Analisa múltiplos vídeos e identifica padrões comuns
 */
export async function analyzeVideoPatterns(
  videos: VideoWithTranscription[]
): Promise<AnaliseConsolidada> {
  const prompt = buildAnalysisPrompt(videos);

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001', // Haiku para custo mínimo
    max_tokens: 2000,
    temperature: 0.3,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Resposta inválida da API');
  }

  // Parse JSON da resposta
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Não foi possível extrair JSON da resposta');
  }

  return JSON.parse(jsonMatch[0]) as AnaliseConsolidada;
}

/**
 * Gera roteiros baseados nos padrões identificados
 */
export async function generateScripts(
  analise: AnaliseConsolidada,
  novoTema: NovoTema,
  configuracoes: ConfiguracoesGeracao
): Promise<Roteiro[]> {
  const prompt = buildGenerationPrompt(analise, novoTema, configuracoes);

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001', // Haiku para custo mínimo
    max_tokens: 4000,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Resposta inválida da API');
  }

  // Parse JSON da resposta
  const jsonMatch = content.text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Não foi possível extrair array de roteiros da resposta');
  }

  return JSON.parse(jsonMatch[0]) as Roteiro[];
}

/**
 * Constrói prompt para análise de padrões
 */
function buildAnalysisPrompt(videos: VideoWithTranscription[]): string {
  const videosText = videos
    .map(
      (v, i) => `
VÍDEO ${i + 1} (${v.platform.toUpperCase()}):
${v.transcription}
---`
    )
    .join('\n');

  return `Você é um especialista em análise de copywriting para vídeos virais de alta conversão.

VÍDEOS DE REFERÊNCIA:
${videosText}

TAREFA:
Analise esses ${videos.length} vídeos e identifique os padrões vencedores.

Para cada categoria abaixo, identifique:

1. GANCHOS (primeiros 3-7 segundos):
   - Tipos predominantes (pergunta, estatística, controvérsia, afirmação chocante, história)
   - Frequência de cada tipo
   - Duração média em segundos
   - Até 3 exemplos mais impactantes

2. CORPO (desenvolvimento do conteúdo):
   - Estrutura narrativa dominante (problema-agitação-solução, storytelling, lista de pontos, etc)
   - Número médio de pontos/argumentos principais
   - Elementos de persuasão comuns (prova social, escassez, autoridade, dados)

3. CTA (call-to-action):
   - Tipo dominante (direto, suave, urgência, curiosidade)
   - Posicionamento médio (ex: "últimos 5-7s")
   - Até 3 exemplos mais efetivos

RETORNE APENAS um objeto JSON válido no seguinte formato (sem markdown, sem explicações):

{
  "videos_analisados": ${videos.length},
  "padroes_ganchos": [
    {
      "tipo": "pergunta_provocativa",
      "frequencia": "3/${videos.length}",
      "duracao_media_segundos": 4.5,
      "exemplos": ["exemplo 1", "exemplo 2"]
    }
  ],
  "padroes_corpo": {
    "estrutura_dominante": "problema-agitacao-solucao",
    "num_pontos_medio": 3,
    "elementos_comuns": ["storytelling", "prova_social", "dados"]
  },
  "padroes_cta": {
    "tipo_dominante": "urgencia",
    "posicionamento_medio": "ultimos_5-7s",
    "exemplos": ["exemplo 1", "exemplo 2"]
  }
}`;
}

/**
 * Constrói prompt para geração de roteiros
 */
function buildGenerationPrompt(
  analise: AnaliseConsolidada,
  novoTema: NovoTema,
  configuracoes: ConfiguracoesGeracao
): string {
  return `Você é um copywriter expert em criar roteiros de vídeos de alta conversão.

PADRÕES VENCEDORES IDENTIFICADOS:
${JSON.stringify(analise, null, 2)}

NOVO PRODUTO/TEMA:
${novoTema.tipo === 'descricao' ? novoTema.conteudo : `Link: ${novoTema.conteudo}`}
${novoTema.publico_alvo ? `Público-alvo: ${novoTema.publico_alvo}` : ''}
${novoTema.objetivo ? `Objetivo: ${novoTema.objetivo}` : ''}

CONFIGURAÇÕES:
- Duração desejada: ${configuracoes.duracao_video}
- Plataforma principal: ${configuracoes.plataforma_principal}
- Número de variações: ${configuracoes.num_variacoes}

TAREFA:
Crie ${configuracoes.num_variacoes} roteiros DIFERENTES aplicando os padrões vencedores identificados.

REGRAS OBRIGATÓRIAS:
1. Cada roteiro deve ter um ângulo/abordagem único
2. MANTENHA a estrutura vencedora (tipo de gancho → estrutura de corpo → tipo de CTA)
3. Adapte o timing conforme duração solicitada
4. Use linguagem apropriada para ${configuracoes.plataforma_principal}
5. Pontue cada roteiro (0-10) baseado na aderência aos padrões vencedores
6. Calcule a duração estimada em segundos
7. Identifique as plataformas recomendadas para cada roteiro

FORMATO DE CADA ROTEIRO:
- numero: 1, 2, 3...
- titulo: Título criativo e descritivo (ex: "Pergunta Provocativa + Urgência")
- score_aderencia: número de 0 a 10
- duracao_estimada_segundos: número
- plataformas_recomendadas: array de plataformas
- gancho: { texto, timing, tipo }
- corpo: { texto, timing, estrutura, pontos_principais: array }
- cta: { texto, timing, tipo }
- notas_criacao: breve explicação de por que este roteiro funciona

RETORNE APENAS um array JSON válido com ${configuracoes.num_variacoes} roteiros (sem markdown, sem explicações):

[
  {
    "id": "rot-1",
    "numero": 1,
    "titulo": "...",
    ...
  }
]`;
}
