import { Platform, VideoInput, VideoWithTranscription } from '@/types';

/**
 * Extrai transcrição de vídeo do YouTube, Instagram ou TikTok
 */
export async function extractTranscription(
  video: VideoInput
): Promise<VideoWithTranscription> {
  try {
    switch (video.platform) {
      case 'youtube':
        return await extractYouTubeTranscription(video);
      case 'instagram':
      case 'tiktok':
        // Para MVP, vamos usar web scraping simples ou retornar mock
        // Em produção, usar APIs específicas ou Whisper
        return await extractSocialMediaTranscription(video);
      default:
        throw new Error(`Plataforma não suportada: ${video.platform}`);
    }
  } catch (error) {
    console.error(`Erro ao extrair transcrição de ${video.url}:`, error);
    throw new Error(`Falha ao extrair transcrição: ${error}`);
  }
}

/**
 * Extrai transcrição do YouTube usando youtube-transcript
 */
async function extractYouTubeTranscription(
  video: VideoInput
): Promise<VideoWithTranscription> {
  try {
    // Importação dinâmica para evitar problemas de SSR
    const { YoutubeTranscript } = await import('youtube-transcript');
    
    const videoId = extractYouTubeVideoId(video.url);
    if (!videoId) {
      throw new Error('ID do vídeo YouTube não encontrado');
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const transcription = transcript.map((item) => item.text).join(' ');

    return {
      ...video,
      transcription: transcription.trim(),
    };
  } catch (error) {
    throw new Error(`Erro ao extrair transcrição do YouTube: ${error}`);
  }
}

/**
 * Extrai ID do vídeo do YouTube da URL
 */
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extrai transcrição de Instagram/TikTok
 * Para MVP: implementação simplificada ou mock
 * Para produção: usar Apify, scraping custom ou Whisper API
 */
async function extractSocialMediaTranscription(
  video: VideoInput
): Promise<VideoWithTranscription> {
  // MVP: Mock para demonstração
  // Em produção, implementar scraping real ou usar Whisper API
  
  console.warn(`[MVP] Usando transcrição mock para ${video.platform}`);
  
  const mockTranscriptions: Record<Platform, string> = {
  youtube: `Este vídeo vai mudar sua forma de pensar sobre isso.
  Nos últimos meses descobri um método incrível.
  Vou mostrar os 3 passos que usei para conseguir resultados.
  Link na descrição para saber mais detalhes.`,
  
  instagram: `Você sabia que 80% das pessoas fazem isso errado? 
  Eu cometi esse erro por anos até descobrir esse método. 
  Agora minha vida mudou completamente. 
  Link na bio para saber mais.`,
  
  tiktok: `Espera, você ainda não sabe disso? 
  Isso vai mudar tudo pra você. 
  Olha só o que acontece quando você faz assim. 
  Resultado incrível em apenas 7 dias. 
  Corre lá no link da bio!`,
};

  return {
    ...video,
    transcription: mockTranscriptions[video.platform as Platform],
  };
}

/**
 * Identifica a plataforma a partir da URL
 */
export function identifyPlatform(url: string): Platform {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('instagram.com')) {
    return 'instagram';
  }
  if (url.includes('tiktok.com')) {
    return 'tiktok';
  }
  throw new Error('Plataforma não reconhecida. Use YouTube, Instagram ou TikTok.');
}

/**
 * Valida se a URL é de uma plataforma suportada
 */
export function isValidVideoUrl(url: string): boolean {
  try {
    identifyPlatform(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Processa múltiplos vídeos em paralelo
 */
export async function extractMultipleTranscriptions(
  videos: VideoInput[]
): Promise<VideoWithTranscription[]> {
  return Promise.all(videos.map(extractTranscription));
}
