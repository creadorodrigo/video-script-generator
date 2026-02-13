'use client';

import { useState } from 'react';
import { VideoInput } from '@/types';
import { identifyPlatform } from '@/lib/transcript-extractor';

interface VideoInputSectionProps {
  videos: VideoInput[];
  onChange: (videos: VideoInput[]) => void;
  maxVideos?: number;
}

export default function VideoInputSection({
  videos,
  onChange,
  maxVideos = 5,
}: VideoInputSectionProps) {
  const [errors, setErrors] = useState<Record<number, string>>({});

  const addVideo = () => {
    if (videos.length < maxVideos) {
      onChange([...videos, { url: '', platform: 'youtube' }]);
    }
  };

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    onChange(newVideos);
    
    // Remove erro relacionado
    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
  };

  const updateVideo = (index: number, url: string) => {
    const newVideos = [...videos];
    
    try {
      const platform = identifyPlatform(url);
      newVideos[index] = { url, platform };
      
      // Remove erro se estava inválido
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    } catch (error) {
      newVideos[index] = { url, platform: 'youtube' };
      
      // Adiciona erro
      setErrors({
        ...errors,
        [index]: 'URL inválida. Use YouTube, Instagram ou TikTok',
      });
    }
    
    onChange(newVideos);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        📹 Vídeos de Referência (Padrões Vencedores)
      </h2>
      
      <p className="text-gray-600 mb-4">
        Cole até {maxVideos} links de vídeos de referência:
      </p>

      <div className="space-y-3">
        {videos.map((video, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-mono">🔗 {index + 1}:</span>
                <input
                  type="url"
                  value={video.url}
                  onChange={(e) => updateVideo(index, e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => removeVideo(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                  aria-label="Remover vídeo"
                >
                  ❌
                </button>
              </div>
              {errors[index] && (
                <p className="text-red-500 text-sm mt-1 ml-12">{errors[index]}</p>
              )}
              {video.url && !errors[index] && (
                <p className="text-green-600 text-sm mt-1 ml-12">
                  ✓ {video.platform.charAt(0).toUpperCase() + video.platform.slice(1)}
                </p>
              )}
            </div>
          </div>
        ))}

        {videos.length < maxVideos && (
          <button
            onClick={addVideo}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            + Adicionar link (máx. {maxVideos})
          </button>
        )}
      </div>

      {videos.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            ⚠️ Adicione pelo menos 1 vídeo de referência para continuar
          </p>
        </div>
      )}
    </div>
  );
}
