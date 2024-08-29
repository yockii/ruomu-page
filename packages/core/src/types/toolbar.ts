import {Component} from "vue";

export type Toolbar = {
  id: string;
  title?: string;
  align: 'left' | 'center' | 'right';
  icon?: Component;
  component: Component;
}

export type Plugin = {
  id: string;
  title?: string;
  align: 'top' | 'bottom';
  panelPinned?: boolean;
  icon?: Component;
  component: Component;
  api?: any;
  pinned?: boolean;
}

export type Setting = {
  id: string;
  title: string;
  icon?: Component;
  component: Component;
}