import CompStateComponent from "./src"
import type {Plugin} from "@ruomu-ui/types"
import {DataObjectFilled} from "@vicons/material"

const State: Plugin = {
  id: "state",
  title: "页面变量",
  align: "top",
  icon: () => DataObjectFilled,
  component: () => CompStateComponent,
}

export default State