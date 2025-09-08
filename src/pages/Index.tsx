import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MenuCard, MenuItem } from "@/components/MenuCard";
import { Cart, CartItem } from "@/components/Cart";
import { CheckoutForm } from "@/components/CheckoutForm";
import { menuData, categories } from "@/data/menuData";
import { Search, ChefHat, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import restaurantHeroImage from "@/assets/restaurant-hero.jpg";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [restaurantConfig, setRestaurantConfig] = useState({
    name: "Restaurante Delícia",
    description: "O melhor da culinária artesanal com ingredientes frescos e selecionados.",
    heroImage: restaurantHeroImage
  });

  useEffect(() => {
    // Load restaurant config from localStorage
    const saved = localStorage.getItem('restaurantConfig');
    if (saved) {
      const config = JSON.parse(saved);
      setRestaurantConfig({
        name: config.name || "Restaurante Delícia",
        description: config.description || "O melhor da culinária artesanal com ingredientes frescos e selecionados.",
        heroImage: config.heroImage || restaurantHeroImage
      });
    }
  }, []);

  const filteredMenu = useMemo(() => {
    return menuData.filter((item) => {
      const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const addToCart = useCallback((item: MenuItem, extras?: string[], observations?: string) => {
    setCartItems((prev) => {
      // Cada item com diferentes extras ou observações é tratado como item separado
      return [...prev, { ...item, quantity: 1, selectedExtras: extras, observations }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
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
  }, []);

  const removeItemFromCart = useCallback((itemKey: string) => {
    setCartItems((prev) => prev.filter((_, index) => {
      const key = `${prev[index].id}-${index}-${(prev[index].selectedExtras || []).join('|')}-${prev[index].observations || ''}`;
      return key !== itemKey;
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setShowCheckout(false);
  }, []);

  const getItemQuantity = useCallback((itemId: string) => {
    return cartItems.find((item) => item.id === itemId)?.quantity || 0;
  }, [cartItems]);

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
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${restaurantConfig.heroImage})`,
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-between">
          <div className="text-white max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <ChefHat className="h-12 w-12 text-food-primary" />
              <h1 className="text-5xl font-bold bg-gradient-warm bg-clip-text text-transparent">
                {restaurantConfig.name}
              </h1>
            </div>
            <p className="text-xl text-white/90 mb-6">
              {restaurantConfig.description}
            </p>
          </div>
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
              <Settings className="h-4 w-4" />
              Admin
            </Button>
          </Link>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-card border-b border-border shadow-card">
        <div className="container mx-auto px-4 py-6">
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
      </section>

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
                  onAdd={(extras, observations) => addToCart(item, extras, observations)}
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
