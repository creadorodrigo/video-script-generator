'use client';

import { Roteiro } from '@/types';

interface Props {
  roteiro: Roteiro;
}

export default function ScriptCard({ roteiro }: Props) {
  return (
    <div className="bg-white p-6 rounded shadow mb-4">
      <h3 className="text-lg font-bold mb-2">
        Roteiro #{roteiro.numero} - {roteiro.titulo}
      </h3>
      <div className="mb-2">
        <strong>Gancho:</strong> {roteiro.gancho.texto}
      </div>
      <div className="mb-2">
        <strong>Corpo:</strong> {roteiro.corpo.texto}
      </div>
      <div className="mb-2">
        <strong>CTA:</strong> {roteiro.cta.texto}
      </div>
    </div>
  );
}
