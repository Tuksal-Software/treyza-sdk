# Primitives Reference

`@treyza/sdk/primitives` paketindeki layout primitive'leri. Bu
primitive'ler responsive ve unstyled tasarlanmis; storefront temasiyla
uyumlu calisirlar.

## Container

Sayfa icerigini orta hizalanmis bir konteynera sarar.

```tsx
import { Container } from "@treyza/sdk/primitives";

<Container maxWidth="xl">
  <h1>Hoseldiniz</h1>
</Container>
```

| Prop | Tip | Default | Aciklama |
|------|-----|---------|----------|
| `maxWidth` | `"sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "full"` | `lg` | Maks. genislik token'i |
| `className` | `string` | - | Tailwind class merge |

## Grid

Responsive grid layout. Mobile-first kolon sayisi.

```tsx
import { Grid } from "@treyza/sdk/primitives";

<Grid cols={{ mobile: 1, tablet: 2, desktop: 4 }} gap={6}>
  {products.map((p) => <ProductCard key={p.id} product={p} />)}
</Grid>
```

| Prop | Tip | Aciklama |
|------|-----|----------|
| `cols` | `number \| { mobile?; tablet?; desktop? }` | Tek sayi tum breakpoint'ler icin gecerli |
| `gap` | `number` | Tailwind gap-N |

## Section

Sayfa bolumu icin semantik wrapper. Padding ve background ayarlanabilir.

```tsx
import { Section } from "@treyza/sdk/primitives";

<Section padding="lg" background="bg-muted">
  <CategoryGrid categories={...} />
</Section>
```

| Prop | Tip | Default |
|------|-----|---------|
| `padding` | `"none" \| "sm" \| "md" \| "lg"` | `md` |
| `background` | `string` | - |

## Flex

Esnek hizalama icin flex container.

```tsx
<Flex direction="row" justify="between" align="center" gap={4}>
  <Logo />
  <Nav />
  <CartIcon count={3} />
</Flex>
```

| Prop | Tip |
|------|-----|
| `direction` | `"row" \| "col"` |
| `justify` | `"start" \| "center" \| "end" \| "between" \| "around"` |
| `align` | `"start" \| "center" \| "end" \| "stretch"` |
| `gap` | `number` |

## VStack / HStack

Flex shorthand'leri. VStack dikey, HStack yatay istif.

```tsx
<VStack gap={4} align="start">
  <h2>Detaylar</h2>
  <p>Lorem ipsum...</p>
  <Button>Devam et</Button>
</VStack>
```

## Spacer

Sabit veya esnek bosluk.

```tsx
<HStack>
  <Logo />
  <Spacer />
  <CartIcon />
</HStack>
```

`size` propu numeric verirse sabit; `flex` verilirse esnek davranir.
