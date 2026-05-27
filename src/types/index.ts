export interface ProductVariant {
  id: string;
  name: string;
  price: string;
  inStock: boolean;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  compareAtPrice?: string;
  image?: string;
  images?: string[];
  description?: string;
  categoryId?: string;
  categoryName?: string;
  inStock: boolean;
  variants?: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  productCount?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: string;
  quantity: number;
  image?: string;
  variantId?: string;
  variantName?: string;
}

export interface StoreInfo {
  name: string;
  logo?: string;
  currency: string;
  locale: string;
  socialLinks?: Record<string, string>;
}

export interface ThemeVars {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  radius: string;
  font: string;
}

export interface ConfigSchema {
  name: string;
  label: string;
  type: string;
  defaultValue: unknown;
  options?: string[];
  min?: number;
  max?: number;
  placeholder?: string;
}

export interface UseProductsOptions {
  limit?: number;
  categoryId?: string;
  sort?: string;
  search?: string;
}

export interface UseCategoriesOptions {
  parentId?: string;
  depth?: number;
}

export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  itemCount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: string;
  image?: string;
  addedAt: string;
}

export interface SearchResult {
  products: Product[];
  categories: Category[];
  totalCount: number;
}

export interface UseSearchOptions {
  limit?: number;
  categoryId?: string;
}

export type Store = StoreInfo;

export type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
export type ComponentType = "SECTION" | "PAGE" | "WIDGET";
export type ComponentCategory = "LAYOUT" | "MEDIA" | "CONTENT" | "ECOMMERCE" | "INTERACTION";

export type ConfigFieldType =
  | "text" | "textarea" | "number" | "slider" | "color" | "url" | "date" | "boolean" | "icon"
  | "image" | "gallery" | "select" | "switch"
  | "typography" | "textColor" | "alignmentPrimitive"
  | "items" | "buttonLink" | "categorySelector" | "simpleProductSelector" | "faqItems";

export interface ConfigField {
  key: string;
  type: ConfigFieldType;
  label: string;
  defaultValue: unknown;
  group?: string;
  options?: Array<{ label: string; value: string }>;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  itemSchema?: ConfigField[];
}

export interface ComponentProps {
  config: Record<string, unknown>;
}

export interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

export interface UseCartReturn {
  items: CartItem[];
  total: string;
  itemCount: number;
  addToCart: (payload: { productId: string; variantId?: string; quantity?: number }) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export interface UseCustomerReturn {
  customer: Customer | null;
  isLoggedIn: boolean;
}

export interface UseWishlistReturn {
  items: WishlistItem[];
  add: (productId: string) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  toggle: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}
