# MCP Guide — Claude / Cursor ile Bilesen Uretimi

Treyza ekosistemi disindaki gelistirciler `@treyza/mcp` paketi
sayesinde Claude Desktop veya Cursor'dan tek komutla Treyza
komponentleri uretebilir, dogrulayabilir ve SDK metadata'sini okuyabilir.

## Mimari

```
Claude Desktop / Cursor
        │  (stdio veya HTTP/SSE)
        ▼
treyza-mcp (Node)
  ├─ Stdio transport  → local child process (npx ile)
  └─ HTTP transport   → mcp.treyza.co (Coolify'da)
        │  HTTPS + x-treyza-token header
        ▼
treyza-api /api/mcp/*
  ├─ generateComponent — AI + AST + esbuild validate
  ├─ validateComponent — AST + esbuild
  ├─ listHooks         — SDK hook metadata
  └─ listPrimitives    — SDK primitive metadata
```

MCP server hicbir state tutmaz; her cagri treyza-api'ye proxy'lenir.

## 1. API anahtari olusturma

Treyza merchant hesabinizdaki JWT ile yeni bir API anahtari uretin:

```bash
curl -X POST https://api.treyza.co/api/mcp/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <merchant_jwt>" \
  -d '{
    "name": "Local Claude Desktop",
    "rateLimitRpm": 60
  }'
```

Yanitin `data.plainToken` alanindaki `tk_*` degeri sadece bir kez
gosterilir. Sonra hash'i DB'de saklanir; iptal etmek icin:

```bash
curl -X DELETE https://api.treyza.co/api/mcp/api-keys/<id> \
  -H "Authorization: Bearer <merchant_jwt>"
```

## 2. Stdio (local) modu — Claude Desktop

`~/Library/Application Support/Claude/claude_desktop_config.json`
(macOS) veya `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "treyza": {
      "command": "npx",
      "args": ["-y", "@treyza/mcp"],
      "env": {
        "TREYZA_API_BASE": "https://api.treyza.co",
        "TREYZA_API_TOKEN": "tk_xxxxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

Claude Desktop'i yeniden baslatin. Yeni bir sohbette tools menusunde
"treyza" gozukur.

## 3. HTTP (remote) modu — Cursor / ozel kullanimlar

`@treyza/mcp` HTTP/SSE transport'unu da destekler. Treyza ekosistemi
bunu Coolify'da `mcp.treyza.co` adresinde host eder; tek bir endpoint
turn kullanicilara hizmet verir.

```json
{
  "mcp": {
    "servers": {
      "treyza": {
        "url": "https://mcp.treyza.co/mcp",
        "headers": {
          "Authorization": "Bearer optional_gateway_token"
        }
      }
    }
  }
}
```

Notlar:
- API anahtariniz (tk_) `TREYZA_API_TOKEN` olarak environment'a setlenir
  (server-side); kullanicinin Claude config'inde gorunmez.
- Gateway token (opsiyonel) ekstra bir DDoS koruma katmanidir.
- Claude Desktop su anda stabil olarak sadece stdio'yu destekler;
  Cursor ve diger MCP clientlari HTTP transport'a baglanabilir.

## 4. Tool'lar

### generateComponent

```jsonc
{
  "prompt": "Anasayfa icin urun tanitan bir hero section",
  "componentType": "SECTION",
  "category": "CONTENT"
}
```

Yanit `tsx`, `name`, `description`, `configSchema`, `componentType` ve
`category` icerir. Cikti S3'e atilmaz; siz gerekirse Treyza management
panelinden manuel kaydedebilir veya kendi proje structure'inize entegre
edebilirsiniz.

### validateComponent

```jsonc
{ "tsx": "import { Button } from '@treyza/sdk/ui'; ..." }
```

AST analiz + esbuild syntax kontrolu. `valid: false` ise `errors`
dizisi sebebi belirtir.

### listHooks / listPrimitives

Argumansiz cagrilir. Asagidaki yapida JSON doner:

```jsonc
{
  "version": "0.1.0-beta.3",
  "package": "@treyza/sdk",
  "subpath": "@treyza/sdk/hooks",
  "hooks": [{ "name": "useProducts", "signature": "...", "returns": "...", "description": "..." }]
}
```

Bu sayede AI sohbeti, SDK'nin guncel surumune gore tutarli kod
uretebilir.

## 5. Rate Limit

Her API anahtari kendi `rateLimitRpm` degeriyle sinirlandirilir
(default 60). Limit asilirsa MCP cagri 429 doner ve `Retry-After`
header'i sunulur. Claude / Cursor genelde bunu kullanici dostu sekilde
gosterir.

## 6. Hata Cozumleri

| Belirti | Cozum |
|---------|-------|
| `Missing required env var TREYZA_API_BASE` | Config'de env eksik; sema icin `examples/claude-desktop-config.json` |
| 401 Unauthorized | API anahtari yanlis, expire veya revoke; yenisini olustur |
| 429 Too Many Requests | Rate limit; `Retry-After` saniye sonra tekrar dene veya `rateLimitRpm`'i artir |
| Tool listesi gozukmuyor | Claude Desktop'i tamamen kapat ve yeniden ac; config'i tekrar oku |
| AI uretimi `mcp.generation_invalid` doner | TSX AST/esbuild dogrulamasini gecemedi; prompt'a daha net kisitlar ekle |

## 7. Ileride

- npm publish `@treyza/mcp` (mcp.treyza.co'da host edilen ile ayni paket)
- Management panelinden interaktif API anahtari yonetimi
- Webhook event'lari (component generate sonrasi notification)
