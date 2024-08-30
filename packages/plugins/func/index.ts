import { Func as FunctionComponent, usePluginFunctionStore } from "./src"
import type {Plugin} from "@ruomu-ui/core"
import { MathFunction } from "@vicons/tabler"
import { shallowRef } from 'vue'

const Material: Plugin = {
  id: "func",
  title: "函数",
  align: "top",
  icon: MathFunction,
  component: shallowRef(FunctionComponent),
}

export { usePluginFunctionStore }

export default Material