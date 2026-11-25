import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import {
  copyFileSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const directory = mkdtempSync(join(tmpdir(), 'uninterface-fonts-'))
const npmEnvironment = { ...process.env }
// npm test exports this setting, but npm install rejects it for project installs.
delete npmEnvironment.npm_config_allow_scripts
const npm = (args, cwd) =>
  execFileSync(process.execPath, [process.env.npm_execpath, ...args], {
    cwd,
    env: npmEnvironment,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  })

try {
  const [pack] = JSON.parse(
    npm(
      [
        'pack',
        '--ignore-scripts',
        '--offline',
        '--json',
        '--pack-destination',
        directory,
      ],
      root,
    ),
  )
  const tarball = join(directory, pack.filename)
  assert.equal(pack.name, manifest.name)
  assert.equal(pack.version, manifest.version)
  assert.deepEqual(
    new Set(pack.files.map(({ path }) => path)),
    new Set([
      'LICENSE',
      'README.md',
      'package.json',
      'docs/package-release.md',
      'docs/font-licenses/noto-sans.txt',
      'docs/font-licenses/noto-sans-sc.txt',
      'docs/font-licenses/noto-sans-tc.txt',
      'src/font.css',
      'src/font-bundled.css',
      'src/font-family.css',
    ]),
  )

  writeFileSync(
    join(directory, 'package.json'),
    JSON.stringify({
      name: 'uninterface-fonts-consumer',
      private: true,
      type: 'module',
      dependencies: { [manifest.name]: `file:./${pack.filename}` },
      devDependencies: { vite: '7.3.7' },
    }),
  )
  npm(['install', '--ignore-scripts', '--no-audit', '--no-fund'], directory)
  writeFileSync(
    join(directory, 'index.html'),
    '<!doctype html><script type="module" src="/main.js"></script>\n',
  )

  for (const [entry, bundled] of [
    ['font.css', false],
    ['font-bundled.css', true],
  ]) {
    writeFileSync(
      join(directory, 'main.js'),
      `import '${manifest.name}/${entry}'\n`,
    )
    const output = join(directory, 'dist', entry, 'assets')
    execFileSync(
      process.execPath,
      [
        'node_modules/vite/bin/vite.js',
        'build',
        '--outDir',
        `dist/${entry}`,
        '--logLevel',
        'error',
      ],
      { cwd: directory, stdio: 'inherit' },
    )
    const files = readdirSync(output)
    const stylesheet = files.find((file) => file.endsWith('.css'))
    assert.ok(stylesheet, `${entry} emits a stylesheet`)
    const css = readFileSync(join(output, stylesheet), 'utf8')
    const fonts = files.filter((file) => file.endsWith('.woff2'))
    assert.match(css, /--uninterface-font-set-family/)
    assert.equal(css.includes('https://cdn.jsdelivr.net/'), !bundled)
    assert.equal(fonts.length > 0, bundled)
    if (bundled) {
      assert.equal(
        readFileSync(join(output, fonts[0])).subarray(0, 4).toString(),
        'wOF2',
      )
    }
    console.log(`${entry}: ${fonts.length} local WOFF2 files`)
  }

  if (process.env.UNINTERFACE_PACK_FILE) {
    copyFileSync(tarball, process.env.UNINTERFACE_PACK_FILE)
  }
  console.log(
    `${pack.name}@${pack.version}: verified ${pack.entryCount} packed files`,
  )
} finally {
  rmSync(directory, { recursive: true, force: true })
}
