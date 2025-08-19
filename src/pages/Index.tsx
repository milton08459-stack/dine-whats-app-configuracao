import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MenuCard, MenuItem } from "@/components/MenuCard";
import { Cart, CartItem } from "@/components/Cart";
import { CheckoutForm } from "@/components/CheckoutForm";
import { menuData, categories } from "@/data/menuData";
import { Search, ChefHat } from "lucide-react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const filteredMenu = menuData.filter((item) => {
    const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prev.filter((cartItem) => cartItem.id !== itemId);
    });
  };

  const removeItemFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((cartItem) => cartItem.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setShowCheckout(false);
  };

  const getItemQuantity = (itemId: string) => {
    return cartItems.find((item) => item.id === itemId)?.quantity || 0;
  };

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-4">
        <CheckoutForm
          items={cartItems}
          onBack={() => setShowCheckout(false)}
          onClearCart={clearCart}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <ChefHat className="h-8 w-8 text-food-primary" />
            <h1 className="text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent">
              Restaurante Delícia
            </h1>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar pratos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border focus:ring-food-primary"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category
                      ? "bg-gradient-warm border-0 text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMenu.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  quantity={getItemQuantity(item.id)}
                  onAdd={() => addToCart(item)}
                  onRemove={() => removeFromCart(item.id)}
                />
              ))}
            </div>

            {filteredMenu.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Nenhum prato encontrado para "{searchTerm}" na categoria "{selectedCategory}"
                </p>
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Cart
              items={cartItems}
              onRemoveItem={removeItemFromCart}
              onCheckout={() => setShowCheckout(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
