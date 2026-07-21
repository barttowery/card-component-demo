import { ProductDetails } from '@card-component-demo/products-ui';
import styles from './product-detail.module.css';
import { useParams } from 'react-router-dom';
import { useProductDetail } from './product-detail.hooks';
import { ProductSummary } from '@card-component-demo/shared-models';

export function ProductDetail() {
  const { productId } = useParams();
  const { data: product, isLoading } = useProductDetail(productId ? parseInt(productId) : 0);

  return (
    <div className={styles['container']}>
      { !isLoading && !product ? <div>Product not found.</div>:
        <ProductDetails
          product={product as ProductSummary}
          isLoading={isLoading}
        />
      }
    </div>
  );
}

export default ProductDetail;
