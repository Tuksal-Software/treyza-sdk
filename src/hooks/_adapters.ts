import type { Product, Category, WishlistItem } from "../types";

interface BackendProductPicture {
  gallery?: { filePath: string } | null;
  filePath?: string;
}

interface BackendProduct {
  id: number | string;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  price?: { salePrice?: number | null; listPrice?: number | null } | null;
  pictures?: BackendProductPicture[] | null;
  stock?: number | null;
  status?: string;
  categoryId?: number | string | null;
  category?: { id: number | string; name: string } | null;
}

function pictureUrl(pic?: BackendProductPicture | null): string | undefined {
  if (!pic) return undefined;
  return pic.gallery?.filePath ?? pic.filePath ?? undefined;
}

export function adaptProduct(b: BackendProduct): Product {
  const images = (b.pictures ?? [])
    .map((p) => pictureUrl(p))
    .filter((url): url is string => Boolean(url));
  const sale = b.price?.salePrice ?? 0;
  const list = b.price?.listPrice ?? null;
  return {
    id: String(b.id),
    name: b.name,
    slug: b.slug,
    price: String(sale),
    compareAtPrice: list != null && list > sale ? String(list) : undefined,
    image: images[0],
    images: images.length > 0 ? images : undefined,
    description: b.description ?? b.shortDescription ?? undefined,
    categoryId: b.category?.id != null ? String(b.category.id) : b.categoryId != null ? String(b.categoryId) : undefined,
    categoryName: b.category?.name,
    inStock: b.stock == null ? true : b.stock > 0,
  };
}

interface BackendCategory {
  id: number | string;
  name: string;
  slug: string;
  parentId?: number | string | null;
  icon?: string | null;
  image?: string | null;
  gallery?: { filePath?: string } | null;
  productCount?: number;
  children?: BackendCategory[] | null;
}

export function adaptCategory(b: BackendCategory): Category {
  return {
    id: String(b.id),
    name: b.name,
    slug: b.slug,
    image: b.image ?? b.gallery?.filePath ?? b.icon ?? undefined,
    parentId: b.parentId != null ? String(b.parentId) : undefined,
    children: b.children ? b.children.map(adaptCategory) : undefined,
    productCount: b.productCount,
  };
}

interface BackendFavorite {
  id: number | string;
  productId: number | string;
  createdAt: string | Date;
  product?: {
    name?: string;
    price?: { salePrice?: number | null } | null;
    pictures?: BackendProductPicture[] | null;
  } | null;
}

export function adaptWishlistItem(b: BackendFavorite): WishlistItem {
  const sale = b.product?.price?.salePrice ?? 0;
  const firstPicture = b.product?.pictures?.[0];
  return {
    id: String(b.id),
    productId: String(b.productId),
    name: b.product?.name ?? "",
    price: String(sale),
    image: pictureUrl(firstPicture),
    addedAt: typeof b.createdAt === "string" ? b.createdAt : new Date(b.createdAt).toISOString(),
  };
}
