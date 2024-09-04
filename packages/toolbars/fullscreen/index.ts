import FullscreenComponent from "./src"
import type {Toolbar} from "@ruomu-ui/types"

const Fullscreen: Toolbar = {
  id: "fullscreen",
  align: "right",
  component: () => FullscreenComponent,
}

export default Fullscreen