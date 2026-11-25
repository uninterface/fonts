# Uninterface default fonts

`@uninterface/fonts` supplies the optional shared Noto Sans Variable font set with language-aware Noto Sans SC/TC fallbacks. It owns font selection and delivery. Backends own component styles and native typography mappings.

## Setup

Choose one font entry, then always import the selected backend's stable stylesheet:

| Choice | First import |
|---|---|
| Backend default · Network (recommended starting setup) | `@uninterface/backend/font.css` |
| Backend default · Bundled | `@uninterface/backend/font-bundled.css` |
| Uninterface default · Network | `@uninterface/fonts/font.css` |
| Uninterface default · Bundled | `@uninterface/fonts/font-bundled.css` |

1. Follow the selected backend's setup guide to resolve core and the backend. Run `npm install @uninterface/fonts` for either Uninterface-default choice.
2. Import exactly one font entry first, followed by backend styles. For Uninterface default · Network:

   ```ts
   import '@uninterface/fonts/font.css'
   import '@uninterface/backend/style.css'
   ```

   For Bundled delivery, change only the first import to `@uninterface/fonts/font-bundled.css`. CSS `@import` composition uses the same order, with all imports before ordinary rules.
3. For Network, permit `https://cdn.jsdelivr.net` in applicable CSP `style-src`, `style-src-elem` and `font-src` sources. Version-pinned Fontsource CSS and WOFF2 subsets are fetched from this third-party CDN; no extra HTML link, key or loader is needed. No font binaries are emitted in the application build.
4. For Bundled, build normally and deploy the generated assets. Permit their origin in `font-src`. No CDN font requests are made. Full font emission is approximately 9.7 MB, mostly Chinese subsets; this is deployment size, not initial transfer. Fontsource dependencies are installed with this package in either mode.
5. Declare document/content languages and check loaded faces, weights, wrapping, controls and popup surfaces. If network fonts fail, system fallbacks keep text available without guaranteeing the recommended appearance.

Backend-default choices do not require this package. Backend `style.css` alone uses system fonts without downloads. For another provider, omit the font entry, load your licensed faces and set `--uninterface-font-family` after importing backend styles. This overrides the whole stack, including language fallbacks, and must reach teleported surfaces outside any scoped application root. Changing an override does not remove requests from an already imported font entry.

## Package exports and ownership

| Export | Responsibility |
|---|---|
| `@uninterface/fonts/font.css` | Shared family/language selection plus pinned network font delivery |
| `@uninterface/fonts/font-bundled.css` | Identical selection with local Fontsource assets |

Neither entry imports backend component CSS or requires a backend package. Both supply `--uninterface-font-set-family` at document and explicit language boundaries. Backends consume this value without replacing it, using the application `--uninterface-font-family` override first and system fonts if no set is selected. Importing multiple font entries is unsupported. Font selection does not change native component sizes or requested weights, and preserves code/monospace semantics.

## Coverage and loading

Noto Sans Variable 5.3.0 supplies Latin, Latin extensions, Greek, Cyrillic, Vietnamese and Devanagari subsets, with normal and italic weights 100–900. Noto Sans SC/TC Variable 5.3.1 provide upright Chinese weights 100–900. SC is the default Chinese fallback; zh-Hant, zh-TW, zh-HK and zh-MO boundaries select TC. Teleported content must declare its language when different from the document.

The initial language acceptance target is English, Simplified Chinese and Traditional Chinese. Included subsets do not establish complete shaping/layout acceptance. Japanese/Korean regional selection and Arabic/Hebrew/Thai families remain outside this set. Unsupported scripts use platform fallback; CJK italics may be synthesized. This package does not introduce a font-role strategy or serif set.

Font faces use Unicode subsetting and `font-display: swap`. Browsers fetch subsets needed by content; layout can change after fonts load. Applications own CSP, caching, local deployment and verification of their real content.

## Licenses and verification

The package source is available under the [MIT License](LICENSE). Each font
family has its own license.

- [Noto Sans](docs/font-licenses/noto-sans.txt), Fontsource Variable 5.3.0, SIL Open Font License 1.1.
- [Noto Sans SC](docs/font-licenses/noto-sans-sc.txt), Fontsource Variable 5.3.1, SIL Open Font License 1.1.
- [Noto Sans TC](docs/font-licenses/noto-sans-tc.txt), Fontsource Variable 5.3.1, SIL Open Font License 1.1.

See [package release](docs/package-release.md) for the tarball check and npm workflow.

Build checks cover both delivery modes combined with each backend, JavaScript/CSS import order, selected-set-only assets/URLs, real WOFF2 files, weights, italics and asset-free network output. Browser acceptance checks actual loading, native text/controls, language boundaries, popup inheritance, overrides and failed-network fallback. Hosted tests may intercept CDN URLs using pinned package bytes; these do not establish live service availability or visual acceptance. A loaded font does not establish accessibility conformance.


Arabic interface messages are available through `ar`; the supplied font entries do not yet bundle or download a dedicated Arabic family. Arabic glyphs use system fallback. Applications can supply an Arabic-capable font through their typography configuration; verify actual shaping and loaded fonts in the target browser.
