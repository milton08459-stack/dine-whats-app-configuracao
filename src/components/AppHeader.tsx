import { ChefHat, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface AppHeaderProps {
  restaurantName?: string;
  description?: string;
  backgroundImage?: string;
  showAdmin?: boolean;
}

export default function AppHeader({ 
  restaurantName = "Restaurante Delícia",
  description = "O melhor da culinária artesanal com ingredientes frescos e selecionados.",
  backgroundImage,
  showAdmin = true
}: AppHeaderProps) {
  return (
    <section className="relative h-[400px] overflow-hidden">
      {backgroundImage && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </>
      )}
      
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-between">
        <div className="text-white max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <ChefHat className="h-12 w-12 text-food-primary" />
            <h1 className="text-5xl font-bold bg-gradient-warm bg-clip-text text-transparent">
              {restaurantName}
            </h1>
          </div>
          <p className="text-xl text-white/90 mb-6">
            {description}
          </p>
        </div>
        
        {showAdmin && (
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
              <Settings className="h-4 w-4" />
              Admin
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}