import { useState, useEffect } from 'react';

interface ComplementoSelecionado {
  complemento_id: string;
  quantidade: number;
  valor: number;
}

interface ProdutoComplementosProps {
  produtoId: string;
  empresaId: string;
  onChange: (complementos: ComplementoSelecionado[]) => void;
}

export default function ProdutoComplementos({ 
  produtoId, 
  empresaId, 
  onChange 
}: ProdutoComplementosProps) {
  const [selecionados, setSelecionados] = useState<ComplementoSelecionado[]>([]);

  useEffect(() => {
    onChange(selecionados);
  }, [selecionados, onChange]);

  // For now, return null as complementos functionality needs to be set up in the database
  return null;

}