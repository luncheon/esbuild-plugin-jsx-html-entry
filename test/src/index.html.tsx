import type { BuildResult } from 'esbuild'
import path from 'path'

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
