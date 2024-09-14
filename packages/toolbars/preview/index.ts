import PreviewComponent from "./src"
import type {Toolbar} from "@ruomu-ui/types"

const Preview: Toolbar = {
  id: "media",
  align: "right",
  component: () => PreviewComponent,
}

export default Preview