import { Product } from "@prisma/client";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

enum ApiRoutes {
  SEARCH_PRODUCTS = "/search",
}

export const Api = {
  search: async (query: string): Promise<Product[]> => {
    return (
      await axiosInstance.get<Product[]>(ApiRoutes.SEARCH_PRODUCTS, {
        params: { query },
      })
    ).data;
  },
};
