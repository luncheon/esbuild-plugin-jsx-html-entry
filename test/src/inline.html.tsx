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
