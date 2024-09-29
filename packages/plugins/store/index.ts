import CompStoreComponent from "./src"
import type {Plugin} from "@ruomu-ui/types"
import {ObjectStorage} from "@vicons/carbon"

const Store: Plugin = {
  id: "store",
  title: "项目变量",
  align: "middle",
  icon: () => ObjectStorage,
  component: () => CompStoreComponent,
}

export default Store