import { useCanvasStore, useProjectStore } from '@ruomu-ui/core'

export const reSelectNode = () => {
  const canvasStore = useCanvasStore()
  const selectState = canvasStore.selectState
  const selectId = selectState.id
  setTimeout(() => {
    canvasStore.selectNodeById(selectId)
  }, 100)
}


export const changeStyle = (styleName: string, value: string | null, cb = reSelectNode) => {
  const projectStore = useProjectStore()
  const canvasStore = useCanvasStore()
  const selectState = canvasStore.selectState
  projectStore.addSchemaPropStyleValue(selectState.id, styleName, value)
  cb()
}