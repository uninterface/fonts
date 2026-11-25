# Release the Fonts package

Use Node.js 24 and npm from the repository root.

```sh
npm ci
npm test
```

The test packs the CSS, documentation and licenses, then installs the tarball in a fresh Vite project. It builds both CSS entries and checks CDN delivery and bundled WOFF2 assets.

For maintainers, push a Git tag with the full package version and a `v` prefix. The workflow sends stable versions to `latest` and SemVer prereleases to `pre-release`. Verify the resulting tags with `npm dist-tag ls @uninterface/fonts`.
