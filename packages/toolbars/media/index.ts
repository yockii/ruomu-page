import MediaComponent from "./src"
import type {Toolbar} from "@ruomu-ui/types"

const Media: Toolbar = {
  id: "media",
  align: "center",
  component: () => MediaComponent,
}

export default Media