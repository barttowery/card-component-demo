import { useRef, useState, useEffect } from 'react';
import styles from './product-card.module.css';
import rawCssString from './product-card.module.css?inline';
import { ProductSummary } from '@card-component-demo/shared-models';
import { formatCurrency } from '@card-component-demo/shared-utils';

export interface ProductCardProps {
  product: ProductSummary;
  onProductClicked: (product: ProductSummary) => void;
}

export const ProductCardStyles = rawCssString;

export function ProductCard({ product, onProductClicked }: ProductCardProps) {
  const labelRef = useRef<HTMLLabelElement>(null);
  const [ hasScrollbar, setHasScrollbar ] = useState(false);

  useEffect(() => {
    const element = labelRef.current;
    if (!element) return;

    //Check if vertical content overflows the visible height
    const checkScroll = element.scrollHeight > element.clientHeight;
    setHasScrollbar(checkScroll);
  }, [])

  return (
    <article
      className={styles['card']}
      onClick={() => onProductClicked(product)} tabIndex={0}
      aria-label={`View details for ${product.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onProductClicked(product);
        }
      }}
    >
      <div className={styles['card-content']}>
        <h2>{product.title}</h2>
        <label
          ref={labelRef}
          className={styles['card-description']}
          {...(hasScrollbar ? { tabIndex:0 } : {})}
        >
          {product.description}
        </label>
        <label className={styles['card-price']}>{formatCurrency(product.price)}</label>
      </div>
      <figure className={styles['card-image']}>
        { product.image ? 
          <img src={product.image} alt={product.imageAlt} />:
          <div className={styles['no-image']}>No product image</div>
        }
      </figure>
    </article>
  );
}

export default ProductCard;
