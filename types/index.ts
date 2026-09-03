export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  description: string;
  badge?: "BESTSELLER" | "NEW" | "PREMIUM" | "EXTREME" | "LIMITED";
  availability: "in_stock" | "unavailable";
  availabilityNote?: string;
  notifyOnRestock?: boolean;
  featured?: boolean;
  height?: string;
  powerSource?: string;
  features: string[];
  accentColor: string;
  bgGradient: string;
  iconEmoji: string;
  image?: string;
  video?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  bgGradient: string;
  accentColor: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  location: string;
  initials: string;
}

export interface NavLink {
  id: "shop" | "categories" | "about" | "contact";
  href: string;
}
