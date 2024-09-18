export type Variable = {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any';
  defaultValue?: any;
  props?: Variable[];
}

export type RelatedProperty = {
  name: string;
  varName: string;
  syncUpdate: boolean;
  storage?: 'sessionStorage' | 'localStorage'
}