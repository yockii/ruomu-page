import type { Plugin, Toolbar, Setting } from "@ruomu-ui/core";
import Logo from "@ruomu-ui/toolbar-logo";
import Breadcrumb from "@ruomu-ui/toolbar-breadcrumb";
import Media from "@ruomu-ui/toolbar-media";
import Fullscreen from "@ruomu-ui/toolbar-fullscreen";

import Material from "@ruomu-ui/plugin-material"
import Tree from "@ruomu-ui/plugin-tree"

import Props from "@ruomu-ui/setting-props"
import Styles from "@ruomu-ui/setting-styles"
import Events from "@ruomu-ui/setting-events"

const addons: {
    plugins:Plugin[],
    toolbars: Toolbar[],
    settings: Setting[],
} = {
    plugins: [
      Material,
      Tree
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
    ],
}

export default addons