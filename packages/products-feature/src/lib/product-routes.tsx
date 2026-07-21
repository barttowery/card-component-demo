import { RouteObject } from 'react-router-dom';
import { Products } from './products/products';
import { ProductDetail } from './product-detail/product-detail';

export const productRouter: RouteObject[] = [
  {
    path: 'products',
    element: <Products />,
  },
  {
    path: 'products/:productId',
    element: <ProductDetail />,
  }
];
