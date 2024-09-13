export type Variable = {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any';
  defaultValue?: any;
  props?: Variable[];
}