import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, ShoppingBag, Menu, ArrowLeft, Printer } from "lucide-react";
import { OrderManagement } from "@/components/admin/OrderManagement";
import { RestaurantSettings } from "@/components/admin/RestaurantSettings";
import { MenuManagement } from "@/components/admin/MenuManagement";
import { PrinterSettings } from "@/components/admin/PrinterSettings";
import { Link } from "react-router-dom";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Settings className="h-8 w-8 text-food-primary" />
                <h1 className="text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent">
                  Painel Administrativo
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[800px]">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <Menu className="h-4 w-4" />
              Cardápio
            </TabsTrigger>
            <TabsTrigger value="printer" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Impressora
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <MenuManagement />
          </TabsContent>

          <TabsContent value="printer" className="space-y-4">
            <PrinterSettings />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <RestaurantSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;