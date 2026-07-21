import { ProductSummary } from '@card-component-demo/shared-models';
import ProductCard from '../product-card/product-card';
import styles from './product-card-list.module.css';

export interface ProductCardProps {
  products: ProductSummary[];
  onProductClicked: (product: ProductSummary) => void;
}

export function ProductCardList({ products, onProductClicked }: ProductCardProps) {
  if (!products || products.length === 0) {
    return <div className={styles['no-products']}>No products available</div>;
  }

  return (
    <ul className={styles['products-list']}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onProductClicked={onProductClicked} />
      ))}
    </ul>
  );
}

export default ProductCardList;
