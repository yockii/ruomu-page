import Func, { usePluginFunctionStore } from "./src"
import type {Plugin} from "@ruomu-ui/types"
import { MathFunction } from "@vicons/tabler"

const FuncPlugin: Plugin = {
  id: "func",
  title: "页面函数",
  align: "top",
  icon: () => MathFunction,
  component: () => Func,
}

export { usePluginFunctionStore }

export default FuncPlugin