import CompTreeComponent from "./src"
import type {Plugin} from "@ruomu-ui/types"
import {TreeView} from "@vicons/carbon"

const Tree: Plugin = {
  id: "compTree",
  title: "组件树",
  align: "top",
  icon: () => TreeView,
  component: () => CompTreeComponent,
}

export default Tree