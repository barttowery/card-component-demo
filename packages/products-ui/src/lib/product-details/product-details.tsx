import styles from './product-details.module.css';
import { ProductSummary } from '@card-component-demo/shared-models';

export interface ProductDetailsProps {
  product: ProductSummary;
  isLoading: boolean;
}

export function ProductDetails({ product, isLoading }: ProductDetailsProps) {
  if (isLoading) {
    return <div className={styles['container']}>Loading...</div>;
  }

  return (
    <div className={styles['container']}>
      <h1>Product Details</h1>
      <div className={styles['product-details']}>
        <img src={product.image} alt={product.imageAlt} />
        <div className={styles['details']}>
          <h2>{product.title}</h2>
          <div>{product.description}</div>
          <div>Price: ${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
