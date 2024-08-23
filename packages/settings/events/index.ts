import EventsComponent from "./src"
import type {Setting} from "@ruomu-ui/core"
import {EventNoteFilled} from "@vicons/material"
import { shallowRef } from 'vue'

const Events: Setting = {
  id: "events",
  title: "事件",
  icon: EventNoteFilled,
  component: EventsComponent,
}

export default Events