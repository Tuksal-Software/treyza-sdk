# Contributing to @treyza/sdk

Thank you for your interest in contributing to the Treyza SDK.

## Development Setup

```bash
git clone https://github.com/Tuksal-Software/treyza-sdk.git
cd treyza-sdk
npm install
npm run build
npm run typecheck
```

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable releases, protected |
| `feat/*` | New features |
| `fix/*` | Bug fixes |
| `chore/*` | Maintenance, docs, CI |

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add useOrders hook
fix: correct price formatting for zero values
chore: update radix dependencies
docs: add useCart usage example
```

## Pull Request Flow

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Run `npm run typecheck` and `npm run build` to verify
4. Open a PR against `main` with a clear description
5. Wait for review

## Code Style

- TypeScript strict mode
- No comments in code (annotations are OK)
- React 19 patterns (hooks, functional components)
- Shadcn/UI conventions for UI components
- `cn()` from `@treyza/sdk/lib/utils` for class merging

## Adding a New Hook

1. Create `src/hooks/use-<name>.ts`
2. Export from `src/hooks/index.ts`
3. Add TypeScript types to `src/types/index.ts` if needed
4. Update `README.md` exports table

## Adding a New UI Component

1. Create `src/ui/<name>.tsx`
2. Export from `src/ui/index.ts`
3. Use `cn()` for className merging
4. Use `@treyza/sdk/types` for shared type imports
5. Update `README.md` exports table

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
