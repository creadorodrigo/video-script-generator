'use client';

import { NovoTema, Objetivo } from '@/types';

interface ThemeInputSectionProps {
  tema: NovoTema;
  onChange: (tema: NovoTema) => void;
}

export default function ThemeInputSection({ tema, onChange }: ThemeInputSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">🎯 Novo Tema/Produto</h2>

      {/* Toggle Tipo */}
      <div className="mb-4">
        <p className="text-gray-700 mb-2">Como você quer informar o novo tema?</p>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="themeType"
              checked={tema.tipo === 'descricao'}
              onChange={() => onChange({ ...tema, tipo: 'descricao' })}
              className="mr-2"
            />
            <span>Descrição manual</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="themeType"
              checked={tema.tipo === 'link'}
              onChange={() => onChange({ ...tema, tipo: 'link' })}
              className="mr-2"
            />
            <span>Link do produto</span>
          </label>
        </div>
      </div>

      {/* Input de Descrição ou Link */}
      {tema.tipo === 'descricao' ? (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Descreva seu produto/tema:
          </label>
          <textarea
            value={tema.conteudo}
            onChange={(e) => onChange({ ...tema, conteudo: e.target.value })}
            placeholder="Ex: Curso de vendas B2B para iniciantes com método validado que gerou R$2M em 12 meses. Ensina prospecção, qualificação de leads e fechamento de vendas complexas..."
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            {tema.conteudo.length} / 1000 caracteres (mínimo 20)
          </p>
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            🔗 Link do produto:
          </label>
          <input
            type="url"
            value={tema.conteudo}
            onChange={(e) => onChange({ ...tema, conteudo: e.target.value })}
            placeholder="https://seuproduto.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Público-alvo (opcional) */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          📌 Público-alvo <span className="text-gray-400">(opcional)</span>:
        </label>
        <input
          type="text"
          value={tema.publico_alvo || ''}
          onChange={(e) => onChange({ ...tema, publico_alvo: e.target.value })}
          placeholder="Ex: Vendedores B2B iniciantes, 25-40 anos"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Objetivo (opcional) */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          🎯 Objetivo do vídeo <span className="text-gray-400">(opcional)</span>:
        </label>
        <div className="flex gap-4">
          {(['leads', 'venda', 'engajamento'] as Objetivo[]).map((obj) => (
            <label key={obj} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tema.objetivo === obj}
                onChange={() =>
                  onChange({
                    ...tema,
                    objetivo: tema.objetivo === obj ? undefined : obj,
                  })
                }
                className="mr-2"
              />
              <span className="capitalize">{obj}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Validação */}
      {tema.conteudo.length > 0 && tema.conteudo.length < 20 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            ⚠️ Descreva seu produto com pelo menos 20 caracteres para gerar
            roteiros de qualidade
          </p>
        </div>
      )}
    </div>
  );
}
