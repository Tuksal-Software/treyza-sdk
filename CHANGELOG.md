# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0-beta.3] - 2026-05-27

### Fixed

- Added missing `cmdk` runtime dependency. `@treyza/sdk/ui/command`
  imports `cmdk` directly; without it consumers got
  `ERR_MODULE_NOT_FOUND: Cannot find package 'cmdk'`.

## [0.1.0-beta.2] - 2026-05-27

### Fixed

- `dist/*.mjs` and `dist/*.cjs` relative imports now include explicit
  file extensions (`.mjs` / `.cjs`), required by Node.js ESM
  resolution. Previously `import { cn } from "./lib/utils"` failed
  with `ERR_MODULE_NOT_FOUND` outside bundlers. Subpath imports
  (`@treyza/sdk/hooks`, `@treyza/sdk/ui`, etc.) now resolve correctly
  in plain Node ESM consumers.

### Build

- Added `scripts/fix-import-extensions.mjs` post-build step that
  rewrites relative specifiers in compiled output with the right
  extension (`.mjs` / `.cjs` / `.js` for `.d.ts` / `.cjs` for
  `.d.cts`), including `import`, `export from`, dynamic `import()`
  and `require()`.

## [0.1.0-beta.1] - 2026-05-27

### Added

- Initial SDK release with storefront hooks, actions, UI components, and primitives
- **Hooks**: `useProducts`, `useProduct`, `useCart`, `useCategories`, `useSearch`, `useWishlist`, `useCustomer`, `useStore`, `useTheme`, `useConfig`, `useInView`, `useAnimation`, `usePagination`, `useFilter`
- **Actions**: `addToCart`, `removeFromCart`, `updateCartItem`, `toggleWishlist`, `navigate`, `showToast`, `openQuickView`, `formatPrice`, `subscribe`, `trackEvent`, `openModal`, `applyDiscount`, `share`
- **UI**: 50+ shadcn-based components including `ProductCard`, `ProductGrid`, `CartDrawer`, `CategoryGrid`, `SearchBar`, `ReviewStars`, `PriceDisplay`, `EditableText`, `CountdownTimer`, `TrustBadges`, `QuantitySelector`
- **Primitives**: `Container`, `Grid`, `Section`, `Flex`, `VStack`, `HStack`, `Spacer`
- **Provider**: `TreyzaSDKProvider` with store context, auth token, and customer state
- **Types**: Full TypeScript definitions for `Product`, `Category`, `CartItem`, `Customer`, `StoreInfo`, `ThemeVars`, `ConfigField`, `Order`, `Review`, `WishlistItem`, `SearchResult`
- **Utils**: `formatPrice`, `formatDate`, `slugify`, `cn`
- Tailwind CSS theme preset with shadcn-compatible CSS variables
- ESM + CJS dual-format build with full `.d.ts` declarations
- Subpath exports with nested wildcard support (`@treyza/sdk/ui/button`)

[0.1.0-beta.3]: https://github.com/Tuksal-Software/treyza-sdk/releases/tag/v0.1.0-beta.3
[0.1.0-beta.2]: https://github.com/Tuksal-Software/treyza-sdk/releases/tag/v0.1.0-beta.2
[0.1.0-beta.1]: https://github.com/Tuksal-Software/treyza-sdk/releases/tag/v0.1.0-beta.1
