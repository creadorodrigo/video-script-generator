'use client';

import { GenerationConfig } from '@/types';

interface GenerationSettingsProps {
  config: GenerationConfig;
  onChange: (config: GenerationConfig) => void;
  minVariations?: number;
  maxVariations?: number;
}

export default function GenerationSettings({ 
  config, 
  onChange,
  minVariations = 5,
  maxVariations = 10 
}: GenerationSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Configurações de Geração
        </label>
      </div>

      {/* Slider de variações */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Quantas variações de roteiro você precisa?
        </label>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-blue-600">
              {config.numVariations}
            </span>
            <span className="ml-2 text-lg text-gray-600">variações</span>
          </div>
          <input
            type="range"
            min={minVariations}
            max={maxVariations}
            value={config.numVariations}
            onChange={(e) => onChange({ ...config, numVariations: parseInt(e.target.value) })}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{minVariations}</span>
            <span>{maxVariations}</span>
          </div>
        </div>
      </div>

      {/* Duração do vídeo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Duração estimada do vídeo
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: '15-30s', label: '15-30s' },
            { value: '30-60s', label: '30-60s' },
            { value: '60-90s', label: '60-90s' },
            { value: '90s+', label: '90s+' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ 
                ...config, 
                videoDuration: option.value as GenerationConfig['videoDuration']
              })}
              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                config.videoDuration === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              ⏱️ {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Plataforma */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Plataforma principal
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 'instagram', label: 'Instagram', emoji: '📷' },
            { value: 'tiktok', label: 'TikTok', emoji: '🎵' },
            { value: 'youtube', label: 'YouTube', emoji: '▶️' },
            { value: 'all', label: 'Todas', emoji: '🌐' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ 
                ...config, 
                platform: option.value as GenerationConfig['platform']
              })}
              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                config.platform === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              <span className="mr-2">{option.emoji}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
