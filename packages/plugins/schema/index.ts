import CompSchemaComponent from "./src"
import type {Plugin} from "@ruomu-ui/types"
import {SchemaOutlined} from "@vicons/material"

const Schema: Plugin = {
  id: "schema",
  title: "页面结构",
  align: "bottom",
  icon: () => SchemaOutlined,
  component: () => CompSchemaComponent,
}

export default Schema