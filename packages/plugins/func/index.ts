import { Func as FunctionComponent, usePluginFunctionStore } from "./src"
import type {Plugin} from "@ruomu-ui/core"
import { MathFunction } from "@vicons/tabler"

const Func: Plugin = {
  id: "func",
  title: "函数",
  align: "top",
  icon: () => MathFunction,
  component: () => FunctionComponent,
}

export { usePluginFunctionStore }

export default Func