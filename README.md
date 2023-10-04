# esm-x
Online JSX/Typescript transpilation for quick development workflows. 

Browser-native module loading of non-standard JavaScript (Typescript and JSX) via importmaps 

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Example](#example)
- [Usage](#usage)
- [How it works](#how-it-works)
- [Local development](#local-development)
  - [Publish](#publish)
- [Install](#install)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Example
Here is an example of a simple React application with the `react` and `react-dom` library imports defined via an importmap. Copy this file into `index.html`, and serve via a web server (i.e. `npx http-server -c-1`). There is an example of an `@mui/material` app in [the test directory of this repository](/test/).

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>ESM-X Example</title>

    <!-- Include ESM-X here -->
    <script src="https://www.unpkg.com/@zachsa/esm-x@0.0.7/dist/index.js"></script>

    <!-- Map Edit URL: https://generator.jspm.io/#U2VhYGBiDs0rySzJSU1hKEpNTC7RTcnPdTC00DPSM9BPzslMzSuBiEPFAHimvF0zAA -->
    <script type="importmap">
      {
        "imports": {
          "react": "https://ga.jspm.io/npm:react@18.2.0/dev.index.js",
          "react-dom/client": "https://ga.jspm.io/npm:react-dom@18.2.0/dev.client.js"
        },
        "scopes": {
          "https://ga.jspm.io/": {
            "react-dom": "https://ga.jspm.io/npm:react-dom@18.2.0/dev.index.js",
            "scheduler": "https://ga.jspm.io/npm:scheduler@0.23.0/dev.index.js"
          }
        }
      }
    </script>

    <!-- ES Module Shims: Import maps polyfill for older browsers without import maps support (eg Safari 16.3) -->
    <script
      async
      src="https://ga.jspm.io/npm:es-module-shims@1.8.0/dist/es-module-shims.js"
      crossorigin="anonymous"
    ></script>

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

# Usage
Head to the [JSPM generator](https://generator.jspm.io/) to quickly generate an importmap that includes React. ESM-X supports code splitting via `Suspense/lazy`.

# How it works
Leverages [importmaps](https://github.com/WICG/import-maps) in conjunction with [the ES Module Shim library](https://github.com/guybedford/es-module-shims). With `shimMode` forced to `true`, all Source Code from the website origin is transpiled using [Babel](https://babeljs.io/), while imports originating from the excellent JSPM module CDN (that are already optimized for ESM-supporting browsers) are loaded with `shimMode` forced to `false`. For now, browsers that don't support ESM are not supported - but that could change in the future.

# Local development
Start a local web server and navigate to [localhost:3000/test](http://localhost:3000/test):

```sh
npx @mnemosyne/server -v ./
chomp --watch
```

## Publish
```sh
npm publish --access public
```

# Install
