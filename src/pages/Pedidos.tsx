import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useTokenAuth } from '@/hooks/useTokenAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EnderecoSelector from '@/components/EnderecoSelector';
import { toast } from '@/hooks/use-toast';
import { Plus, Minus, ShoppingCart, Search, Trash2 } from 'lucide-react';

import OrderSuccessModal from '@/components/OrderSuccessModal';
import AppHeader from '@/components/AppHeader';
import ProdutoComplementos from '@/components/ProdutoComplementos';
import restaurantHeroImage from "@/assets/restaurant-hero.jpg";

interface Produto {
  id: string;
  descricao: string;
  idcategoria: string | null;
  vlrvenda: number;
  ativo: boolean;
  imagem: string | null;
  detalhes: string | null;
  categoria?: {
    id: string;
    nome: string;
    permite_dois_sabores?: boolean;
  };
}

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
}

interface ComplementoSelecionado {
  complemento_id: string;
  quantidade: number;
  valor: number;
}

interface CartItem {
  produto: Produto;
  quantidade: number;
  observacao?: string;
  sabores?: {
    produto: Produto;
    posicao: number;
  }[];
  valorCalculado?: number;
  complementos?: ComplementoSelecionado[];
}

interface Categoria {
  id: string;
  nome: string;
  permite_dois_sabores?: boolean;
}

interface Empresa {
  id: string;
  nome: string;
}

export default function Pedidos() {
  const { user } = useAuth();
  const { isValidToken, tokenData, isLoading: tokenLoading, validateToken, markTokenAsUsed } = useTokenAuth();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const [enderecos, setEnderecos] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [tipoPagamento, setTipoPagamento] = useState('');
  const [enderecoSelecionado, setEnderecoSelecionado] = useState('');
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todos');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');
  const [lastOrderTotal, setLastOrderTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para seleção de segunda metade
  const [selecionandoSegundaMetade, setSelecionandoSegundaMetade] = useState(false);
  const [primeiroSabor, setPrimeiroSabor] = useState<Produto | null>(null);
  const [mostrandoPerguntaMetade, setMostrandoPerguntaMetade] = useState(false);
  const [produtoParaPerguntar, setProdutoParaPerguntar] = useState<Produto | null>(null);

  // Estados para observação do item
  const [mostrandoObservacao, setMostrandoObservacao] = useState(false);
  const [produtoParaObservacao, setProdutoParaObservacao] = useState<Produto | null>(null);
  const [saboresParaObservacao, setSaboresParaObservacao] = useState<{ produto: Produto; posicao: number }[]>([]);
  const [valorCalculadoParaObservacao, setValorCalculadoParaObservacao] = useState<number | undefined>(undefined);
  const [observacaoAtual, setObservacaoAtual] = useState('');
  const [complementosAtual, setComplementosAtual] = useState<ComplementoSelecionado[]>([]);

  // Estado para animação do carrinho
  const [carrinhoAnimating, setCarrinhoAnimating] = useState(false);

  // Fetch empresa
  const fetchEmpresa = async () => {
    if (!user?.id) return;
    
    const { data, error } = await supabase
      .from('empresa')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Erro ao buscar empresa:', error);
      return;
    }

    setEmpresa(data);
  };

  // Fetch produtos
  const fetchProdutos = async () => {
    if (!empresa) return;

    try {
      const { data, error } = await supabase
        .from('produto')
        .select(`
          *,
          categoria:idcategoria (
            id,
            nome,
            permite_dois_sabores
          )
        `)
        .eq('empresa_id', empresa.id)
        .eq('ativo', true)
        .order('descricao', { ascending: true });

      if (error) {
        console.error('Erro ao buscar produtos:', error);
        setLoading(false);
        return;
      }

      // Buscar todas as categorias ativas
      const { data: categoriasData, error: categoriasError } = await supabase
        .from('categoria')
        .select('id, nome, permite_dois_sabores')
        .eq('empresa_id', empresa.id)
        .eq('ativo', true)
        .order('nome', { ascending: true });

      if (categoriasError) {
        console.error('Erro ao buscar categorias:', categoriasError);
      }

      setProdutos(data);
      setCategorias(categoriasData || []);
      setLoading(false);
    } catch (err) {
      console.error('Erro inesperado ao buscar produtos:', err);
      setLoading(false);
    }
  };

  // Fetch clientes
  const fetchClientes = async () => {
    if (!empresa) return;

    const { data, error } = await supabase
      .from('cliente')
      .select('*')
      .eq('empresa_id', empresa.id)
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar clientes:', error);
      return;
    }

    setClientes(data);
  };

  // Verificar token na URL ao carregar
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('access_token');

    if (tokenFromUrl) {
      setAccessToken(tokenFromUrl);
      validateToken(tokenFromUrl);
    }
  }, [validateToken]);

  // Modo autenticado normal
  useEffect(() => {
    if (user && !isValidToken) {
      fetchEmpresa();
    }
  }, [user, isValidToken]);

  // Modo token temporário
  useEffect(() => {
    if (isValidToken && tokenData) {
      setEmpresa(tokenData.empresa);
      setClientes([tokenData.cliente]);
      setClienteSelecionado(tokenData.cliente.id);
    }
  }, [isValidToken, tokenData]);

  useEffect(() => {
    if (empresa) {
      fetchProdutos();
      if (!isValidToken) {
        fetchClientes();
      }
    }
  }, [empresa, isValidToken]);

  const adicionarAoCarrinho = (produto: Produto, sabores?: { produto: Produto; posicao: number }[], valorCalculado?: number, observacao?: string, complementos?: ComplementoSelecionado[]) => {
    // Criar uma chave única baseada no produto e sabores com posições
    const chaveSabores = sabores && sabores.length > 0
      ? sabores.map(s => `${s.produto.id}-${s.posicao}`).sort().join('-')
      : 'sem-sabores';
    const chaveItem = `${produto.id}-${chaveSabores}`;

    const itemExistente = carrinho.find(item => {
      const itemChaveSabores = item.sabores && item.sabores.length > 0
        ? item.sabores.map(s => `${s.produto.id}-${s.posicao}`).sort().join('-')
        : 'sem-sabores';
      const itemChaveItem = `${item.produto.id}-${itemChaveSabores}`;
      return itemChaveItem === chaveItem;
    });

    if (itemExistente) {
      setCarrinho(carrinho.map(item => {
        const itemChaveSabores = item.sabores && item.sabores.length > 0
          ? item.sabores.map(s => `${s.produto.id}-${s.posicao}`).sort().join('-')
          : 'sem-sabores';
        const itemChaveItem = `${item.produto.id}-${itemChaveSabores}`;
        return itemChaveItem === chaveItem
          ? { ...item, quantidade: item.quantidade + 1 }
          : item;
      }));
    } else {
      const novoItem: CartItem = {
        produto,
        quantidade: 1,
        sabores: sabores || [],
        valorCalculado: valorCalculado,
        observacao: observacao || undefined,
        complementos: complementos || []
      };
      setCarrinho([...carrinho, novoItem]);
    }

    // Disparar animação do carrinho
    setCarrinhoAnimating(true);
    setTimeout(() => setCarrinhoAnimating(false), 600);
  };

  const handleProdutoClick = (produto: Produto) => {
    // Se estamos selecionando segunda metade
    if (selecionandoSegundaMetade && primeiroSabor) {
      const sabores = [
        { produto: primeiroSabor, posicao: 1 },
        { produto, posicao: 2 }
      ];
      const valorCalculado = Math.max(primeiroSabor.vlrvenda, produto.vlrvenda);

      // Abrir modal de observação para o produto duas metades
      setProdutoParaObservacao(primeiroSabor);
      setSaboresParaObservacao(sabores);
      setValorCalculadoParaObservacao(valorCalculado);
      setObservacaoAtual('');
      setComplementosAtual([]);
      setMostrandoObservacao(true);

      // Reset do estado
      setSelecionandoSegundaMetade(false);
      setPrimeiroSabor(null);
      return;
    }

    // Se o produto permite duas metades, mostrar card de pergunta
    if (produto.categoria?.permite_dois_sabores) {
      setProdutoParaPerguntar(produto);
      setMostrandoPerguntaMetade(true);
      return;
    }

    // Abrir modal de observação para produto normal
    setProdutoParaObservacao(produto);
    setSaboresParaObservacao([]);
    setValorCalculadoParaObservacao(undefined);
    setObservacaoAtual('');
    setComplementosAtual([]);
    setMostrandoObservacao(true);
  };

  const handleConfirmarObservacao = () => {
    if (produtoParaObservacao) {
      adicionarAoCarrinho(
        produtoParaObservacao,
        saboresParaObservacao,
        valorCalculadoParaObservacao,
        observacaoAtual.trim() || undefined,
        complementosAtual
      );
    }

    // Limpar estados do modal
    setProdutoParaObservacao(null);
    setSaboresParaObservacao([]);
    setValorCalculadoParaObservacao(undefined);
    setObservacaoAtual('');
    setComplementosAtual([]);
    setMostrandoObservacao(false);
  };

  const handleCancelarObservacao = () => {
    setProdutoParaObservacao(null);
    setSaboresParaObservacao([]);
    setValorCalculadoParaObservacao(undefined);
    setObservacaoAtual('');
    setComplementosAtual([]);
    setMostrandoObservacao(false);
  };

  const cancelarSegundaMetade = () => {
    setSelecionandoSegundaMetade(false);
    setPrimeiroSabor(null);
    setCategoriaSelecionada('todos');
  };

  const handleAdicionarMetade = () => {
    if (produtoParaPerguntar) {
      setPrimeiroSabor(produtoParaPerguntar);
      setSelecionandoSegundaMetade(true);
      setCategoriaSelecionada(produtoParaPerguntar.idcategoria || 'todos');
      setMostrandoPerguntaMetade(false);
      setProdutoParaPerguntar(null);
    }
  };

  const handleSoUmSabor = () => {
    if (produtoParaPerguntar) {
      // Abrir modal de observação para produto único
      setProdutoParaObservacao(produtoParaPerguntar);
      setSaboresParaObservacao([]);
      setValorCalculadoParaObservacao(undefined);
      setObservacaoAtual('');
      setComplementosAtual([]);
      setMostrandoObservacao(true);
      setMostrandoPerguntaMetade(false);
      setProdutoParaPerguntar(null);
    }
  };

  const removerDoCarrinho = (item: CartItem) => {
    // Criar chave única para identificar o item exato
    const chaveSabores = item.sabores && item.sabores.length > 0
      ? item.sabores.map(s => `${s.produto.id}-${s.posicao}`).sort().join('-')
      : 'sem-sabores';
    const chaveItem = `${item.produto.id}-${chaveSabores}`;

    if (item.quantidade > 1) {
      setCarrinho(carrinho.map(carrinhoItem => {
        const carrinhoChaveSabores = carrinhoItem.sabores && carrinhoItem.sabores.length > 0
          ? carrinhoItem.sabores.map(s => `${s.produto.id}-${s.posicao}`).sort().join('-')
          : 'sem-sabores';
        const carrinhoChaveItem = `${carrinhoItem.produto.id}-${carrinhoChaveSabores}`;

        return carrinhoChaveItem === chaveItem
          ? { ...carrinhoItem, quantidade: carrinhoItem.quantidade - 1 }
          : carrinhoItem;
      }));
    } else {
      setCarrinho(carrinho.filter(carrinhoItem => {
        const carrinhoChaveSabores = carrinhoItem.sabores && carrinhoItem.sabores.length > 0
          ? carrinhoItem.sabores.map(s => `${s.produto.id}-${s.posicao}`).sort().join('-')
          : 'sem-sabores';
        const carrinhoChaveItem = `${carrinhoItem.produto.id}-${carrinhoChaveSabores}`;

        return carrinhoChaveItem !== chaveItem;
      }));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => {
      const valorItem = item.valorCalculado || item.produto.vlrvenda;
      const valorComplementos = item.complementos?.reduce((totalComp, comp) => totalComp + comp.valor, 0) || 0;
      return total + ((valorItem + valorComplementos) * item.quantidade);
    }, 0);
  };

  const finalizarPedido = async () => {
    if (!empresa || carrinho.length === 0 || !clienteSelecionado || !tipoPagamento || !enderecoSelecionado) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios e adicione itens ao carrinho",
        variant: "destructive"
      });
      return;
    }

    const enderecoCompleto = enderecoSelecionado;

    try {
      // Criar pedido na tabela 'pedido'
      const { data: pedidoData, error: pedidoError } = await supabase
        .from('pedido')
        .insert({
          empresa_id: empresa.id,
          idcliente: clienteSelecionado,
          tipopagamento: tipoPagamento,
          endereco_entrega: enderecoCompleto,
          status: 'pendente',
          total: calcularTotal(),
        })
        .select()
        .single();

      if (pedidoError || !pedidoData) {
        console.error('Erro ao criar pedido:', pedidoError);
        toast({
          title: "Erro",
          description: "Erro ao criar pedido",
          variant: "destructive"
        });
        return;
      }

      // Criar itens do pedido na tabela 'pedidoitem'
      for (const item of carrinho) {
        const { data: itemData, error: itemError } = await supabase
          .from('pedidoitem')
          .insert({
            idpedido: pedidoData.id,
            idproduto: item.produto.id,
            qtd: item.quantidade,
            valor: item.valorCalculado || item.produto.vlrvenda,
            obs: item.observacao || null,
            empresa_id: empresa.id,
          })
          .select()
          .single();

        if (itemError || !itemData) {
          console.error('Erro ao criar item do pedido:', itemError);
          toast({
            title: "Erro",
            description: "Erro ao criar item do pedido",
            variant: "destructive"
          });
          return;
        }

        // Criar sabores se existirem
        if (item.sabores && item.sabores.length > 0) {
          for (const sabor of item.sabores) {
            const { error: saborError } = await supabase
              .from('pedidoitem_sabores')
              .insert({
                idpedidoitem: itemData.id,
                idproduto: sabor.produto.id,
                posicao: sabor.posicao,
                empresa_id: empresa.id,
              });

            if (saborError) {
              console.error('Erro ao criar sabor do item:', saborError);
              toast({
                title: "Erro",
                description: "Erro ao criar sabor do item",
                variant: "destructive"
              });
              return;
            }
          }
        }

        // Criar complementos se existirem
        if (item.complementos && item.complementos.length > 0) {
          for (const comp of item.complementos) {
            const { error: compError } = await supabase
              .from('pedidoitem_complemento')
              .insert({
                pedidoitem_id: itemData.id,
                complemento_id: comp.complemento_id,
                qtd: comp.quantidade,
                valor: comp.valor,
                empresa_id: empresa.id,
              });

            if (compError) {
              console.error('Erro ao criar complemento do item:', compError);
              toast({
                title: "Erro",
                description: "Erro ao criar complemento do item",
                variant: "destructive"
              });
              return;
            }
          }
        }
      }

      // Mostrar modal de sucesso
      setLastOrderId(pedidoData.id);
      setLastOrderTotal(calcularTotal());
      setShowSuccessModal(true);

      toast({
        title: "Sucesso",
        description: "Pedido criado com sucesso!"
      });

      // Limpar o carrinho e campos
      setCarrinho([]);
      setClienteSelecionado('');
      setTipoPagamento('');
      setEnderecoSelecionado('');
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      toast({
        title: "Erro",
        description: "Erro ao finalizar pedido",
        variant: "destructive"
      });
    }
  };

  const getProdutosFiltrados = () => {
    let produtosFiltrados = produtos;

    // Filtrar por termo de busca
    if (searchTerm.trim()) {
      produtosFiltrados = produtosFiltrados.filter(produto =>
        produto.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.detalhes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Se estamos selecionando segunda metade, filtrar apenas produtos da mesma categoria que permite dois sabores
    if (selecionandoSegundaMetade && primeiroSabor) {
      produtosFiltrados = produtosFiltrados.filter(produto => 
        produto.idcategoria === primeiroSabor.idcategoria &&
        produto.categoria?.permite_dois_sabores === true &&
        produto.id !== primeiroSabor.id &&
        produto.ativo
      );
    } else if (categoriaSelecionada !== 'todos') {
      produtosFiltrados = produtosFiltrados.filter(produto => produto.idcategoria === categoriaSelecionada);
    }

    return produtosFiltrados;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando produtos...</p>
      </div>
    </div>;
  }

  if (!empresa) {
    return <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
      <p className="text-muted-foreground">Nenhuma empresa encontrada</p>
    </div>;
  }

  const produtosFiltrados = getProdutosFiltrados();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <AppHeader 
        restaurantName={empresa.nome}
        backgroundImage={restaurantHeroImage}
        showAdmin={!isValidToken}
      />

      {/* Card de pergunta para duas metades */}
      {mostrandoPerguntaMetade && produtoParaPerguntar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{produtoParaPerguntar.descricao}</CardTitle>
              <CardDescription>Deseja adicionar outro sabor (metade a metade)?</CardDescription>
            </CardHeader>
            <CardFooter className="flex gap-2">
              <Button onClick={handleAdicionarMetade} className="flex-1">
                Sim, quero duas metades
              </Button>
              <Button variant="outline" onClick={handleSoUmSabor} className="flex-1">
                Não, só um sabor
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Card de seleção de segunda metade */}
      {selecionandoSegundaMetade && primeiroSabor && (
        <div className="container mx-auto px-4 py-4">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle>Primeira metade: {primeiroSabor.descricao}</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Agora selecione a segunda metade
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="secondary" onClick={cancelarSegundaMetade}>
                Cancelar
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Barra de busca */}
        <div className="mb-6">
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Filtros de categoria */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <Badge
            variant={categoriaSelecionada === 'todos' ? "default" : "secondary"}
            className="cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={() => setCategoriaSelecionada('todos')}
          >
            Todos
          </Badge>
          {categorias.map((categoria) => (
            <Badge
              key={categoria.id}
              variant={categoriaSelecionada === categoria.id ? "default" : "secondary"}
              className="cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={() => setCategoriaSelecionada(categoria.id)}
            >
              {categoria.nome}
            </Badge>
          ))}
        </div>

        {/* Lista de produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {produtosFiltrados.map((produto) => (
            <Card
              key={produto.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleProdutoClick(produto)}
            >
              <div className="relative">
                {produto.imagem && (
                  <img 
                    src={produto.imagem} 
                    alt={produto.descricao}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-primary text-primary-foreground">
                    {formatCurrency(produto.vlrvenda)}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{produto.descricao}</h3>
                {produto.detalhes && (
                  <p className="text-muted-foreground text-sm mb-3">
                    {produto.detalhes}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(produto.vlrvenda)}
                  </span>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProdutoClick(produto);
                    }}
                    className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Personalizar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal de observação com complementos */}
      {mostrandoObservacao && produtoParaObservacao && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Personalizar {saboresParaObservacao.length > 0 
                  ? `${saboresParaObservacao.map(s => s.produto.descricao).join(' + ')}`
                  : produtoParaObservacao.descricao
                }
              </h3>

              {/* Complementos do produto */}
              <ProdutoComplementos
                produtoId={produtoParaObservacao.id}
                empresaId={empresa.id}
                onChange={setComplementosAtual}
              />

              <div className="mt-6">
                <Label htmlFor="observacao">Observações do item (opcional)</Label>
                <Textarea
                  id="observacao"
                  placeholder="Ex: Sem cebola, caprichar no molho..."
                  value={observacaoAtual}
                  onChange={(e) => setObservacaoAtual(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
                  rows={3}
                />
              </div>

              <div className="flex justify-between items-center py-4 border-t border-gray-100">
                <span className="text-lg font-semibold text-gray-900">
                  Total:
                </span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(
                    (valorCalculadoParaObservacao || produtoParaObservacao.vlrvenda) +
                    complementosAtual.reduce((total, comp) => total + comp.valor, 0)
                  )}
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancelarObservacao}
                  className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmarObservacao}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold"
                >
                  Adicionar ao Carrinho
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Carrinho flutuante */}
      {carrinho.length > 0 && (
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              className={`fixed bottom-4 left-4 right-4 h-14 rounded-full shadow-lg z-40 bg-primary hover:bg-primary/90 text-white font-semibold ${
                carrinhoAnimating ? 'animate-pulse' : ''
              }`}
              size="lg"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-full">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  <span className="text-sm">
                    Carrinho ({carrinho.reduce((total, item) => total + item.quantidade, 0)} itens)
                  </span>
                </div>
                <span className="text-lg font-bold">
                  {formatCurrency(calcularTotal())}
                </span>
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md p-0">
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Carrinho ({carrinho.reduce((total, item) => total + item.quantidade, 0)} itens)
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {carrinho.map((item, index) => {
                    const valorItem = item.valorCalculado || item.produto.vlrvenda;
                    const valorComplementos = item.complementos?.reduce((total, comp) => total + comp.valor, 0) || 0;
                    const valorTotal = (valorItem + valorComplementos) * item.quantidade;

                    return (
                      <div key={index} className="border border-gray-100 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 flex-1 pr-2">
                            {item.sabores && item.sabores.length > 0 
                              ? item.sabores.map(s => s.produto.descricao).join(' + ')
                              : item.produto.descricao
                            }
                          </h4>
                          <button
                            onClick={() => removerDoCarrinho(item)}
                            className="p-1 hover:bg-gray-100 rounded-full flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>

                        {item.complementos && item.complementos.length > 0 && (
                          <div className="mb-2">
                            {item.complementos.map((comp, compIndex) => (
                              <p key={compIndex} className="text-sm text-gray-600">
                                + {comp.quantidade}x Complemento
                              </p>
                            ))}
                          </div>
                        )}

                        {item.observacao && (
                          <p className="text-sm text-gray-600 italic mb-2">
                            "{item.observacao}"
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {item.quantidade}x {formatCurrency(valorItem + valorComplementos)}
                          </span>
                          <span className="font-semibold text-primary">
                            {formatCurrency(valorTotal)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(calcularTotal())}
                  </span>
                </div>

                <Button 
                  onClick={finalizarPedido}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full"
                  disabled
                >
                  Finalizar Pedido
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Modal de sucesso */}
      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        pedidoId={lastOrderId}
        total={lastOrderTotal}
        accessToken={accessToken || undefined}
      />
    </div>
  );
};