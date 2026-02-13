'use client';

import { Roteiro } from '@/types';

interface ScriptCardProps {
  roteiro: Roteiro;
}

export default function ScriptCard({ roteiro }: ScriptCardProps) {
  const copyToClipboard = () => {
    const text = `
ROTEIRO: ${roteiro.titulo}

GANCHO (${roteiro.gancho.timing}):
${roteiro.gancho.texto}

CORPO (${roteiro.corpo.timing}):
${roteiro.corpo.texto}

CTA (${roteiro.cta.timing}):
${roteiro.cta.texto}

---
Duração: ${roteiro.duracao_estimada_segundos}s
Plataformas: ${roteiro.plataformas_recomendadas.join(', ')}
    `.trim();

    navigator.clipboard.writeText(text);
    alert('Roteiro copiado!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            ROTEIRO #{roteiro.numero} - {roteiro.titulo}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>⏱️ {roteiro.duracao_estimada_segundos}s</span>
            <span>
              📱 {roteiro.plataformas_recomendadas.map(p => 
                p.charAt(0).toUpperCase() + p.slice(1)
              ).join(', ')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            ⭐ {roteiro.score_aderencia.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Gancho */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
            🎣 GANCHO ({roteiro.gancho.timing})
          </span>
          {roteiro.gancho.tipo && (
            <span className="text-xs text-gray-500 italic">{roteiro.gancho.tipo}</span>
          )}
        </div>
        <p className="text-gray-800 leading-relaxed bg-blue-50 p-3 rounded">
          {roteiro.gancho.texto}
        </p>
      </div>

      {/* Corpo */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
            📝 CORPO ({roteiro.corpo.timing})
          </span>
          {roteiro.corpo.estrutura && (
            <span className="text-xs text-gray-500 italic">{roteiro.corpo.estrutura}</span>
          )}
        </div>
        <p className="text-gray-800 leading-relaxed bg-purple-50 p-3 rounded whitespace-pre-line">
          {roteiro.corpo.texto}
        </p>
        {roteiro.corpo.pontos_principais && roteiro.corpo.pontos_principais.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-600 mb-1">Pontos principais:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              {roteiro.corpo.pontos_principais.map((ponto, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{ponto}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
            🎯 CTA ({roteiro.cta.timing})
          </span>
          {roteiro.cta.tipo && (
            <span className="text-xs text-gray-500 italic">{roteiro.cta.tipo}</span>
          )}
        </div>
        <p className="text-gray-800 leading-relaxed bg-orange-50 p-3 rounded">
          {roteiro.cta.texto}
        </p>
      </div>

      {/* Notas de Criação */}
      {roteiro.notas_criacao && (
        <div className="mb-4 p-3 bg-gray-50 rounded border-l-4 border-gray-400">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">💡 Por que funciona:</span>{' '}
            {roteiro.notas_criacao}
          </p>
        </div>
      )}

      {/* Ações */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={copyToClipboard}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          📋 Copiar Roteiro
        </button>
        <button
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          title="Editar roteiro"
        >
          ✏️ Editar
        </button>
        <button
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          title="Adicionar aos favoritos"
        >
          ⭐ Favoritar
        </button>
      </div>
    </div>
  );
}
