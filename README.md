# @treyza/sdk

Treyza storefront SDK — React hooks, actions, UI primitives, and shadcn-based components for building marketplace storefronts.

## Installation

```bash
npm install @treyza/sdk
```

Peer dependencies:

```bash
npm install react react-dom
```

## Quick Start

Wrap your app with `TreyzaSDKProvider`:

```tsx
import { TreyzaSDKProvider } from "@treyza/sdk/provider";

function App() {
  return (
    <TreyzaSDKProvider
      store={{
        slug: "my-store",
        apiUrl: "https://api.treyza.co",
        name: "My Store",
        currency: "TRY",
        locale: "tr-TR",
      }}
    >
      <StorefrontPage />
    </TreyzaSDKProvider>
  );
}
```

Fetch and display products:

```tsx
import { useProducts } from "@treyza/sdk/hooks";
import { ProductGrid } from "@treyza/sdk/ui";
import { addToCart } from "@treyza/sdk/actions";

function StorefrontPage() {
  const { products, loading } = useProducts({ limit: 12, sort: "newest" });

  if (loading) return <p>Loading...</p>;

  return (
    <ProductGrid
      products={products}
      columns={4}
      onProductClick={(product) => addToCart(product.id)}
    />
  );
}
```

## Exports

| Subpath | Description |
|---------|-------------|
| `@treyza/sdk/hooks` | React hooks — `useProducts`, `useCart`, `useCategories`, `useSearch`, `useWishlist`, `useCustomer`, `useStore`, `useTheme`, `useConfig`, `useInView`, `useAnimation`, `usePagination`, `useFilter`, `useProduct` |
| `@treyza/sdk/actions` | Storefront actions — `addToCart`, `removeFromCart`, `updateCartItem`, `toggleWishlist`, `navigate`, `showToast`, `openQuickView`, `formatPrice`, `subscribe`, `trackEvent`, `openModal`, `applyDiscount`, `share` |
| `@treyza/sdk/ui` | Shadcn-based UI — `Button`, `Card`, `Dialog`, `Sheet`, `ProductCard`, `ProductGrid`, `ProductSlider`, `CartDrawer`, `CartIcon`, `CartSummary`, `CategoryGrid`, `CategoryNav`, `SearchBar`, `SearchResults`, `PriceDisplay`, `ReviewStars`, `ReviewForm`, `VariantSelector`, `EditableText`, `CountdownTimer`, `TrustBadges`, `QuantitySelector`, and 30+ base components |
| `@treyza/sdk/primitives` | Layout primitives — `Container`, `Grid`, `Section`, `Flex`, `VStack`, `HStack`, `Spacer` |
| `@treyza/sdk/types` | TypeScript types — `Product`, `Category`, `CartItem`, `Customer`, `StoreInfo`, `ThemeVars`, `ConfigField`, `Order`, `Review`, `WishlistItem`, `SearchResult` |
| `@treyza/sdk/utils` | Utility functions — `formatPrice`, `formatDate`, `slugify` |
| `@treyza/sdk/lib/utils` | `cn()` helper (clsx + tailwind-merge) |
| `@treyza/sdk/provider` | `TreyzaSDKProvider`, `useTreyza` |
| `@treyza/sdk/tailwind.css` | Tailwind CSS theme with shadcn variables |

Deep imports are also supported:

```ts
import { Button } from "@treyza/sdk/ui/button";
import { useCart } from "@treyza/sdk/hooks/use-cart";
```

## Tailwind CSS

Import the SDK's Tailwind preset in your CSS:

```css
@import "@treyza/sdk/tailwind.css";
```

This provides shadcn-compatible CSS variables (`--background`, `--foreground`, `--primary`, etc.) with sensible defaults that can be overridden via CSS custom properties.

## Documentation

Detayli rehberler `docs/` altinda:

- [docs/quickstart.md](./docs/quickstart.md) — Kurulum, provider, ilk komponent
- [docs/hooks.md](./docs/hooks.md) — Hook referansi
- [docs/primitives.md](./docs/primitives.md) — Layout primitive'leri
- [docs/actions.md](./docs/actions.md) — Imperatif action'lar
- [docs/preview-mode.md](./docs/preview-mode.md) — Live vs preview davranisi
- [docs/mcp-guide.md](./docs/mcp-guide.md) — Claude / Cursor ile bilesen uretimi

## License

[MIT](./LICENSE)
