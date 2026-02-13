'use client';

import { useState } from 'react';
import { VideoReference } from '@/types';

interface VideoInputSectionProps {
  videos: VideoReference[];
  onChange: (videos: VideoReference[]) => void;
  maxVideos?: number;
}

export default function VideoInputSection({ 
  videos, 
  onChange, 
  maxVideos = 5 
}: VideoInputSectionProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const identifyPlatform = (url: string): 'instagram' | 'tiktok' | 'youtube' | null => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('tiktok.com')) return 'tiktok';
    return null;
  };

  const handleAddVideo = () => {
    setError(null);

    if (!inputValue.trim()) {
      setError('Por favor, insira uma URL');
      return;
    }

    if (videos.length >= maxVideos) {
      setError(`Máximo de ${maxVideos} vídeos permitido`);
      return;
    }

    const platform = identifyPlatform(inputValue);
    if (!platform) {
      setError('URL inválida. Use links do Instagram, TikTok ou YouTube');
      return;
    }

    // Verifica duplicata
    if (videos.some(v => v.url === inputValue)) {
      setError('Este vídeo já foi adicionado');
      return;
    }

    onChange([...videos, { url: inputValue, platform }]);
    setInputValue('');
  };

  const handleRemoveVideo = (index: number) => {
    onChange(videos.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddVideo();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vídeos de Referência ({videos.length}/{maxVideos})
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Cole links de vídeos do Instagram, TikTok ou YouTube que têm bom desempenho
        </p>
      </div>

      {/* Lista de vídeos adicionados */}
      {videos.length > 0 && (
        <div className="space-y-2 mb-4">
          {videos.map((video, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-shrink-0">
                {video.platform === 'youtube' && (
                  <span className="text-red-600 text-xl">▶️</span>
                )}
                {video.platform === 'instagram' && (
                  <span className="text-pink-600 text-xl">📷</span>
                )}
                {video.platform === 'tiktok' && (
                  <span className="text-black text-xl">🎵</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {video.platform}
                </p>
                <p className="text-sm text-gray-900 truncate">
                  {video.url}
                </p>
              </div>
              <button
                onClick={() => handleRemoveVideo(index)}
                className="flex-shrink-0 text-red-600 hover:text-red-800 font-bold"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input para novo vídeo */}
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="url"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="https://youtube.com/watch?v=... ou instagram.com/reel/..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={videos.length >= maxVideos}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
        <button
          onClick={handleAddVideo}
          disabled={videos.length >= maxVideos}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
        >
          Adicionar
        </button>
      </div>

      {videos.length < maxVideos && (
        <p className="text-xs text-gray-500">
          Você pode adicionar mais {maxVideos - videos.length} vídeo(s)
        </p>
      )}
    </div>
  );
}
