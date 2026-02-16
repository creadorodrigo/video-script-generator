'use client';

import { ConfiguracoesGeracao } from '@/types';

interface Props {
  configuracoes: ConfiguracoesGeracao;
  onChange: (c: ConfiguracoesGeracao) => void;
}

export default function GenerationSettings({ configuracoes, onChange }: Props) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Configuracoes</h2>
      <label className="block mb-2">
        Numero de variacoes: {configuracoes.num_variacoes}
      </label>
      <input
        type="range"
        min="5"
        max="10"
        value={configuracoes.num_variacoes}
        onChange={(e) => onChange({ ...configuracoes, num_variacoes: parseInt(e.target.value) })}
        className="w-full"
      />
    </div>
  );
}
