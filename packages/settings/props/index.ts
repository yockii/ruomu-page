import PropsComponent from "./src"
import type {Setting} from "@ruomu-ui/types"
import {SettingsEthernetFilled} from "@vicons/material"

const Props: Setting = {
  id: "props",
  title: "属性",
  icon: SettingsEthernetFilled,
  component: () => PropsComponent,
}

export default Props