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

  // Estados
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

  // Verificar autenticação
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">
      <p>Carregando...</p>
    </div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  // Validação
  const canGenerate = () => {
    const hasValidVideos = videos.some((v) => v.url.length > 0);
    const hasValidTheme = tema.conteudo.length >= 20;
    return hasValidVideos && hasValidTheme;
  };

  // Gerar roteiros
  const handleGenerate = async () => {
    if (!canGenerate()) {
      setError('Complete os campos obrigatórios antes de gerar');
      return;
    }

    setError(null);
    setResults(null);
    
    // Simular processamento
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

      // Simular progresso de análise
      setProcessing({
        step: 'analyzing',
        percentage: 50,
        message: 'Analisando padrões vencedores...',
        estimatedTimeRemaining: 30,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simular progresso de geração
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

  // Renderizar tela de processamento
  if (processing && processing.step !== 'complete') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6">
            ⚙️ Processando seus roteiros...
          </h2>

          <div className="space-y-4">
            {/* Barra de progresso */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${processing.percentage}%` }}
              />
            </div>

            {/* Status */}
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

            {/* Indicador de etapa */}
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

  // Renderizar resultados
  if (results) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Cabeçalho */}
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
                setVideos([{ url: '', platform: 'youtube' }]);
                setTema({ tipo: 'descricao', conteudo: '' });
              }}
              className="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              🔄 Gerar Novos Roteiros
            </button>
          </div>

          {/* Análise Consolidada */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              📊 Padrões Identificados nos Vídeos de Referência
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Ganchos */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-blue-700 mb-2">🎣 Ganchos Dominantes</h3>
                <ul className="text-sm space-y-1 text-gray-700">
                  {results.analise_consolidada.padroes_ganchos.map((g, i) => (
                    <li key={i}>• {g.tipo} ({g.frequencia})</li>
                  ))}
                </ul>
              </div>

              {/* Corpo */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-purple-700 mb-2">📝 Estrutura do Corpo</h3>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• {results.analise_consolidada.padroes_corpo.estrutura_dominante}</li>
                  <li>• {results.analise_consolidada.padroes_corpo.num_pontos_medio} pontos médios</li>
                </ul>
              </div>

              {/* CTA */}
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-orange-700 mb-2">🎯 CTAs Vencedores</h3>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Tipo: {results.analise_consolidada.padroes_cta.tipo_dominante}</li>
                  <li>• Posição: {results.analise_consolidada.padroes_cta.posicionamento_medio}</li>
                </ul>
              </div>
            </div>

            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              💾 Salvar Padrão na Biblioteca
            </button>
          </div>

          {/* Roteiros */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">📜 Roteiros Gerados</h2>
            {results.roteiros_gerados
              .sort((a, b) => b.score_aderencia - a.score_aderencia)
              .map((roteiro) => (
                <ScriptCard key={roteiro.id} roteiro={roteiro} />
              ))}
          </div>

          {/* Ações finais */}
          <div className="mt-8 flex gap-4 justify-center">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
              📥 Exportar Todos (PDF)
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
              🔄 Gerar Novas Variações
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar formulário de geração
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">📹 Gerador de Roteiros Inteligentes</h1>
          <p className="text-gray-600">
            Analise vídeos vencedores e gere roteiros otimizados com IA
          </p>
          {session?.user && (
            <p className="text-sm text-gray-500 mt-2">
              Olá, {session.user.name || session.user.email}
            </p>
          )}
        </div>

        {/* Erro */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">❌ {error}</p>
          </div>
        )}

        {/* Formulário */}
        <div className="space-y-6">
          <VideoInputSection videos={videos} onChange={setVideos} />
          <ThemeInputSection tema={tema} onChange={setTema} />
          <GenerationSettings configuracoes={configuracoes} onChange={setConfiguracoes} />

          {/* Botão de Geração */}
          <div className="flex justify-center pt-6">
            <button
              onClick={handleGenerate}
              disabled={!canGenerate()}
              className={`
                px-8 py-4 rounded-lg font-bold text-lg transition-all
                ${
                  canGenerate()
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              🚀 GERAR ROTEIROS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
