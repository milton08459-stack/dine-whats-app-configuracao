import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, MapPin, Phone, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RestaurantConfig {
  name: string;
  phone: string;
  address: string;
  description: string;
  deliveryFee: number;
  minOrderValue: number;
  openingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
}

const defaultConfig: RestaurantConfig = {
  name: "Restaurante Delícia",
  phone: "(11) 99845-4270",
  address: "Rua das Delícias, 123 - Centro - São Paulo - SP",
  description: "O melhor da culinária artesanal com ingredientes frescos e selecionados.",
  deliveryFee: 5.00,
  minOrderValue: 25.00,
  openingHours: {
    monday: { open: "18:00", close: "23:00", closed: false },
    tuesday: { open: "18:00", close: "23:00", closed: false },
    wednesday: { open: "18:00", close: "23:00", closed: false },
    thursday: { open: "18:00", close: "23:00", closed: false },
    friday: { open: "18:00", close: "00:00", closed: false },
    saturday: { open: "18:00", close: "00:00", closed: false },
    sunday: { open: "18:00", close: "22:00", closed: false },
  }
};

const dayNames = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo"
};

export function RestaurantSettings() {
  const { toast } = useToast();
  const [config, setConfig] = useState<RestaurantConfig>(defaultConfig);

  const handleSave = () => {
    // In a real app, this would save to a backend
    localStorage.setItem('restaurantConfig', JSON.stringify(config));
    
    toast({
      title: "Configurações salvas",
      description: "As configurações do restaurante foram atualizadas com sucesso!",
    });
  };

  const updateHours = (day: keyof typeof config.openingHours, field: keyof typeof config.openingHours.monday, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <MapPin className="h-5 w-5 text-food-primary" />
            Informações do Restaurante
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-foreground">Nome do Restaurante</Label>
              <Input
                id="name"
                value={config.name}
                onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do restaurante"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-foreground">Telefone (WhatsApp)</Label>
              <Input
                id="phone"
                value={config.phone}
                onChange={(e) => setConfig(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address" className="text-foreground">Endereço Completo</Label>
            <Textarea
              id="address"
              value={config.address}
              onChange={(e) => setConfig(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Endereço completo do restaurante"
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-foreground">Descrição</Label>
            <Textarea
              id="description"
              value={config.description}
              onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição do restaurante"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deliveryFee" className="text-foreground">Taxa de Entrega (R$)</Label>
              <Input
                id="deliveryFee"
                type="number"
                step="0.01"
                value={config.deliveryFee}
                onChange={(e) => setConfig(prev => ({ ...prev, deliveryFee: parseFloat(e.target.value) || 0 }))}
                placeholder="5.00"
              />
            </div>
            
            <div>
              <Label htmlFor="minOrderValue" className="text-foreground">Pedido Mínimo (R$)</Label>
              <Input
                id="minOrderValue"
                type="number"
                step="0.01"
                value={config.minOrderValue}
                onChange={(e) => setConfig(prev => ({ ...prev, minOrderValue: parseFloat(e.target.value) || 0 }))}
                placeholder="25.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Clock className="h-5 w-5 text-food-primary" />
            Horário de Funcionamento
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {Object.entries(config.openingHours).map(([day, hours]) => (
              <div key={day} className="flex items-center gap-4 p-3 border border-border rounded-lg">
                <div className="w-32">
                  <span className="font-medium text-foreground">
                    {dayNames[day as keyof typeof dayNames]}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!hours.closed}
                    onChange={(e) => updateHours(day as keyof typeof config.openingHours, 'closed', !e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm text-muted-foreground">Aberto</label>
                </div>
                
                {!hours.closed && (
                  <>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-muted-foreground">Abertura:</Label>
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => updateHours(day as keyof typeof config.openingHours, 'open', e.target.value)}
                        className="w-32"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-muted-foreground">Fechamento:</Label>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => updateHours(day as keyof typeof config.openingHours, 'close', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  </>
                )}
                
                {hours.closed && (
                  <span className="text-sm text-muted-foreground italic">Fechado</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-gradient-warm hover:shadow-glow transition-all duration-300">
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}