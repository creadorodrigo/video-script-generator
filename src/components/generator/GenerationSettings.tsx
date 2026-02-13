'use client';

import { ConfiguracoesGeracao } from '@/types';

interface GenerationSettingsProps {
  configuracoes: ConfiguracoesGeracao;
  onChange: (configuracoes: ConfiguracoesGeracao) => void;
}

export default function GenerationSettings({
  configuracoes,
  onChange,
}: GenerationSettingsProps) {
  const duracoes: DuracaoVideo[] = ['15-30s', '30-60s', '60-90s', '90s+'];
  const plataformas: PlataformaPrincipal[] = ['instagram', 'tiktok', 'youtube', 'todas'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">⚙️ Configurações de Geração</h2>

      {/* Slider de Variações */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-3">
          Quantas variações de roteiro você precisa?
        </label>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-center mb-2">
            <span className="text-4xl font-bold text-blue-600">
              {configuracoes.num_variacoes}
            </span>
            <span className="text-gray-600 ml-2">variações</span>
          </div>
          <input
            type="range"
            min="5"
            max="10"
            value={configuracoes.num_variacoes}
            onChange={(e) =>
              onChange({
                ...configuracoes,
                num_variacoes: parseInt(e.target.value),
              })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>5</span>
            <span>10</span>
          </div>
        </div>
      </div>

      {/* Duração do Vídeo */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">
          📏 Duração estimada do vídeo:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {duracoes.map((duracao) => (
            <label
              key={duracao}
              className={`
                flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all
                ${
                  configuracoes.duracao_video === duracao
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <input
                type="radio"
                name="duracao"
                value={duracao}
                checked={configuracoes.duracao_video === duracao}
                onChange={() =>
                  onChange({ ...configuracoes, duracao_video: duracao })
                }
                className="sr-only"
              />
              <span>{duracao}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Plataforma Principal */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">
          📱 Plataforma principal:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {plataformas.map((plataforma) => (
            <label
              key={plataforma}
              className={`
                flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all
                ${
                  configuracoes.plataforma_principal === plataforma
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <input
                type="radio"
                name="plataforma"
                value={plataforma}
                checked={configuracoes.plataforma_principal === plataforma}
                onChange={() =>
                  onChange({ ...configuracoes, plataforma_principal: plataforma })
                }
                className="sr-only"
              />
              <span className="capitalize">{plataforma}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
