import ApiPanel from "./src"
import type {Plugin} from "@ruomu-ui/types"
import { Api } from "@vicons/tabler"

const ApiPlugin: Plugin = {
  id: "api",
  title: "接口管理",
  align: "middle",
  icon: () => Api,
  component: () => ApiPanel,
}

export default ApiPlugin