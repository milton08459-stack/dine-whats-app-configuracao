import hamburgerImg from "@/assets/hamburger.jpg";
import pizzaImg from "@/assets/pizza.jpg";
import saladImg from "@/assets/salad.jpg";
import pastaImg from "@/assets/pasta.jpg";
import { MenuItem } from "@/components/MenuCard";

export const menuData: MenuItem[] = [
  {
    id: "1",
    name: "Hambúrguer Artesanal",
    description: "Pão brioche, carne bovina 180g, queijo cheddar, alface, tomate, cebola roxa e molho especial da casa",
    price: 24.90,
    image: hamburgerImg,
    category: "Hambúrgueres"
  },
  {
    id: "2",
    name: "Pizza Margherita",
    description: "Molho de tomate artesanal, mussarela fresca, manjericão e azeite extra virgem",
    price: 32.90,
    image: pizzaImg,
    category: "Pizzas"
  },
  {
    id: "3",
    name: "Salada Caesar",
    description: "Mix de folhas verdes, croutons crocantes, lascas de parmesão e molho caesar cremoso",
    price: 19.90,
    image: saladImg,
    category: "Saladas"
  },
  {
    id: "4",
    name: "Pasta Carbonara",
    description: "Espaguete al dente, bacon crocante, ovos frescos, queijo parmesão e pimenta do reino",
    price: 28.90,
    image: pastaImg,
    category: "Massas"
  },
  {
    id: "5",
    name: "Hambúrguer Bacon",
    description: "Pão artesanal, carne bovina 200g, bacon crocante, queijo swiss, alface e molho barbecue",
    price: 27.90,
    image: hamburgerImg,
    category: "Hambúrgueres"
  },
  {
    id: "6",
    name: "Pizza Pepperoni",
    description: "Molho de tomate temperado, mussarela, pepperoni italiano e orégano",
    price: 35.90,
    image: pizzaImg,
    category: "Pizzas"
  },
  {
    id: "7",
    name: "Salada Tropical",
    description: "Mix de folhas, manga, abacaxi, nozes, queijo de cabra e vinagrete de maracujá",
    price: 22.90,
    image: saladImg,
    category: "Saladas"
  },
  {
    id: "8",
    name: "Pasta Pesto",
    description: "Penne com molho pesto de manjericão fresco, tomates secos e lascas de parmesão",
    price: 25.90,
    image: pastaImg,
    category: "Massas"
  }
];

export const categories = ["Todos", "Hambúrgueres", "Pizzas", "Saladas", "Massas"];