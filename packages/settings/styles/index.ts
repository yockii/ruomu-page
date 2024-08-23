import StylesComponent from "./src"
import type {Setting} from "@ruomu-ui/core"
import {CssFilled} from "@vicons/material"

const Styles: Setting = {
  id: "styles",
  title: "样式",
  icon: CssFilled,
  component: StylesComponent,
}

export default Styles