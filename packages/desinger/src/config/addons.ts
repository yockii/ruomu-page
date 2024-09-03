import type { Plugin, Toolbar, Setting } from "@ruomu-ui/core";
import Logo from "@ruomu-ui/toolbar-logo";
import Breadcrumb from "@ruomu-ui/toolbar-breadcrumb";
import Media from "@ruomu-ui/toolbar-media";
import Fullscreen from "@ruomu-ui/toolbar-fullscreen";

import Material from "@ruomu-ui/plugin-material"
import Tree from "@ruomu-ui/plugin-tree"
import Func from '@ruomu-ui/plugin-function'

import Props from "@ruomu-ui/setting-props"
import Styles from "@ruomu-ui/setting-styles"
import Events from "@ruomu-ui/setting-events"
import Slots from "@ruomu-ui/setting-slots"

const addons: {
    plugins:Plugin[],
    toolbars: Toolbar[],
    settings: Setting[],
} = {
    plugins: [
      Material,
      Tree,
      
      Func,
    ],
    toolbars: [
        Logo,
        Breadcrumb,
        Media,
        

        Fullscreen,
    ],
    settings: [
      Props,
      Styles,
      Events,
      Slots,
    ],
}

export default addons