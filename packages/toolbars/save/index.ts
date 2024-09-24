import SaveComponent from "./src"
import type {Toolbar} from "@ruomu-ui/types"

const Save: Toolbar = {
  id: "save",
  align: "right",
  component: () => SaveComponent,
}

export default Save