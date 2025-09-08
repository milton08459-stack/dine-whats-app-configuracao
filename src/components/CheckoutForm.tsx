import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { CartItem } from "./Cart";
import { useToast } from "@/hooks/use-toast";

interface CheckoutFormProps {
  items: CartItem[];
  onBack: () => void;
  onClearCart: () => void;
}

export function CheckoutForm({ items, onBack, onClearCart }: CheckoutFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    observations: ""
  });

  const calculateItemUnitPrice = useCallback((item: CartItem) => {
    let base = item.price;
    if (item.selectedExtras && item.extras) {
      base += item.selectedExtras.reduce((sum, id) => {
        const ex = item.extras?.find((e) => e.id === id);
        return sum + (ex?.price || 0);
      }, 0);
    }
    return base;
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + calculateItemUnitPrice(item) * item.quantity, 0);
  }, [items, calculateItemUnitPrice]);

  const generateWhatsAppMessage = useCallback(() => {
    let message = "🍽️ *NOVO PEDIDO* 🍽️\n\n";
    message += `👤 *Cliente:* ${formData.name}\n`;
    message += `📱 *Telefone:* ${formData.phone}\n`;
    message += `📍 *Endereço:* ${formData.address}\n\n`;
    
    message += "*📋 ITENS DO PEDIDO:*\n";
    items.forEach((item) => {
      const unit = calculateItemUnitPrice(item);
      message += `• ${item.quantity}x ${item.name} - R$ ${(unit * item.quantity).toFixed(2)}\n`;
      if (item.selectedExtras && item.selectedExtras.length > 0) {
        item.selectedExtras.forEach((extraId) => {
          const extra = item.extras?.find((e) => e.id === extraId);
          if (extra) {
            message += `   ◦ + ${extra.name}: R$ ${extra.price.toFixed(2)}\n`;
          }
        });
      }
      if (item.observations) {
        message += `   📝 Obs: ${item.observations}\n`;
      }
    });
    
    message += `\n💰 *TOTAL: R$ ${total.toFixed(2)}*\n`;
    
    if (formData.observations) {
      message += `\n📝 *Observações:* ${formData.observations}`;
    }
    
    return encodeURIComponent(message);
  }, [formData, items, total, calculateItemUnitPrice]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/5511998454270?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Pedido enviado!",
      description: "Seu pedido foi enviado via WhatsApp. Aguarde nosso contato!",
    });
    
    onClearCart();
  }, [formData, generateWhatsAppMessage, toast, onClearCart]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-foreground">Finalizar Pedido</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-foreground">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome completo"
                required
                className="border-border focus:ring-food-primary"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-foreground">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
                required
                className="border-border focus:ring-food-primary"
              />
            </div>
            
            <div>
              <Label htmlFor="address" className="text-foreground">Endereço de Entrega *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Rua, número, bairro, cidade..."
                required
                className="border-border focus:ring-food-primary"
              />
            </div>
            
            <div>
              <Label htmlFor="observations" className="text-foreground">Observações</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                placeholder="Observações adicionais (opcional)"
                className="border-border focus:ring-food-primary"
              />
            </div>
          </div>
          
          <div className="bg-accent/50 p-4 rounded-lg border border-border">
            <h3 className="font-semibold text-foreground mb-3">Resumo do Pedido</h3>
            <div className="space-y-2">
              {items.map((item, index) => {
                const unit = calculateItemUnitPrice(item);
                const key = `${item.id}-${index}-${(item.selectedExtras || []).join('|')}-${item.observations || ''}`;
                return (
                  <div key={key} className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-foreground">
                        R$ {(unit * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    {item.selectedExtras && item.selectedExtras.length > 0 && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {item.selectedExtras.map((extraId) => {
                          const extra = item.extras?.find((e) => e.id === extraId);
                          return extra ? (
                            <div key={extraId} className="flex justify-between">
                              <span>+ {extra.name}</span>
                              <span>R$ {extra.price.toFixed(2)}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                    {item.observations && (
                      <div className="mt-1 text-xs text-muted-foreground italic">
                        "{item.observations}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="border-t border-border mt-3 pt-3">
              <div className="flex justify-between font-semibold text-lg">
                <span className="text-foreground">Total:</span>
                <span className="text-food-primary">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-gradient-warm hover:shadow-glow transition-all duration-300 border-0"
            size="lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Enviar via WhatsApp
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}