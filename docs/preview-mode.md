# Preview Mode

SDK iki farkli baglamda calisabilecek sekilde tasarlandi:

1. **Live mode** — storefront ortaminda, login olmus bir musteriyle.
   Action'lar gercek API'ye yazar, hook'lar live verileri okur.
2. **Preview mode** — management panelindeki marketplace builder veya
   AI chat builder'in iframe onizlemesi gibi izole baglamlar. Burada
   yetkili token yok; action'lar sadece event yayinlar, hook'lar
   placeholder davranir.

## Karar agaci

```ts
function isPreviewMode(): boolean {
  const token = window.__TREYZA_TOKEN__;
  if (!token) return true;

  const parts = token.split(".");
  if (parts.length !== 3) return true;

  const payload = JSON.parse(atob(parts[1]));
  return !payload.scopes?.includes("cart:write");
}
```

Yani:
- Token hic yoksa preview.
- Token gecerli bir JWT degilse preview.
- Token'da `cart:write` scope'u yoksa preview.

Boylece preview iframe'ler "read-only" bir token alabilir, hooks data
fetch eder ama actions yan etki yapmaz.

## Action davranis farklari

| Action | Live | Preview |
|--------|------|---------|
| `addToCart` | API'ye POST atar, `treyza:cart:updated` yayinlar | Sadece `treyza:cart:add` yayinlar |
| `removeFromCart` | API DELETE | `treyza:cart:remove` event |
| `updateCartItem` | API PATCH | `treyza:cart:update` event |
| `toggleWishlist` | Login varsa API, yoksa `__TREYZA_WISHLIST__` array'i | Login yok varsayilir, array |
| `subscribe` | Global newsletter API | `treyza:subscribe` event |
| `applyDiscount` | API validate | `treyza:discount` event |

## Storefront tarafinda dinleme

```tsx
useEffect(() => {
  function onCartAdd(e: Event) {
    const detail = (e as CustomEvent).detail;
    console.log("preview cart add:", detail);
  }
  window.addEventListener("treyza:cart:add", onCartAdd);
  return () => window.removeEventListener("treyza:cart:add", onCartAdd);
}, []);
```

## Tema gorunumu

Preview iframe'ler, parent sayfanin (yani editor'un) CSS variable'larini
miras alabilir. Bu sayede merchant editorde rengi degistirdiginde
iframe icindeki marketplace bundle aninda yansir.

Editor implementasyonu icin onerilen pattern:

```tsx
const iframeSrcDoc = `
<!doctype html>
<html style="--primary: ${theme.primary}; --background: ${theme.background};">
  ...
</html>
`;
```

## Test ortaminda preview mode'a zorlama

Birim test veya storybook icin hicbir token set etmeden once:

```ts
delete window.__TREYZA_TOKEN__;
// hooks ve actions otomatik preview davranisina gecer
```
