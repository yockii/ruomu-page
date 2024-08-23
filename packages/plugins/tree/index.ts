import CompTreeComponent from "./src"
import type {Plugin} from "@ruomu-ui/core"
import {TreeView} from "@vicons/carbon"
import { shallowRef } from 'vue'

const Tree: Plugin = {
  id: "compTree",
  title: "组件树",
  align: "top",
  icon: TreeView,
  component: shallowRef(CompTreeComponent),
}

export default Tree