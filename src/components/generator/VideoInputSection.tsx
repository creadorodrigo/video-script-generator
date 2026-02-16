'use client';

import { useState } from 'react';
import { VideoInput } from '@/types';

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
  const addVideo = () => {
    if (videos.length < maxVideos) {
      onChange([...videos, { url: '', platform: 'youtube' }]);
    }
  };

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    onChange(newVideos);
  };

  const updateVideo = (index: number, url: string) => {
    const newVideos = [...videos];
    let platform: 'youtube' | 'instagram' | 'tiktok' = 'youtube';
    
    if (url.includes('instagram.com')) {
      platform = 'instagram';
    } else if (url.includes('tiktok.com')) {
      platform = 'tiktok';
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      platform = 'youtube';
    }
    
    newVideos[index] = { url, platform };
    onChange(newVideos);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        Videos de Referencia
      </h2>
      
      <p className="text-gray-600 mb-4">
        Cole ate {maxVideos} links de videos:
      </p>

      <div className="space-y-3">
        {videos.map((video, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="url"
              value={video.url}
              onChange={(e) => updateVideo(index, e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={() => removeVideo(index)}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              X
            </button>
          </div>
        ))}

        {videos.length < maxVideos && (
          <button
            onClick={addVideo}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            + Adicionar link
          </button>
        )}
      </div>
    </div>
  );
}
