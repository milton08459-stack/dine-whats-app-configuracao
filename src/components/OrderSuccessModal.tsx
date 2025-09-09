import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink } from "lucide-react";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedidoId: string;
  total: number;
  accessToken?: string;
}

export default function OrderSuccessModal({ 
  isOpen, 
  onClose, 
  pedidoId, 
  total, 
  accessToken 
}: OrderSuccessModalProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleViewOrder = () => {
    const baseUrl = `${window.location.origin}/acompanhar`;
    const url = accessToken 
      ? `${baseUrl}?pedido=${pedidoId}&token=${accessToken}`
      : `${baseUrl}?pedido=${pedidoId}`;
    
    window.open(url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-6 w-6" />
            Pedido realizado com sucesso!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Número do pedido
            </p>
            <p className="text-lg font-mono font-semibold bg-gray-100 rounded-lg p-3">
              #{pedidoId.slice(0, 8).toUpperCase()}
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Total do pedido
            </p>
            <p className="text-xl font-bold text-primary">
              {formatCurrency(total)}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleViewOrder}
              className="w-full flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Acompanhar pedido
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              Fazer novo pedido
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Você receberá atualizações sobre o status do seu pedido.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}