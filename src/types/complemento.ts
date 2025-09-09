export interface Complemento {
  id: string;
  nome: string;
  descricao?: string;
  valor: number;
  ativo: boolean;
  empresa_id: string;
  created_at?: string;
  updated_at?: string;
}