# Quickstart

Treyza SDK ile bir Treyza magazasi storefront'unda ilk komponentinizi
calistirma rehberi.

## 1. Kurulum

```bash
npm install @treyza/sdk
```

Peer dependency'leri zaten React 19+ projesinde mevcut olmali:

```bash
npm install react@^19 react-dom@^19
```

## 2. Tailwind CSS hazirligi

`globals.css` veya tema CSS dosyaniza Treyza preset'ini import edin:

```css
@import "@treyza/sdk/tailwind.css";
```

Bu ayar shadcn uyumlu CSS variable'lari (`--primary`, `--background`
vb.) tanimlar. Storefront tema editorunden gelen renkler `:root`
seviyesinde override edilir; SDK komponentleri otomatik dogru renkleri
kullanir.

## 3. Provider ile sarmalama

Storefront layout'unda bir kere `TreyzaSDKProvider` ile sarin:

```tsx
import { TreyzaSDKProvider } from "@treyza/sdk/provider";

export default function StorefrontLayout({ children, session }) {
  return (
    <TreyzaSDKProvider
      store={{
        slug: "ornek-magaza",
        apiUrl: "https://api.treyza.co",
        name: "Ornek Magaza",
        currency: "TRY",
        locale: "tr-TR",
        logo: "/logo.png",
      }}
      token={session?.accessToken}
      customer={session?.customer ?? null}
    >
      {children}
    </TreyzaSDKProvider>
  );
}
```

Provider context'i `window.__TREYZA_STORE__`, `window.__TREYZA_TOKEN__`
ve `window.__TREYZA_CUSTOMER__`'a yansitir. Marketplace bundle'lari
ayni context'ten okur, ayrica `useTreyza()` hook'uyla erisilebilir.

## 4. Ilk komponent

```tsx
"use client";

import { useProducts } from "@treyza/sdk/hooks";
import { ProductGrid } from "@treyza/sdk/ui";
import { Container, Section, VStack } from "@treyza/sdk/primitives";

export default function FeaturedProducts() {
  const { products, loading, error } = useProducts({
    limit: 8,
    sort: "newest",
  });

  if (error) return <p>Yuklenirken hata: {error}</p>;

  return (
    <Section padding="lg">
      <Container maxWidth="xl">
        <VStack gap={6}>
          <h2 className="text-2xl font-semibold">Yeni Urunler</h2>
          <ProductGrid
            products={products}
            columns={4}
            loading={loading}
          />
        </VStack>
      </Container>
    </Section>
  );
}
```

## 5. Action kullanimi

```tsx
import { addToCart, showToast } from "@treyza/sdk/actions";

async function handleAdd(productId: string) {
  const result = await addToCart(productId, undefined, 1);
  if (result.success) showToast("Sepete eklendi", "success");
}
```

`addToCart` ve diger action'lar otomatik olarak preview mode'unu
algilar: token yoksa veya token cart:write scope icermiyorsa local
event yayinlar (`treyza:cart:add`), gercek API'ye yazmaz.

## 6. Sonraki adimlar

- [Hooks reference](./hooks.md)
- [Primitives reference](./primitives.md)
- [Actions reference](./actions.md)
- [Preview mode davranisi](./preview-mode.md)
- [MCP / Claude entegrasyonu](./mcp-guide.md)
