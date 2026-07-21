import { ProductsDisplay } from '@card-component-demo/products-ui';
import { useNavigate } from 'react-router-dom';
import { ProductSummary } from '@card-component-demo/shared-models';
import { useProducts } from './products.hooks';

export function Products() {
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useProducts();
  const handleProductClicked = (product: ProductSummary) => {
    navigate(`/products/${product.id}`);
  };

  return (
    <ProductsDisplay
      products={products}
      isLoading={isLoading}
      onProductClicked={handleProductClicked}
    />
  );
}

export default Products;
