'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import VideoInputSection from '@/components/generator/VideoInputSection';
import ThemeInputSection from '@/components/generator/ThemeInputSection';
import GenerationSettings from '@/components/generator/GenerationSettings';
import ScriptCard from '@/components/results/ScriptCardNew';
import {
  VideoInput,
  NovoTema,
  ConfiguracoesGeracao,
  GenerationResponse,
  ProcessingState,
} from '@/types';

export default function GeneratorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [videos, setVideos] = useState<VideoInput[]>([
    { url: '', platform: 'youtube' },
  ]);

  const [tema, setTema] = useState<NovoTema>({
    tipo: 'descricao',
    conteudo: '',
  });

  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesGeracao>({
    num_variacoes: 7,
    duracao_video: '60-90s',
    plataforma_principal: 'todas',
  });

  const [processing, setProcessing] = useState<ProcessingState | null>(null);
  const [results, setResults] = useState<GenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const canGenerate = () => {
    const hasValidVideos = videos.some((v) => v.url.length > 0);
    const hasValidTheme = tema.conteudo.length >= 20;
    return hasValidVideos && hasValidTheme;
  };

  const handleGenerate = async () => {
    if (!canGenerate()) {
      setError('Complete os campos obrigatórios antes de gerar');
      return;
    }

    setError(null);
    setResults(null);
    
    setProcessing({
      step: 'extracting',
      percentage: 10,
      message: 'Extraindo transcrições dos vídeos...',
      estimatedTimeRemaining: 60,
    });

    try {
      const validVideos = videos.filter((v) => v.url.length > 0);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videos_referencia: validVideos,
          novo_tema: tema,
          configuracoes: configuracoes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar roteiros');
      }

      setProcessing({
        step: 'analyzing',
        percentage: 50,
        message: 'Analisando padrões vencedores...',
        estimatedTimeRemaining: 30,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setProcessing({
        step: 'generating',
        percentage: 80,
        message: `Gerando ${configuracoes.num_variacoes} variações de roteiros...`,
        estimatedTimeRemaining: 15,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const data: GenerationResponse = await response.json();

      setProcessing({
        step: 'complete',
        percentage: 100,
        message: 'Roteiros gerados com sucesso!',
        estimatedTimeRemaining: 0,
      });

      setTimeout(() => {
        setResults(data);
        setProcessing(null);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setProcessing({
        step: 'error',
        percentage: 0,
        message: 'Erro ao processar',
        estimatedTimeRemaining: 0,
      });
      setTimeout(() => setProcessing(null), 2000);
    }
  };

  if (processing && processing.step !== 'complete') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6">
            Processando seus roteiros...
          </h2>
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${processing.percentage}%` }}
              />
            </div>
            <div className="text-center space-y-2">
              <p className="text-gray-700">{processing.message}</p>
              <p className="text-sm text-gray-500">{processing.percentage}% completo</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">
              Roteiros Gerados com Sucesso
            </h1>
            <button
              onClick={() => {
                setResults(null);
                setVideos([{ url: '', platform: 'youtube' }]);
                setTema({ tipo: 'descricao', conteudo: '' });
              }}
              className="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Gerar Novos Roteiros
            </button>
          </div>
          <div className="space-y-6">
            {results.roteiros_gerados.map((roteiro) => (
              <ScriptCard key={roteiro.id} roteiro={roteiro} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Gerador de Roteiros Inteligentes</h1>
          <p className="text-gray-600">
            Analise vídeos vencedores e gere roteiros otimizados com IA
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <VideoInputSection videos={videos} onChange={setVideos} />
          <ThemeInputSection tema={tema} onChange={setTema} />
          <GenerationSettings configuracoes={configuracoes} onChange={setConfiguracoes} />

          <div className="flex justify-center pt-6">
            <button
              onClick={handleGenerate}
              disabled={!canGenerate()}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                canGenerate()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              GERAR ROTEIROS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
