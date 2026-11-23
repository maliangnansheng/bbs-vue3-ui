/**
 * Markdown 标题锚点 id
 * 预览组件（MdPreview/MdEditor）与目录组件（MdCatalog）必须使用同一实现，
 * 否则目录点击无法定位到对应标题
 */
export function markdownHeadingId({ index }) {
  return `heading-${index}`
}

/** markdown 预览统一配置 */
export const markdownPreviewOptions = {
  previewTheme: 'github',
  codeTheme: 'github'
}
