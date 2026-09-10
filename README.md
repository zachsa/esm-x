# esm-x

Enhance browser-JavaScript support to include JSX/Typescript syntax for websites utilizing importmaps.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Motivation](#motivation)
  - [How it works](#how-it-works)
- [Usage](#usage)
  - [Options](#options)
    - [Compiler choice](#compiler-choice)
  - [Importmaps](#importmaps)
    - [External importmaps](#external-importmaps)
- [Local development](#local-development)
  - [Publish](#publish)
- [Install](#install)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Motivation

With all major browsers now supporting `importmaps`, bundle-free web development workflows have become both feasible and incredibly convenient. This project seeks to bring that convenience to React/Typescript projects.

## How it works

Leverages [importmaps](https://github.com/WICG/import-maps) in conjunction with [the ES Module Shim library](https://github.com/guybedford/es-module-shims). With `shimMode` forced to `true`, source code from the website origin is transpiled using the selected compiler, while prior-optimized imports originating from a module CDN (such as the excellent JSPM CDN) are loaded directly.

# Usage

Include the small `esm-x` runtime as the first script in your HTML file, and include at least one `<script type="esm-x">...</script>`. The selected compiler is loaded separately when it is first needed. Scripts of `type="esm-x"` will be transpiled and executed in the order they are included in the HTML page.

Here is an example of a simple React application with the `react` and `react-dom` library imports defined via an importmap. Copy this file into `index.html`, and serve via a web server (i.e. `npx http-server -c-1`). There is an example of an `@mui/material` app in [the dev directory of this repository](/dev/).

`esm-x` works without an importmap, but ES Module Shims is required.

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>ESM-X Example</title>

    <!-- Include ESM-X here -->
    <script
      id="esm-x"
      compiler="babel"
      loading="circular"
      src="https://www.unpkg.com/@zachsa/esm-x@1.1.4/dist/index.js"
    ></script>

    <!--
      Import map generated with JSPM Generator
      Edit here: https://generator.jspm.io/#Y2NhYGBiDs0rySzJSU1hKEpNTC7RTcnPdTC01DPSM9BPzslMzSuBiEPFAMQOjWszAA
    -->
    <script type="importmap">
      {
        "imports": {
          "react": "https://ga.jspm.io/npm:react@19.2.0/index.js",
          "react-dom/client": "https://ga.jspm.io/npm:react-dom@19.2.0/client.js"
        },
        "scopes": {
          "https://ga.jspm.io/": {
            "react-dom": "https://ga.jspm.io/npm:react-dom@19.2.0/index.js",
            "scheduler": "https://ga.jspm.io/npm:scheduler@0.27.0/index.js"
          }
        }
      }
    </script>

    <!-- ES Module Shims -->
    <script
      async
      src="https://ga.jspm.io/npm:es-module-shims@2.8.2/dist/es-module-shims.js"
      crossorigin="anonymous"
    ></script>

    <!-- ESM-X script -->
    <script type="esm-x">
      import React from 'react';
      import type { FC } from 'react';
      import { createRoot } from 'react-dom/client';
      const root = createRoot(document.getElementById('root') as HTMLElement);

      const App: FC = () => <div>Hello from ESM-X</div>;
      root.render(<App />);
    </script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

## Options

Configure the ESM-X script by including HTML tag id and other attributes:

```html
<script id="esm-x" loading="circular|linear|disabled" compiler="babel|esbuild" src="..."></script>
```

### Compiler choice

`babel` is the default and is strongly recommended when initial download size matters. `esbuild` can transform larger amounts of source code faster once initialized, but its browser build is much larger:

| Asset                            | Uncompressed | Gzipped |
| -------------------------------- | -----------: | ------: |
| ESM-X runtime                    |        14 KB |    5 KB |
| Babel compiler                   |      1.26 MB |  309 KB |
| esbuild JavaScript + WebAssembly |     14.03 MB | 3.74 MB |

These are approximate production-build sizes, measured without source maps using gzip level 9. Actual transfer sizes depend on the server's compression settings and browser cache.

The size difference comes from how the compilers are delivered. The Babel option is a tree-shaken JavaScript bundle containing the transform core and the React and TypeScript presets used by ESM-X. Browser esbuild uses [`esbuild-wasm`](https://esbuild.github.io/getting-started/#wasm), which ships the esbuild compiler and its Go runtime as a WebAssembly binary. That WASM file is about 13.9 MB before compression; it provides esbuild's speed after startup, but has a substantially higher cold-download and initialization cost.

For public pages and small applications, prefer `compiler="babel"`. Consider `compiler="esbuild"` for development environments or larger applications where the WASM asset will be cached and transform speed matters more than the first load.

## Importmaps

Head to the [JSPM generator](https://generator.jspm.io/) to quickly generate an importmap. Any importmap configuration should be supported - huge importmaps are fine, make sure to take advantage of dynamic imports / code splitting (for example, `Suspense/lazy` when using React), etc. (and obviously don't preload scripts)

### External importmaps

To use an external importmap, make sure that your importmap tag is of type "importmap-shim", and that the src url `endsWith('importmap') || endsWith('importmap.json')`. For example:

```html
<script type="importmap-shim" src="path/to/file/called/importmap.json"></script>
```

It's easy to work with external importmaps using the [`jspm CLI`](https://jspm.org/docs/jspm-cli/stable/).

# Local development

Start a local web server and navigate to [localhost:3000/dev](http://localhost:3000/dev):

```sh
npx http-server --port 3000 -c-1
chomp --watch
```

Test the following cases:

- [index.html (default)](/dev/index.html)
- [no-importmap.html](/dev/no-importmap.html)
- [tsx.html](/dev/tsx.html)
- [empty-importmap.html](/dev/empty-importmap.html)
- [docs.html (copy this to README.md)](/dev/docs.html)

## Publish

```sh
npm publish --access public
```

# Install
