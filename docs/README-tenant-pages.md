# Tenant pages — how to ship one

Each announced tenant gets its own page at `/tenants/<slug>/`. These are the
highest-value pages on the site per unit of effort: nobody else competes for
"<tenant name> Peoria", the searches convert, and the tenant will almost always
link back to their page from their own site and bio.

**Do not publish a tenant page before Stephen has announced that tenant.**

## Steps

1. `cp docs/tenant-page-template.html tenants/<slug>/index.html`
2. Replace every `{{TOKEN}}` (table below). Grep for `{{` afterwards to confirm
   none are left.
3. Add the URL to `sitemap.xml` with `priority` 0.7.
4. Link it from the homepage `#lineup` section.
5. On the **first** tenant page, also create `tenants/index.html` as the lineup
   index. One tenant page can stand alone; two or more want an index above them.
6. Add `Disallow:` nothing — these pages SHOULD be indexed.

## Tokens

| Token | What goes in it | Example |
|---|---|---|
| `{{TENANT_NAME}}` | Business name, exactly as they spell it | `Novel Ice Cream` |
| `{{SLUG}}` | URL slug, lowercase, hyphens | `novel-ice-cream` |
| `{{TENANT_ONE_LINER}}` | One sentence, plain, no marketing adjectives | `Small-batch ice cream from a Phoenix shop that built its name on it.` |
| `{{TENANT_CATEGORY_LABEL}}` | Eyebrow above the name | `Sweets` / `Kitchen` / `Retail` |
| `{{SCHEMA_TYPE}}` | schema.org type — see below | `IceCreamShop` |
| `{{CUISINE_OR_REMOVE}}` | `servesCuisine` value, or delete the whole key if not food | `Ice cream` |
| `{{PRICE_RANGE}}` | Google's `$`–`$$$$` scale | `$` |
| `{{TENANT_INSTAGRAM}}` | Full URL | `https://www.instagram.com/novelicecream` |
| `{{TENANT_INSTAGRAM_HANDLE}}` | Display text | `@novelicecream` |
| `{{TENANT_WEBSITE}}` | Full URL, or remove from the `sameAs` array | |
| `{{OPTIONAL_WEBSITE_LINK}}` | ` · <a href="…">theirsite.com</a>` or empty string | |
| `{{OPENING_DATE_ISO}}` | `YYYY-MM` or `YYYY-MM-DD` | `2026-11` |
| `{{OPENING_HUMAN}}` | Human phrasing | `With us in November 2026` |
| `{{SUITE_LABEL}}` | Which space, in plain words — **not** the internal suite code | `Container shop on the 83rd Ave entry` |
| `{{TENANT_TYPE_HUMAN}}` | Plain description | `Retail / sweets, 192 SF` |
| `{{WHO_HEADLINE}}` `{{WHO_PARAGRAPH_1}}` `{{WHO_PARAGRAPH_2}}` | Who they are, in Stephen's voice — humble, community-first, no hype | |
| `{{WHAT_HEADLINE}}` `{{WHAT_PARAGRAPH}}` | What they make | |
| `{{HERO_IMAGE_800}}` `{{HERO_IMAGE_1200}}` | Filenames in `img/opt/` | `tenant-novel-800.jpg` |
| `{{HERO_W}}` `{{HERO_H}}` | Native pixel dims of the 1200 variant — required, prevents layout shift | `1200` / `800` |
| `{{HERO_ALT}}` | Real alt text describing the image | |
| `{{OG_IMAGE}}` | Social card image in `img/opt/` | `tenant-novel-og.jpg` |

## Picking `{{SCHEMA_TYPE}}`

Use the most specific schema.org type that fits — specificity is what earns the
richer result. Common ones here:

- `Restaurant`, `CafeOrCoffeeShop`, `BakeryShop`, `IceCreamShop`, `FastFoodRestaurant`
- `BarOrPub` (the courtyard bar)
- `Store`, `ClothingStore`, `GiftShop`, `HealthAndBeautyBusiness`

If nothing fits, `LocalBusiness` is the safe fallback. Never invent a type.

## Images

Run new tenant photos through the same pipeline as everything else in `img/opt/`
— AVIF q55 / WebP q74 / JPEG q78 mozjpeg at 800 and 1200. iPhone HEIC files need
`sips` then `exiftool -all=` before sharp will read them; see the build-photo
notes in the project memory for the exact incantation.

## Why `containedInPlace` matters

The template points each tenant's `containedInPlace` at
`https://www.jeffersonhouseaz.com/#venue`. That is what tells Google these
businesses are *inside* Jefferson House rather than merely nearby, which is how
the venue accumulates entity weight from its tenants instead of competing with
them.
