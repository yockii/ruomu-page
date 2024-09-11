import axios, { AxiosInstance } from "axios";
import type { Response } from "@ruomu-ui/types";

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || "http://192.168.1.100:4523/m1/5018611-4678324-default/api/v1",
  timeout: 5000,
  //   withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

async function Get<T>(url: string, params?: Record<string, any>): Promise<Response<T>> {
  const { data } = await instance.get(url, { params });
  return data;
}

async function Post<T>(url: string, data?: Record<string, any>): Promise<Response<T>> {
  const res = await instance.post(url, data);
  return res.data;
}

async function Put<T>(url: string, data?: Record<string, any>): Promise<Response<T>> {
  const res = await instance.post(url, data);
  return res.data;
}

async function Delete<T>(url: string, params?: Record<string, any>): Promise<Response<T>> {
  const res = await instance.delete(url, { params });
  return res.data;
}

export { 
  instance as http,
  Get ,
  Post ,
  Put ,
  Delete
};