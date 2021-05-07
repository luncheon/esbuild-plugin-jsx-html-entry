import type { Plugin, BuildOptions } from 'esbuild'
interface EsbuildPluginJsxHtmlOptions {
  readonly entryPoints: BuildOptions['entryPoints']
}
interface EsbuildPluginJsxHtml {
  (option: EsbuildPluginJsxHtmlOptions): Plugin
  default: EsbuildPluginJsxHtml
}
declare const plugin: EsbuildPluginJsxHtml
export = plugin
