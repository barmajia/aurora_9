export interface Product {
  id: string;
  name?: string;
  title?: string;
  price: number | null;
  description: string;
  image: string;
  images?: Array<{ url: string }>;
  category?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  status?: "active" | "inactive";
  stock?: number | boolean;
  quantity?: number;
  oldPrice?: number;
  currency?: string;
  subcategory?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}
