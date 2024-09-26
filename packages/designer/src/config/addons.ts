import type { Plugin, Toolbar, Setting } from '@ruomu-ui/types'
import Logo from '@ruomu-ui/toolbar-logo'
import Breadcrumb from '@ruomu-ui/toolbar-breadcrumb'
import Media from '@ruomu-ui/toolbar-media'
import Fullscreen from '@ruomu-ui/toolbar-fullscreen'
import Save from '@ruomu-ui/toolbar-save'
import Preview from '@ruomu-ui/toolbar-preview'

import Material from '@ruomu-ui/plugin-material'
import Tree from '@ruomu-ui/plugin-tree'
import Func from '@ruomu-ui/plugin-function'
import State from '@ruomu-ui/plugin-state'
import Store from '@ruomu-ui/plugin-store'
import Api from '@ruomu-ui/plugin-api'
import Page from '@ruomu-ui/plugin-page'
import Schema from '@ruomu-ui/plugin-schema'

import Props from '@ruomu-ui/setting-props'
import Styles from '@ruomu-ui/setting-styles'
import Events from '@ruomu-ui/setting-events'
import Slots from '@ruomu-ui/setting-slots'

const addons: {
  plugins: Plugin[],
  toolbars: Toolbar[],
  settings: Setting[],
} = {
  plugins: [
    Material,
    Tree,
    Func,
    State,
    Store,
    Api,
    Page,

    Schema,
  ],
  toolbars: [
    Logo,
    Breadcrumb,
    Media,

    Save,
    Preview,
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