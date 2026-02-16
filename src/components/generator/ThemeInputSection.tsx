'use client';

import { NovoTema } from '@/types';

interface Props {
  tema: NovoTema;
  onChange: (t: NovoTema) => void;
}

export default function ThemeInputSection({ tema, onChange }: Props) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Tema</h2>
      <textarea
        value={tema.conteudo}
        onChange={(e) => onChange({ ...tema, conteudo: e.target.value })}
        className="w-full p-2 border rounded"
        rows={4}
        placeholder="Descreva seu produto"
      />
    </div>
  );
}
