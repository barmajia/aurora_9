import { Template } from "@/types";

export const REAL_TEMPLATES: Template[] = [
  {
    id: "tpl_fashion_001",
    name: "Aesthetic Apparel",
    slug: "aesthetic-apparel",
    description: "High-end fashion template with parallax effects and minimalist grid.",
    category: "fashion",
    thumbnailUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800",
    isPremium: true,
    price: 49,
    productAsins: ["prod_001", "prod_002", "prod_003", "prod_004"],
    features: ["Parallax Hero", "Minimalist Grid", "Soft Animations"],
    layoutType: "feature-rich"
  },
  {
    id: "tpl_tech_002",
    name: "Cyber Hardware",
    slug: "cyber-hardware",
    description: "Dark-themed electronics store with industrial typography and glow effects.",
    category: "electronics",
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800",
    isPremium: false,
    productAsins: ["prod_005", "prod_006", "prod_007"],
    features: ["Dark Mode Default", "Glow Borders", "Industrial Specs"],
    layoutType: "grid"
  },
  {
    id: "tpl_food_003",
    name: "Gourmet Direct",
    slug: "gourmet-direct",
    description: "Vibrant food and culinary template with quick-add functionality.",
    category: "food",
    thumbnailUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800",
    isPremium: true,
    price: 35,
    productAsins: ["prod_008", "prod_009"],
    features: ["Quick Add", "Vibrant Palette", "Recipe Integration"],
    layoutType: "grid"
  },
  {
    id: "tpl_minimal_004",
    name: "Pure Essence",
    slug: "pure-essence",
    description: "Ultra-minimal store focusing on high-resolution product imagery.",
    category: "general",
    thumbnailUrl: "https://images.unsplash.com/photo-1481437156560-3205f6a55735?q=80&w=800",
    isPremium: false,
    productAsins: ["prod_010", "prod_011"],
    features: ["Whitespace Focus", "HD Imagery", "Smooth Transitions"],
    layoutType: "grid"
  },
  {
    id: "tpl_social_005",
    name: "Social Commerce Hub",
    slug: "social-hub",
    description: "A community-focused layout styled like a social media profile for high engagement.",
    category: "general",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800",
    isPremium: true,
    price: 59,
    productAsins: ["prod_001", "prod_005", "prod_010"],
    features: ["Cover Banner", "Profile Branding", "Feed-style Grid"],
    layoutType: "social-profile"
  }
];
