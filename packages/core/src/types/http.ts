export type Response<T> = {
  code: number;
  msg?: string;
  data?: T;
}

export type Paginate<T> = {
  offset: number;
  limit: number;
  total: number;
  items?: T[];
}