# Hooks Reference

@treyza/sdk/hooks paketindeki tum React hook'larin imzasi, donus tipi
ve kullanim ornegi.

> Tum hook'lar `TreyzaSDKProvider` kapsaminda calismalidir; provider
> store config, token ve customer context'ini saglar.

## useProducts

```ts
useProducts(options?: {
  limit?: number;
  categoryId?: string;
  sort?: string;
  search?: string;
}): {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}
```

```tsx
const { products, loading } = useProducts({ limit: 12, sort: "newest" });
if (loading) return <Skeleton />;
return <ProductGrid products={products} columns={4} />;
```

## useProduct

```ts
useProduct(slug: string): {
  product: Product | null;
  loading: boolean;
  error: string | null;
}
```

```tsx
const { product, loading } = useProduct("yaz-tisort");
if (loading || !product) return null;
return (
  <article>
    <h1>{product.name}</h1>
    <PriceDisplay amount={product.price} />
  </article>
);
```

## useCategories

```ts
useCategories(options?: {
  parentId?: string;
  depth?: number;
}): { categories: Category[]; loading: boolean }
```

```tsx
const { categories } = useCategories({ depth: 2 });
return <CategoryNav items={categories} />;
```

## useCart

```ts
useCart(): {
  items: CartItem[];
  total: string;
  itemCount: number;
  addToCart(payload: { productId: string; variantId?: string; quantity?: number }): Promise<void>;
  removeFromCart(itemId: string): Promise<void>;
  updateQuantity(itemId: string, quantity: number): Promise<void>;
  clearCart(): Promise<void>;
}
```

```tsx
const cart = useCart();
return (
  <CartSummary
    items={cart.items}
    total={cart.total}
    onIncrement={(id) => cart.updateQuantity(id, getItem(id).quantity + 1)}
  />
);
```

## useCustomer

```ts
useCustomer(): { customer: Customer | null; isLoggedIn: boolean }
```

```tsx
const { customer, isLoggedIn } = useCustomer();
if (!isLoggedIn) return <a href="/login">Giris yap</a>;
return <p>Merhaba {customer?.firstName ?? customer?.email}</p>;
```

## useWishlist

```ts
useWishlist(): {
  items: WishlistItem[];
  add(productId: string): Promise<void>;
  remove(productId: string): Promise<void>;
  toggle(productId: string): Promise<void>;
  isInWishlist(productId: string): boolean;
}
```

```tsx
const wishlist = useWishlist();
const liked = wishlist.isInWishlist(product.id);
return (
  <button onClick={() => wishlist.toggle(product.id)}>
    {liked ? "Listede" : "Listeye Ekle"}
  </button>
);
```

## useStore

```ts
useStore(): StoreInfo
```

```tsx
const store = useStore();
return <header>{store.logo ? <img src={store.logo} /> : store.name}</header>;
```

## useSearch

```ts
useSearch(query: string, options?: UseSearchOptions): {
  results: SearchResult;
  loading: boolean;
}
```

```tsx
const [q, setQ] = useState("");
const { results, loading } = useSearch(q, { limit: 5 });
return (
  <>
    <SearchBar value={q} onChange={setQ} loading={loading} />
    <SearchResults results={results} />
  </>
);
```

## useTheme

```ts
useTheme(): ThemeVars
```

```tsx
const theme = useTheme();
return <div style={{ borderColor: theme.primary }}>...</div>;
```

## useConfig

```ts
useConfig<T = Record<string, unknown>>(): T
```

Marketplace komponentinin editorden gelen `config` propunu doner.
Component icinden okumak yerine config'i prop olarak almak da
mumkundur; bu hook icic icic editable text gibi senaryolar icin.

```tsx
const cfg = useConfig<{ title: string; ctaUrl: string }>();
return <h2>{cfg.title}</h2>;
```

## useInView

```ts
useInView<T extends Element>(options?: IntersectionObserverInit): {
  ref: React.RefObject<T>;
  inView: boolean;
}
```

```tsx
const { ref, inView } = useInView({ threshold: 0.5 });
return <div ref={ref}>{inView ? "Goruldun" : "..."}</div>;
```

## useAnimation

```ts
useAnimation(
  preset: "fade" | "slide-up" | "scale" | "rotate" | "custom",
  options?
): { ref; style; play; reverse }
```

```tsx
const { ref, style, play } = useAnimation("fade");
return <div ref={ref} style={style} onClick={play}>Tikla</div>;
```

## usePagination

```ts
usePagination(total: number, options?: { perPage?: number; initialPage?: number }): {
  page: number;
  totalPages: number;
  setPage(page: number): void;
  next(): void;
  prev(): void;
  isFirst: boolean;
  isLast: boolean;
}
```

```tsx
const pager = usePagination(items.length, { perPage: 12 });
const slice = items.slice((pager.page - 1) * 12, pager.page * 12);
return (
  <>
    {slice.map(...)}
    <Pagination
      page={pager.page}
      totalPages={pager.totalPages}
      onPageChange={pager.setPage}
    />
  </>
);
```

## useFilter

```ts
useFilter<T>(items: T[], predicate: (item: T) => boolean): T[]
```

```tsx
const visible = useFilter(products, (p) => p.inStock);
```
