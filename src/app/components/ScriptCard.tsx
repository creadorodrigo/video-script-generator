'use client';

import { GeneratedScript } from '@/types';
import { useState } from 'react';

interface ScriptCardProps {
  script: GeneratedScript;
  onCopy?: () => void;
}

export default function ScriptCard({ script, onCopy }: ScriptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = () => {
    const fullScript = `
ROTEIRO #${script.number}: ${script.title}
Duração: ${script.estimatedDurationSeconds}s
Score: ${script.adherenceScore}/10

🎣 GANCHO (${script.hook.timing}):
${script.hook.text}

📝 CORPO (${script.body.timing}):
${script.body.text}

🎯 CTA (${script.cta.timing}):
${script.cta.text}

NOTAS:
${script.creationNotes}
    `.trim();

    navigator.clipboard.writeText(fullScript);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600 bg-green-100';
    if (score >= 7) return 'text-blue-600 bg-blue-100';
    if (score >= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg font-bold text-gray-900">
                Roteiro #{script.number}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(script.adherenceScore)}`}>
                ⭐ {script.adherenceScore.toFixed(1)}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {script.title}
            </h3>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                ⏱️ {script.estimatedDurationSeconds}s
              </span>
              <span className="flex items-center gap-1">
                📱 {script.recommendedPlatforms.join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 bg-white">
        {/* Gancho */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎣</span>
            <h4 className="font-semibold text-gray-900">
              GANCHO
            </h4>
            <span className="text-sm text-gray-500">({script.hook.timing})</span>
          </div>
          <div className="ml-8 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
            <p className="text-gray-800 leading-relaxed">{script.hook.text}</p>
          </div>
        </div>

        {/* Corpo */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📝</span>
            <h4 className="font-semibold text-gray-900">
              CORPO
            </h4>
            <span className="text-sm text-gray-500">({script.body.timing})</span>
          </div>
          <div className="ml-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
              {script.body.text}
            </p>
            {script.body.mainPoints.length > 0 && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Pontos principais:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {script.body.mainPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎯</span>
            <h4 className="font-semibold text-gray-900">
              CTA
            </h4>
            <span className="text-sm text-gray-500">({script.cta.timing})</span>
          </div>
          <div className="ml-8 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
            <p className="text-gray-800 leading-relaxed font-medium">{script.cta.text}</p>
          </div>
        </div>

        {/* Notas */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 italic">
            💡 {script.creationNotes}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={handleCopyAll}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              ✅ Copiado!
            </>
          ) : (
            <>
              📋 Copiar Roteiro Completo
            </>
          )}
        </button>
      </div>
    </div>
  );
}
