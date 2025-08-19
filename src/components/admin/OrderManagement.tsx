import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Clock, CheckCircle, XCircle, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
  createdAt: Date;
  observations?: string;
}

const statusConfig = {
  pending: { label: "Pendente", color: "bg-yellow-500", icon: Clock },
  preparing: { label: "Preparando", color: "bg-blue-500", icon: Package },
  ready: { label: "Pronto", color: "bg-green-500", icon: CheckCircle },
  delivered: { label: "Entregue", color: "bg-gray-500", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "bg-red-500", icon: XCircle },
};

export function OrderManagement() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");

  // Mock data - In a real app, this would come from a backend
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: "1",
        customerName: "João Silva",
        customerPhone: "(11) 99999-9999",
        customerAddress: "Rua das Flores, 123 - Vila Madalena - São Paulo",
        items: [
          { id: "1", name: "Hambúrguer Artesanal", quantity: 2, price: 24.90 },
          { id: "3", name: "Salada Caesar", quantity: 1, price: 19.90 }
        ],
        total: 69.70,
        status: "pending",
        createdAt: new Date(),
        observations: "Sem cebola no hambúrguer"
      },
      {
        id: "2",
        customerName: "Maria Santos",
        customerPhone: "(11) 88888-8888",
        customerAddress: "Av. Paulista, 456 - Bela Vista - São Paulo",
        items: [
          { id: "2", name: "Pizza Margherita", quantity: 1, price: 32.90 }
        ],
        total: 32.90,
        status: "preparing",
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      }
    ];
    setOrders(mockOrders);
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    toast({
      title: "Status atualizado",
      description: `Pedido #${orderId} marcado como ${statusConfig[newStatus].label.toLowerCase()}`,
    });
  };

  const sendWhatsAppMessage = (order: Order) => {
    let message = `🍽️ *ATUALIZAÇÃO DO PEDIDO #${order.id}* 🍽️\n\n`;
    message += `Olá ${order.customerName}!\n\n`;
    message += `Status atual: *${statusConfig[order.status].label}*\n\n`;
    
    if (order.status === "ready") {
      message += "Seu pedido está pronto para entrega! 🎉\n";
    } else if (order.status === "preparing") {
      message += "Seu pedido está sendo preparado com muito carinho! 👨‍🍳\n";
    }
    
    message += `\n*Resumo do pedido:*\n`;
    order.items.forEach((item) => {
      message += `• ${item.quantity}x ${item.name}\n`;
    });
    message += `\n💰 Total: R$ ${order.total.toFixed(2)}`;
    
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = order.customerPhone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Gerenciamento de Pedidos</CardTitle>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os pedidos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="preparing">Preparando</SelectItem>
                <SelectItem value="ready">Prontos</SelectItem>
                <SelectItem value="delivered">Entregues</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                
                return (
                  <Card key={order.id} className="border border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-foreground">Pedido #{order.id}</h3>
                          <Badge className={`${statusConfig[order.status].color} text-white`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[order.status].label}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {order.createdAt.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Informações do Cliente</h4>
                          <div className="space-y-1 text-sm">
                            <p className="text-muted-foreground">
                              <strong>Nome:</strong> {order.customerName}
                            </p>
                            <p className="text-muted-foreground">
                              <strong>Telefone:</strong> {order.customerPhone}
                            </p>
                            <p className="text-muted-foreground">
                              <strong>Endereço:</strong> {order.customerAddress}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Itens do Pedido</h4>
                          <div className="space-y-1">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {item.quantity}x {item.name}
                                </span>
                                <span className="text-foreground">
                                  R$ {(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {order.observations && (
                        <div>
                          <h4 className="font-medium text-foreground mb-1">Observações</h4>
                          <p className="text-sm text-muted-foreground">{order.observations}</p>
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-lg">
                          <span className="text-foreground">Total: </span>
                          <span className="text-food-primary">R$ {order.total.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="preparing">Preparando</SelectItem>
                              <SelectItem value="ready">Pronto</SelectItem>
                              <SelectItem value="delivered">Entregue</SelectItem>
                              <SelectItem value="cancelled">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            onClick={() => sendWhatsAppMessage(order)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            WhatsApp
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}