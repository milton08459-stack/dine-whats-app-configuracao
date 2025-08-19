import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2 } from "lucide-react";
import { MenuItem } from "./MenuCard";

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

export function Cart({ items, onRemoveItem, onCheckout }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <Card className="sticky top-4">
        <CardContent className="p-6 text-center">
          <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Seu carrinho está vazio</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <ShoppingCart className="h-5 w-5 text-food-primary" />
          Carrinho ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-foreground">{item.name}</h4>
              <p className="text-xs text-muted-foreground">
                {item.quantity}x R$ {item.price.toFixed(2)}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-semibold text-food-primary">
                R$ {(item.price * item.quantity).toFixed(2)}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem(item.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        
        <Separator />
        
        <div className="flex items-center justify-between font-semibold text-lg">
          <span className="text-foreground">Total:</span>
          <span className="text-food-primary">R$ {total.toFixed(2)}</span>
        </div>
        
        <Button 
          onClick={onCheckout}
          className="w-full bg-gradient-warm hover:shadow-glow transition-all duration-300 border-0"
          size="lg"
        >
          Finalizar Pedido
        </Button>
      </CardContent>
    </Card>
  );
}