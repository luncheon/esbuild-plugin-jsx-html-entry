const esbuild = require('esbuild')
const { h } = require('preact')
const fs = require('fs/promises')
const render = require('preact-render-to-string')

const plugin = ({ entryPoints }) => ({
  name: 'esbuild-plugin-jsx-static-html',
  setup: build => {
    build.onEnd(async result => {
      const { outputFiles } = await esbuild.build({
        entryPoints,
        outdir: build.initialOptions.outdir,
        platform: 'node',
        format: 'cjs',
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        external: ['preact', 'preact-render-to-string'],
        inject: [require.resolve('./preact-shim.js')],
        bundle: true,
        metafile: true,
        write: false,
      })
      for (const outputFile of outputFiles) {
        if (outputFile.path.endsWith('.js')) {
          const m = new module.constructor()
          m.paths = module.paths
          m._compile(outputFile.text, outputFile.path)
          const htmlText = render(h(m.exports.default, result))
          const htmlPath = outputFile.path.replace(/\.js$/, '')
          let htmlContents
          build.initialOptions.write !== false && await fs.writeFile(htmlPath, htmlText, 'utf8')
          result.outputFiles?.push({
            path: htmlPath,
            text: htmlText,
            get contents() {
              return htmlContents = htmlContents ?? Buffer.from(htmlText)
            },
          })
        }
      }
    })
  }
})

module.exports = plugin.default = plugin
