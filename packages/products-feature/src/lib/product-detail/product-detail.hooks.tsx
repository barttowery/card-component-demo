import { ProductSummary } from '@card-component-demo/shared-models';
import { useQuery } from '@tanstack/react-query';
import axios, { HttpStatusCode } from 'axios';

const API_URL = 'http://localhost:3333/api';

export const PRODUCTS_DETAIL_API_URL = '/products/';
export const PRODUCT_DETAIL_QUERY_KEYS = {
  get: (productId: number) => ['product-detail', productId],
};

const getProductDetailQueryFn: (productId: number) => Promise<ProductSummary> = async (productId) => {
  const { data, status } = await axios.get(`${API_URL}${PRODUCTS_DETAIL_API_URL}${productId}`);
  
  if (status === HttpStatusCode.NotFound) {
    // Replace with proper error logging
    console.error(`Error retrieving product id: ${productId} with status: ${status}.`);
  }
  return data;
};

export const useProductDetail = (productId: number) => {
  return useQuery({
    queryKey: PRODUCT_DETAIL_QUERY_KEYS.get(productId),
    queryFn: () => getProductDetailQueryFn(productId),
  });
};
