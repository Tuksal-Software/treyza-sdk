# Actions Reference

`@treyza/sdk/actions` paketindeki imperatif fonksiyonlar. Action'lar
asenkron olabilir; hepsi `ActionResult` doner: `{ success: boolean,
data?, error? }`.

> Action'lar her zaman `TreyzaSDKProvider` icinde olan bir storefront
> sayfasinda calismalidir. Provider yokken `window.__TREYZA_TOKEN__`
> da yok demektir; bu durumda preview mode'a duser.

## addToCart

```ts
addToCart(productId: string, variantId?: string, quantity?: number): Promise<ActionResult>
```

```tsx
const result = await addToCart("1234", undefined, 2);
if (result.success) showToast("Sepete eklendi", "success");
```

Preview modunda `treyza:cart:add` event yayinlar, gercek API'ye
dokunmaz.

## removeFromCart

```ts
removeFromCart(itemId: string): Promise<ActionResult>
```

`itemId` formati: `"<productId>"` veya `"<productId>-<variantId>"`.

## updateCartItem

```ts
updateCartItem(itemId: string, quantity: number): Promise<ActionResult>
```

```tsx
await updateCartItem("1234", 5);
```

## toggleWishlist

```ts
toggleWishlist(productId: string): Promise<ActionResult<{ added: boolean }>>
```

```tsx
const r = await toggleWishlist("1234");
if (r.success) showToast(r.data!.added ? "Eklendi" : "Kaldirildi");
```

Login olmayan kullanicilarda `window.__TREYZA_WISHLIST__` local array
ile calisir.

## navigate

```ts
navigate(path: string): void
```

`treyza:navigate` custom event'i yayinlar. Storefront router bunu
yakalayip yonlendirir.

```tsx
<Button onClick={() => navigate("/urun/yaz-tisort")}>Detay</Button>
```

## showToast

```ts
showToast(message: string, type?: "success" | "error" | "info"): void
```

`treyza:toast` event'i yayinlar. Storefront global toast container'i
dinler ve gosterir.

## openQuickView

```ts
openQuickView(productId: string): void
```

Hizli bakis modal'i ic erika. Storefront bu event'i dinler ve modal
gosterir.

## formatPrice

```ts
formatPrice(amount: number | string): string
```

Aktif locale + currency'ye gore para formatlar. `utils` modulundeki
ayni fonksiyonun shorthand'i.

```tsx
formatPrice(199.5);  // "199,50 ₺" (tr-TR + TRY)
```

## subscribe

```ts
subscribe(email: string): Promise<ActionResult>
```

Global newsletter abonelik endpoint'ine POST atar.

```tsx
const r = await subscribe("user@example.com");
showToast(r.success ? "Abone olundu" : "Hata", r.success ? "success" : "error");
```

## trackEvent

```ts
trackEvent(name: string, data?: Record<string, unknown>): void
```

`treyza:analytics` event yayinlar; storefront analytics provider'i
yakalar.

```tsx
trackEvent("hero_cta_click", { variant: "v2" });
```

## openModal

```ts
openModal(config: {
  title?: string;
  content?: string;
  size?: "sm" | "md" | "lg" | "xl";
}): void
```

Storefront global modal mount'una mesaj atar.

## applyDiscount

```ts
applyDiscount(code: string): Promise<ActionResult>
```

Kupon kodu uygulama. Basarili ise sepet otomatik refresh edilir.

## share

```ts
share(url?: string, platform?: "whatsapp" | "twitter" | "facebook" | "copy"): Promise<void>
```

URL paylasimi. Platform belirtilmezse native Web Share API kullanilir,
yoksa link kopyalama fallback.

```tsx
<Button onClick={() => share(undefined, "whatsapp")}>WhatsApp</Button>
<Button onClick={() => share(undefined, "copy")}>Linki Kopyala</Button>
```
