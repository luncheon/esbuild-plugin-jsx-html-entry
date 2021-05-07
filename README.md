# esbuild-plugin-jsx-html-entry

An experimental [esbuild](https://esbuild.github.io/) plugin that generates HTML entry points from JSX.

## Installation

```sh
$ npm i -D esbuild luncheon/esbuild-plugin-jsx-html-entry
```

## Usage Example

- build.js

```js
require('esbuild').build({
  entryPoints: ['src/app.ts'],
  outdir: 'dist',
  bundle: true,
  write: false, // to use `outputFiles`
  plugins: [
    require('@luncheon/esbuild-plugin-jsx-html-entry')({ entryPoints: ['src/index.html.tsx'] }),
    require('@luncheon/esbuild-plugin-gzip')(), // to write `outputFiles` with { write: false }
  ],
})
```

- src/index.html.tsx

```tsx
import type { BuildResult } from 'esbuild'
import path from 'path'

// the props passed is the build result
export default ({ outputFiles }: BuildResult) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        {
          outputFiles
            .filter(file => file.path.endsWith('.css'))
            .map(file => <link rel="stylesheet" href={path.basename(file.path)} />)
        }
      </head>
      <body>
        {
          outputFiles
            .filter(file => file.path.endsWith('.js'))
            .map(file => <script src={path.basename(file.path)} />)
        }
      </body>
    </html>
  )
}
```

- dist/index.html

```html
<html lang="en"><head><meta charset="utf-8" /><link rel="stylesheet" href="app-XKRCYGS4.css" /></head><body><script src="app-EMVAJHC6.js"></script></body></html>
```

### Inlining

- src/index.html.tsx

```tsx
import type { BuildResult } from 'esbuild'

export default ({ outputFiles }: BuildResult) => {
  const css = outputFiles
    .filter(file => file.path.endsWith('.css'))
    .map(file => file.text)
    .join('\n')
    .trim()
  const js = outputFiles
    .filter(file => file.path.endsWith('.js'))
    .map(file => file.text)
    .join(';')
    .trim()
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <style dangerouslySetInnerHTML={{__html: css}} />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{__html: js}} />
      </body>
    </html>
  )
}
```

## License

[WTFPL](http://www.wtfpl.net/)
