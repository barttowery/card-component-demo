import { ProductSummary } from '@card-component-demo/shared-models';
import { useQuery } from '@tanstack/react-query';
import axios, { HttpStatusCode } from 'axios';

const API_URL = 'http://localhost:3333/api';

export const PRODUCTS_API_URL = '/products';
export const PRODUCTS_QUERY_KEYS = {
  get: () => ['products'],
};

const getProductsQueryFn: () => Promise<ProductSummary[]> = async () => {
  const { data, status } = await axios.get(API_URL + PRODUCTS_API_URL);
  
  if (status !== HttpStatusCode.Ok) {
    // Replace with proper error logging
    console.error(`Error retrieving products ${status}.`);
    return [];
  }
  return data;
};

export const useProducts = () => {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.get(),
    queryFn: getProductsQueryFn,
  });
};
