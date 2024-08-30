import {Component} from "vue";

export const resolveComponent = (c: Component|(()=>Component)): Component => {
  if (typeof c === 'function') {
    return (c as ()=>Component)();
  }
  return c;
}