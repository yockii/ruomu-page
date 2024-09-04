import "pinia"

declare module 'pinia' {
  export interface DefineStoreOptionsBase {
    persistShare?: boolean;
  }
}