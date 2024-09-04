import SlotsComponent from "./src"
import type {Setting} from "@ruomu-ui/types"
import {BrandingWatermarkOutlined} from "@vicons/material"

const Slots: Setting = {
  id: "slots",
  title: "插槽",
  icon: BrandingWatermarkOutlined,
  component: () => SlotsComponent,
}

export default Slots