import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Printer, TestTube, Save, Wifi } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrinterConfig {
  printerName: string;
  paperSize: "80mm" | "58mm" | "A4";
  autoprint: boolean;
  printOnStatus: ("preparing" | "ready" | "delivered")[];
  networkPrinter: boolean;
  networkAddress: string;
  networkPort: string;
  printDensity: "light" | "normal" | "dark";
  copies: number;
}

const defaultConfig: PrinterConfig = {
  printerName: "",
  paperSize: "80mm",
  autoprint: true,
  printOnStatus: ["preparing"],
  networkPrinter: false,
  networkAddress: "",
  networkPort: "9100",
  printDensity: "normal",
  copies: 1,
};

export function PrinterSettings() {
  const { toast } = useToast();
  const [config, setConfig] = useState<PrinterConfig>(defaultConfig);
  const [availablePrinters, setAvailablePrinters] = useState<string[]>([]);

  useEffect(() => {
    // Load saved config
    const saved = localStorage.getItem('printerConfig');
    if (saved) {
      setConfig(JSON.parse(saved));
    }

    // Get available printers
    getAvailablePrinters();
  }, []);

  const getAvailablePrinters = async () => {
    try {
      // Check if Web Serial API is available (for some receipt printers)
      if ('serial' in navigator) {
        // For now, add some common printer names
        setAvailablePrinters([
          "Impressora Padrão",
          "EPSON TM-T20II",
          "EPSON TM-T88V",
          "Zebra ZD220",
          "Bematech MP-4200 TH"
        ]);
      }
    } catch (error) {
      console.log("Erro ao buscar impressoras disponíveis:", error);
    }
  };

  const handleSave = () => {
    localStorage.setItem('printerConfig', JSON.stringify(config));
    
    toast({
      title: "Configurações de impressora salvas",
      description: "As configurações foram atualizadas com sucesso!",
    });
  };

  const testPrint = () => {
    const testOrder = {
      id: "TEST001",
      customerName: "Cliente Teste",
      customerPhone: "(11) 99999-9999",
      customerAddress: "Rua de Teste, 123 - Centro - São Paulo",
      items: [
        { id: "1", name: "Hambúrguer Teste", quantity: 1, price: 25.90 },
        { id: "2", name: "Refrigerante", quantity: 1, price: 5.00 }
      ],
      total: 30.90,
      status: "preparing" as const,
      createdAt: new Date(),
      observations: "Teste de impressão"
    };

    printOrder(testOrder);
  };

  const printOrder = (order: any) => {
    // Generate receipt content
    let content = `
================================
${config.printerName || "RESTAURANTE"}
================================

PEDIDO #${order.id}
${new Date().toLocaleString('pt-BR')}

--------------------------------
CLIENTE:
${order.customerName}
${order.customerPhone}
${order.customerAddress}

--------------------------------
ITENS:
`;

    order.items.forEach((item: any) => {
      content += `${item.quantity}x ${item.name}
   R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    content += `
--------------------------------
TOTAL: R$ ${order.total.toFixed(2)}
--------------------------------

${order.observations ? `OBS: ${order.observations}\n\n` : ""}

Status: ${order.status.toUpperCase()}

================================
`;

    // Print using window.print with custom styling
    const printWindow = window.open('', '', 'width=300,height=400');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Pedido #${order.id}</title>
            <style>
              body {
                font-family: monospace;
                font-size: ${config.paperSize === '58mm' ? '10px' : '12px'};
                line-height: 1.2;
                margin: 0;
                padding: 10px;
                white-space: pre-wrap;
              }
              @media print {
                body { margin: 0; }
                @page {
                  size: ${config.paperSize === 'A4' ? 'A4' : '80mm auto'};
                  margin: 0;
                }
              }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Print multiple copies if configured
      setTimeout(() => {
        for (let i = 0; i < config.copies; i++) {
          printWindow.print();
        }
        setTimeout(() => printWindow.close(), 1000);
      }, 500);
    }

    toast({
      title: "Impressão enviada",
      description: `Pedido #${order.id} enviado para impressão`,
    });
  };

  const toggleStatusPrint = (status: "preparing" | "ready" | "delivered") => {
    setConfig(prev => ({
      ...prev,
      printOnStatus: prev.printOnStatus.includes(status)
        ? prev.printOnStatus.filter(s => s !== status)
        : [...prev.printOnStatus, status]
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Printer className="h-5 w-5 text-food-primary" />
            Configurações da Impressora
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="printerName" className="text-foreground">Nome da Impressora</Label>
              <Select 
                value={config.printerName} 
                onValueChange={(value) => setConfig(prev => ({ ...prev, printerName: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma impressora" />
                </SelectTrigger>
                <SelectContent>
                  {availablePrinters.map((printer) => (
                    <SelectItem key={printer} value={printer}>
                      {printer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="paperSize" className="text-foreground">Tamanho do Papel</Label>
              <Select 
                value={config.paperSize} 
                onValueChange={(value: any) => setConfig(prev => ({ ...prev, paperSize: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="58mm">58mm (Mini)</SelectItem>
                  <SelectItem value="80mm">80mm (Padrão)</SelectItem>
                  <SelectItem value="A4">A4 (Folha)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="printDensity" className="text-foreground">Densidade de Impressão</Label>
              <Select 
                value={config.printDensity} 
                onValueChange={(value: any) => setConfig(prev => ({ ...prev, printDensity: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Clara</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="dark">Escura</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="copies" className="text-foreground">Número de Cópias</Label>
              <Input
                id="copies"
                type="number"
                min="1"
                max="5"
                value={config.copies}
                onChange={(e) => setConfig(prev => ({ ...prev, copies: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-medium">Impressão Automática</Label>
              <Switch
                checked={config.autoprint}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoprint: checked }))}
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              Imprimir automaticamente quando o status do pedido for alterado para:
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={config.printOnStatus.includes("preparing") ? "default" : "outline"}
                size="sm"
                onClick={() => toggleStatusPrint("preparing")}
              >
                Preparando
              </Button>
              <Button
                type="button"
                variant={config.printOnStatus.includes("ready") ? "default" : "outline"}
                size="sm"
                onClick={() => toggleStatusPrint("ready")}
              >
                Pronto
              </Button>
              <Button
                type="button"
                variant={config.printOnStatus.includes("delivered") ? "default" : "outline"}
                size="sm"
                onClick={() => toggleStatusPrint("delivered")}
              >
                Entregue
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-medium flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                Impressora de Rede
              </Label>
              <Switch
                checked={config.networkPrinter}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, networkPrinter: checked }))}
              />
            </div>
            
            {config.networkPrinter && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="networkAddress" className="text-foreground">Endereço IP</Label>
                  <Input
                    id="networkAddress"
                    value={config.networkAddress}
                    onChange={(e) => setConfig(prev => ({ ...prev, networkAddress: e.target.value }))}
                    placeholder="192.168.1.100"
                  />
                </div>
                
                <div>
                  <Label htmlFor="networkPort" className="text-foreground">Porta</Label>
                  <Input
                    id="networkPort"
                    value={config.networkPort}
                    onChange={(e) => setConfig(prev => ({ ...prev, networkPort: e.target.value }))}
                    placeholder="9100"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={testPrint} variant="outline" className="flex-1">
              <TestTube className="h-4 w-4 mr-2" />
              Imprimir Teste
            </Button>
            
            <Button onClick={handleSave} className="flex-1 bg-gradient-warm hover:shadow-glow transition-all duration-300">
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Export the printOrder function for use in other components
  (window as any).printOrder = printOrder;
}