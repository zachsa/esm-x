/*!
 * App 0.0.2
 */
async function compileJsx(source) {
  const [transform, presetReact] = await Promise.all([
    await import('./index-93b1d92e.js').then(function(n){return n.i}).then(lib => lib.transform),
    await import('./index-0d1aeffb.js').then(function(n){return n.i}).then(lib => lib.default),
  ]);

  const transformed = transform(source, {
    presets: [presetReact],
  });

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