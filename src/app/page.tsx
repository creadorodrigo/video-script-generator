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
    return <div className="min-h-screen flex items-center justify-center">
      <p>Carregando...</p>
    </div>;
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
            ⚙️ Processando seus roteiros...
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
              <p className="text-sm text-gray-500">
                {processing.percentage}% completo
              </p>
              {processing.estimatedTimeRemaining > 0 && (
                <p className="text-sm text-gray-500">
                  Tempo estimado: ~{processing.estimatedTimeRemaining}s
                </p>
              )}
            </div>

            <div className="flex justify-center gap-2 pt-4">
              <span className={processing.step === 'extracting' ? 'text-blue-600' : 'text-gray-400'}>
                ✅ Extração
              </span>
              <span>→</span>
              <span className={processing.step === 'analyzing' ? 'text-blue-600' : 'text-gray-400'}>
                {processing.step === 'analyzing' || processing.step === 'generating' ? '⏳' : '⏺️'} Análise
              </span>
              <span>→</span>
              <span className={processing.step === 'generating' ? 'text-blue-600' : 'text-gray-400'}>
                {processing.step === 'generating' ? '⏳' : '⏺️'} Geração
              </span>
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
              ✨ {results.roteiros_gerados.length} Roteiros Gerados com Sucesso
            </h1>
            <p className="text-gray-600">
              Baseados nos padrões vencedores identificados
            </p>
            <button
              onClick={() => {
                setResults(null);
