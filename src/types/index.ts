// Types para o Video Script Generator

export type Platform = 'instagram' | 'tiktok' | 'youtube';
export type ThemeType = 'descricao' | 'link';
export type Objetivo = 'leads' | 'venda' | 'engajamento';
export type DuracaoVideo = '15-30s' | '30-60s' | '60-90s' | '90s+';
export type PlataformaPrincipal = 'instagram' | 'tiktok' | 'youtube' | 'todas';

export interface VideoInput {
  url: string;
  platform: Platform;
}

export interface VideoWithTranscription extends VideoInput {
  transcription: string;
}

export interface NovoTema {
  tipo: ThemeType;
  conteudo: string;
  publico_alvo?: string;
  objetivo?: Objetivo;
}

export interface ConfiguracoesGeracao {
  num_variacoes: number;
  duracao_video: DuracaoVideo;
  plataforma_principal: PlataformaPrincipal;
}

export interface GanchoAnalise {
  tipo: string;
  frequencia: string;
  duracao_media_segundos: number;
  exemplos: string[];
}

export interface CorpoAnalise {
  estrutura_dominante: string;
  num_pontos_medio: number;
  elementos_comuns: string[];
}

export interface CTAAnalise {
  tipo_dominante: string;
  posicionamento_medio: string;
  exemplos: string[];
}

export interface AnaliseConsolidada {
  videos_analisados: number;
  padroes_ganchos: GanchoAnalise[];
  padroes_corpo: CorpoAnalise;
  padroes_cta: CTAAnalise;
}

export interface ElementoRoteiro {
  texto: string;
  timing: string;
  tipo?: string;
}

export interface Roteiro {
  id: string;
  numero: number;
  titulo: string;
  score_aderencia: number;
  duracao_estimada_segundos: number;
  plataformas_recomendadas: Platform[];
  gancho: ElementoRoteiro;
  corpo: ElementoRoteiro & {
    estrutura: string;
    pontos_principais: string[];
  };
  cta: ElementoRoteiro;
  notas_criacao: string;
}

export interface GenerationRequest {
  videos_referencia?: VideoInput[];
  padrao_salvo_id?: string;
  novo_tema: NovoTema;
  configuracoes: ConfiguracoesGeracao;
}

export interface GenerationResponse {
  request_id: string;
  timestamp: string;
  analise_consolidada: AnaliseConsolidada;
  roteiros_gerados: Roteiro[];
}

export interface ProcessingState {
  step: 'extracting' | 'analyzing' | 'generating' | 'complete' | 'error';
  percentage: number;
  message: string;
  estimatedTimeRemaining: number;
}
export type GenerationConfig = ConfiguracoesGeracao;

