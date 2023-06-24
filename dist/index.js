/*!
 * App 0.0.1
 */
async function compileJsx(source) {
  const transform = await import('./index-10572ad0.js').then(function (n) { return n.i; }).then(lib => lib.transform);
  const presetReact = await import('./index-acfd1990.js').then(function (n) { return n.i; }).then(lib => lib.default);
  const transformed = transform(source, {
    presets: [presetReact],
  });
  console.log(transformed);
  return transformed.code
}

globalThis.esmsInitOptions = globalThis.esmsInitOptions || {};
globalThis.esmsInitOptions.shimMode = true;

const fetch = globalThis.esmsInitOptions.fetch || globalThis.fetch;

globalThis.esmsInitOptions.fetch = async function (url, options) {
  const res = await fetch(url, options);
  if (!res.ok) return res
  const source = await res.text();
  const transformed = await compileJsx(source);

  return new Response(new Blob([transformed], { type: 'application/javascript' }))
};
