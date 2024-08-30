import {Component} from "vue";

export type Toolbar = {
  id: string;
  title?: string;
  align: 'left' | 'center' | 'right';
  icon?: Component | (() => Component);
  component: Component | (() => Component);
}

export type Plugin = {
  id: string;
  title?: string;
  align: 'top' | 'bottom';
  panelPinned?: boolean;
  icon?: Component | (() => Component);
  component: Component | (() => Component);
  api?: any;
  pinned?: boolean;
}

export type Setting = {
  id: string;
  title: string;
  icon?: Component | (() => Component);
  component: Component | (() => Component);
}