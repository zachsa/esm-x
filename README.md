# esm-x

Enhance browser-JavaScript support to include JSX/Typescript syntax for websites utilizing importmaps.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Motivation](#motivation)
  - [How it works](#how-it-works)
- [Usage](#usage)
  - [Options](#options)
  - [Importmaps](#importmaps)
    - [External importmaps](#external-importmaps)
- [Local development](#local-development)
  - [Publish](#publish)
- [Install](#install)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Motivation

With all major browsers now supporting `importmaps`, bundle-free web development workflows have become both feasible and incredibly convenient. This project seeks to bring that convenience to React/Typescript projects.

## How it works

Leverages [importmaps](https://github.com/WICG/import-maps) in conjunction with [the ES Module Shim library](https://github.com/guybedford/es-module-shims). With `shimMode` forced to `true`, all Source Code from the website origin is transpiled using [Babel](https://babeljs.io/), while prior-optimized imports originating from a module CDN (such as the excellent JSPM CDN) are loaded directly.

# Usage

Include the `esm-x` library (328kB gzipped) as the first script in your HTML file, and include at least one `<script type="esm-x">...</script>`. Scripts of `type="esm-x"` will be transpiled and executed in the order they are included in the HTML page.

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
      src="https://www.unpkg.com/@zachsa/esm-x@1.0.34/dist/index.js"
    ></script>

    <!--
      Import map generated with JSPM Generator
      Edit here: https://generator.jspm.io/#U2VhYGBiDs0rySzJSU1hKEpNTC7RTcnPdTC01DPQM9BPzslMzSuBiEPFAEEYRSszAA
    -->
    <script type="importmap">
    {
      "imports": {
        "react": "https://ga.jspm.io/npm:react@19.0.0/dev.index.js",
        "react-dom/client": "https://ga.jspm.io/npm:react-dom@19.0.0/dev.client.js"
      },
      "scopes": {
        "https://ga.jspm.io/": {
          "process": "https://ga.jspm.io/npm:@jspm/core@2.1.0/nodelibs/browser/process.js",
          "react-dom": "https://ga.jspm.io/npm:react-dom@19.0.0/dev.index.js",
          "scheduler": "https://ga.jspm.io/npm:scheduler@0.25.0/dev.index.js"
        }
      }
    }
    </script>

    <!-- ES Module Shims -->
    <script
      async
      src="https://ga.jspm.io/npm:es-module-shims@2.0.10/dist/es-module-shims.js"
      crossorigin="anonymous"
    ></script>

    <!-- ESM-X script -->
    <script type="esm-x">
      import React, { FC } from 'react';
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
