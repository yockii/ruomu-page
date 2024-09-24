import CompPageComponent from "./src"
import type {Plugin} from "@ruomu-ui/types"
import {PageScroll} from "@vicons/carbon"

const Page: Plugin = {
  id: "page",
  title: "页面管理",
  align: "top",
  icon: () => PageScroll,
  component: () => CompPageComponent,
}

export default Page