import BreadcrumbComponent from "./src"
import type {Toolbar} from "@ruomu-ui/types"

const Breadcrumb: Toolbar = {
  id: "breadcrumb",
  align: "left",
  component: () => BreadcrumbComponent,
}

export default Breadcrumb