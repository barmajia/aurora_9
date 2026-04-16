export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
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
