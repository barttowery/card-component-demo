import styles from './products-display.module.css';
import { ProductSummary } from '@card-component-demo/shared-models';
import { ProductCardList } from '@card-component-demo/shared-ui';

export interface ProductsDisplayProps {
  products: ProductSummary[];
  isLoading: boolean;
  onProductClicked: (product: ProductSummary) => void;
}

export function ProductsDisplay({ products, isLoading, onProductClicked }: ProductsDisplayProps) {
  return (
    <div className={styles['container']}>
      <h1>Our Products</h1>
      {isLoading ? <div>Loading products...</div> :
        <ProductCardList products={products} onProductClicked={onProductClicked} />
      }
    </div>
  );
}

export default ProductsDisplay;
