# Release the Fonts package

Run `npm test` with Node.js 24 and npm. It packs the CSS, documentation and licenses, then installs the tarball in a fresh Vite project. The package check builds both CSS entries and verifies the difference between CDN delivery and bundled WOFF2 assets.

For the first release, run **Publish Fonts to npm** in GitHub Actions with **stage** unchecked. Download and extract `uninterface-fonts-npm-package`. From that directory, verify and stage the exact tarball using an npm maintainer account and a CLI that supports staged publishing.

```sh
sha512sum --check SHA512SUMS &&
  npm stage publish ./fonts.tgz --access public --tag latest
npm stage list @uninterface/fonts
npm stage approve <stage-id>
```

Use `--tag pre-release` for a version with a SemVer prerelease suffix.

After the first version is available, configure npm Trusted Publishing for the GitHub repository `uninterface/fonts`, workflow `publish.yml`, and environment `npm`. Enable `npm publish` for tag releases and `npm stage publish` for manual staging.

For a tag release, commit the version in `package.json` and push a matching Git tag. Pushing `v0.0.2` publishes version `0.0.2` under `latest`. Pushing `v0.0.2-rc.1` publishes version `0.0.2-rc.1` under `pre-release`. Verify the result with `npm dist-tag ls @uninterface/fonts`.
