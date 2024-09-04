import LogoComponent from "./src"
import type {Toolbar} from "@ruomu-ui/types"

const Logo: Toolbar = {
  id: "logo",
  align: "left",
  component: () => LogoComponent,
}

export default Logo