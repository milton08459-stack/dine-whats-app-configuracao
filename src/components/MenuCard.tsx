import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus } from "lucide-react";
import { ExtrasDialog } from "./ExtrasDialog";

export interface MenuExtra {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  extras?: MenuExtra[];
}

interface MenuCardProps {
  item: MenuItem;
  quantity: number;
  onAdd: (extras?: string[]) => void;
  onRemove: () => void;
}

export function MenuCard({ item, quantity, onAdd, onRemove }: MenuCardProps) {
  const [showExtrasDialog, setShowExtrasDialog] = useState(false);

  const handleAddClick = () => {
    if (item.extras && item.extras.length > 0) {
      setShowExtrasDialog(true);
    } else {
      onAdd();
    }
  };

  const handleExtrasConfirm = (extras: string[]) => {
    onAdd(extras);
  };
  return (
    <Card className="overflow-hidden hover:shadow-food transition-all duration-300 hover:scale-[1.02] bg-card border-border group">
      <div className="relative overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
          <Badge variant="secondary" className="bg-gradient-warm text-primary-foreground border-0">
            R$ {item.price.toFixed(2)}
          </Badge>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between">
          {quantity > 0 ? (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onRemove}
                className="h-8 w-8 p-0 border-food-primary text-food-primary hover:bg-food-primary hover:text-primary-foreground"
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <span className="font-semibold text-foreground min-w-[20px] text-center">
                {quantity}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAdd()}
                className="h-8 w-8 p-0 border-food-primary text-food-primary hover:bg-food-primary hover:text-primary-foreground"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAddClick}
              className="bg-gradient-warm hover:shadow-glow transition-all duration-300 border-0"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              {item.extras && item.extras.length > 0 ? "Personalizar" : "Adicionar"}
            </Button>
          )}
        </div>

        <ExtrasDialog
          item={item}
          isOpen={showExtrasDialog}
          onClose={() => setShowExtrasDialog(false)}
          onConfirm={handleExtrasConfirm}
        />
      </CardContent>
    </Card>
  );
}