import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface Endereco {
  id: string;
  endereco: string;
  num_endereco: string;
  complemento: string;
  cep: string;
  cidade: string;
  estado: string;
  descr_endereco: string;
}

interface EnderecoSelectorProps {
  clienteId: string;
  empresaId: string;
  value: string;
  onChange: (enderecoId: string) => void;
}

export default function EnderecoSelector({ clienteId, empresaId, value, onChange }: EnderecoSelectorProps) {
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newEndereco, setNewEndereco] = useState({
    descr_endereco: '',
    endereco: '',
    num_endereco: '',
    complemento: '',
    cep: '',
    cidade: '',
    estado: ''
  });

  useEffect(() => {
    if (clienteId && empresaId) {
      fetchEnderecos();
    }
  }, [clienteId, empresaId]);

  const fetchEnderecos = async () => {
    try {
      const { data, error } = await supabase
        .from('endereco')
        .select('*')
        .eq('cliente_id', clienteId)
        .eq('empresa_id', empresaId)
        .order('descr_endereco');

      if (error) {
        console.error('Erro ao buscar endereços:', error);
        return;
      }

      setEnderecos(data || []);
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
    }
  };

  const handleSaveEndereco = async () => {
    if (!newEndereco.descr_endereco || !newEndereco.endereco) {
      toast({
        title: "Erro",
        description: "Preencha ao menos a descrição e o endereço",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('endereco')
        .insert({
          cliente_id: clienteId,
          empresa_id: empresaId,
          ...newEndereco
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar endereço:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar endereço",
          variant: "destructive"
        });
        return;
      }

      setEnderecos([...enderecos, data]);
      onChange(data.id);
      setShowNewForm(false);
      setNewEndereco({
        descr_endereco: '',
        endereco: '',
        num_endereco: '',
        complemento: '',
        cep: '',
        cidade: '',
        estado: ''
      });

      toast({
        title: "Sucesso",
        description: "Endereço salvo com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar endereço",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="endereco">Endereço de entrega</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowNewForm(!showNewForm)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo endereço
        </Button>
      </div>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um endereço" />
        </SelectTrigger>
        <SelectContent>
          {enderecos.map((endereco) => (
            <SelectItem key={endereco.id} value={endereco.id}>
              {endereco.descr_endereco}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showNewForm && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <h4 className="font-medium">Novo Endereço</h4>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="descr_endereco">Descrição (ex: Casa, Trabalho)</Label>
              <Input
                id="descr_endereco"
                value={newEndereco.descr_endereco}
                onChange={(e) => setNewEndereco({ ...newEndereco, descr_endereco: e.target.value })}
                placeholder="Ex: Casa"
              />
            </div>

            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={newEndereco.endereco}
                onChange={(e) => setNewEndereco({ ...newEndereco, endereco: e.target.value })}
                placeholder="Rua, Avenida..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="num_endereco">Número</Label>
                <Input
                  id="num_endereco"
                  value={newEndereco.num_endereco}
                  onChange={(e) => setNewEndereco({ ...newEndereco, num_endereco: e.target.value })}
                  placeholder="123"
                />
              </div>
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={newEndereco.cep}
                  onChange={(e) => setNewEndereco({ ...newEndereco, cep: e.target.value })}
                  placeholder="00000-000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                value={newEndereco.complemento}
                onChange={(e) => setNewEndereco({ ...newEndereco, complemento: e.target.value })}
                placeholder="Apto, bloco..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={newEndereco.cidade}
                  onChange={(e) => setNewEndereco({ ...newEndereco, cidade: e.target.value })}
                  placeholder="São Paulo"
                />
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={newEndereco.estado}
                  onChange={(e) => setNewEndereco({ ...newEndereco, estado: e.target.value })}
                  placeholder="SP"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveEndereco} className="flex-1">
              Salvar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowNewForm(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}