'use client';

import { VideoInput } from '@/types';

interface Props {
  videos: VideoInput[];
  onChange: (v: VideoInput[]) => void;
}

export default function VideoInputSection({ videos, onChange }: Props) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Videos</h2>
      <input
        type="text"
        value={videos[0]?.url || ''}
        onChange={(e) => onChange([{ url: e.target.value, platform: 'youtube' }])}
        className="w-full p-2 border rounded"
        placeholder="Cole o link do video"
      />
    </div>
  );
}
