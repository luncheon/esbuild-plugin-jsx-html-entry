const assert = require('assert')
const fs = require('fs')
const path = require('path')

fs.rmSync(path.resolve(__dirname, 'dist'), { recursive: true, force: true })

require('esbuild')
  .build({
    entryPoints: ['src/app.ts'],
    outdir: 'dist',
    bundle: true,
    minify: true,
    write: false,
    entryNames: '[dir]/[name]-[hash]',
    plugins: [
      require('..')({ entryPoints: ['src/index.html.tsx'] }),
      require('@luncheon/esbuild-plugin-gzip')(),
    ]
  })
  .then(result => {
    assert.strictEqual(
      result.outputFiles[2].text,
      `<html lang="en"><head><meta charset="utf-8" /><link rel="stylesheet" href="${path.basename(result.outputFiles[1].path)}" /></head><body><script src="${path.basename(result.outputFiles[0].path)}"></script></body></html>`,
    )
    console.log(result.outputFiles[2].text)
  })

require('esbuild')
  .build({
    entryPoints: ['src/app.ts'],
    outdir: 'dist',
    bundle: true,
    minify: true,
    write: false,
    plugins: [
      require('..')({ entryPoints: ['src/inline.html.tsx'] }),
      require('@luncheon/esbuild-plugin-gzip')(),
    ]
  })
  .then(result => {
    assert.strictEqual(
      result.outputFiles[2].text,
      '<html lang="en"><head><meta charset="utf-8" /><style>*{box-sizing:border-box}</style></head><body><script>(()=>{console.log("app");})();</script></body></html>',
    )
    console.log(result.outputFiles[2].text)
  })
