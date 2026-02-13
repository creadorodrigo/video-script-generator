'use client';

import { ThemeInput } from '@/types';

interface ThemeInputSectionProps {
  theme: ThemeInput;
  onChange: (theme: ThemeInput) => void;
}

export default function ThemeInputSection({ theme, onChange }: ThemeInputSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Novo Produto/Tema
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Descreva o produto ou serviço para o qual você quer criar roteiros
        </p>
      </div>

      {/* Toggle entre descrição e link */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => onChange({ ...theme, type: 'description' })}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            theme.type === 'description'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📝 Descrição Manual
        </button>
        <button
          onClick={() => onChange({ ...theme, type: 'link' })}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            theme.type === 'link'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔗 Link do Produto
        </button>
      </div>

      {/* Campo de descrição */}
      {theme.type === 'description' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição do Produto/Serviço *
          </label>
          <textarea
            value={theme.content}
            onChange={(e) => onChange({ ...theme, content: e.target.value })}
            placeholder="Ex: Curso online de vendas B2B para iniciantes. Ensina método validado que gerou R$2M em 12 meses. Inclui 40 aulas, templates prontos e mentoria em grupo. Ideal para SDRs e profissionais em transição de carreira..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Mínimo 50 caracteres • {theme.content.length}/1000
          </p>
        </div>
      )}

      {/* Campo de link */}
      {theme.type === 'link' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link do Produto *
          </label>
          <input
            type="url"
            value={theme.content}
            onChange={(e) => onChange({ ...theme, content: e.target.value })}
            placeholder="https://seusite.com/produto"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            URL completa da página de vendas ou landing page
          </p>
        </div>
      )}

      {/* Campos opcionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Público-alvo (opcional)
          </label>
          <input
            type="text"
            value={theme.targetAudience || ''}
            onChange={(e) => onChange({ ...theme, targetAudience: e.target.value })}
            placeholder="Ex: Mulheres 25-35 anos, classe B+"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objetivo do vídeo (opcional)
          </label>
          <select
            value={theme.objective || ''}
            onChange={(e) => onChange({ 
              ...theme, 
              objective: e.target.value as 'leads' | 'sale' | 'engagement' | undefined 
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione...</option>
            <option value="leads">Gerar Leads</option>
            <option value="sale">Venda Direta</option>
            <option value="engagement">Engajamento</option>
          </select>
        </div>
      </div>
    </div>
  );
}
