import MaterialComponent from "./src"
import type {Plugin} from "@ruomu-ui/core"
import {Components} from "@vicons/tabler"
import { shallowRef } from 'vue'

const Material: Plugin = {
  id: "material",
  title: "物料",
  align: "top",
  icon: Components,
  component: shallowRef(MaterialComponent),
  pinned: true,
}

export default Material