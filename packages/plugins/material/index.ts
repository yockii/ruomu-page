import { Material as MaterialComponent, usePluginMaterialStore } from "./src"
import type {Plugin} from "@ruomu-ui/core"
import {Components} from "@vicons/tabler"

const Material: Plugin = {
  id: "material",
  title: "物料",
  align: "top",
  icon: () => Components,
  component: () => MaterialComponent,
  pinned: true,
}

export {
  usePluginMaterialStore,
}

export default Material