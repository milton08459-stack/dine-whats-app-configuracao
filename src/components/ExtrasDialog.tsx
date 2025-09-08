import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MenuItem, MenuExtra } from "./MenuCard";

interface ExtrasDialogProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (extras: string[], observations?: string) => void;
}

export function ExtrasDialog({ item, isOpen, onClose, onConfirm }: ExtrasDialogProps) {
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [observations, setObservations] = useState<string>("");

  const handleExtraChange = (extraId: string, checked: boolean) => {
    if (checked) {
      setSelectedExtras(prev => [...prev, extraId]);
    } else {
      setSelectedExtras(prev => prev.filter(id => id !== extraId));
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedExtras, observations);
    setSelectedExtras([]);
    setObservations("");
    onClose();
  };

  const handleCancel = () => {
    setSelectedExtras([]);
    setObservations("");
    onClose();
  };

  const calculateExtraPrice = () => {
    if (!item.extras) return 0;
    return selectedExtras.reduce((total, extraId) => {
      const extra = item.extras?.find(e => e.id === extraId);
      return total + (extra?.price || 0);
    }, 0);
  };

  const totalPrice = item.price + calculateExtraPrice();

  if (!item.extras || item.extras.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Personalizar {item.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Bordas/Coberturas disponíveis:</h4>
            {item.extras.map((extra) => (
              <div key={extra.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={extra.id}
                    checked={selectedExtras.includes(extra.id)}
                    onCheckedChange={(checked) => 
                      handleExtraChange(extra.id, checked as boolean)
                    }
                  />
                  <label 
                    htmlFor={extra.id} 
                    className="text-sm font-medium text-foreground cursor-pointer"
                  >
                    {extra.name}
                  </label>
                </div>
                <span className="text-sm text-food-primary font-medium">
                  + R$ {extra.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="observations" className="text-sm font-medium text-foreground">
                Observações do item (opcional)
              </Label>
              <Textarea
                id="observations"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Ex: sem cebola, ponto da carne bem passado..."
                className="mt-1 border-border focus:ring-food-primary"
                rows={2}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-foreground">Total:</span>
              <span className="font-bold text-lg text-food-primary">
                R$ {totalPrice.toFixed(2)}
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirm}
                className="flex-1 bg-gradient-warm hover:shadow-glow transition-all duration-300"
              >
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}