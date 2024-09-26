import CodeComponent from "./src"
import type {Plugin} from "@ruomu-ui/types"
import {CodeDownloadOutline} from "@vicons/ionicons5"

const Code: Plugin = {
  id: "code",
  title: "页面出码",
  align: "bottom",
  icon: () => CodeDownloadOutline,
  component: () => CodeComponent,
}

export default Code