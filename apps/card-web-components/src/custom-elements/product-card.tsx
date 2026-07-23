import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ProductSummary } from '@card-component-demo/shared-models';
import { ThemeProvider } from '@card-component-demo/shared-utils';
import { ProductCard as ProductCardComponent, ProductCardStyles } from '@card-component-demo/shared-ui'
import { addStyle, addFonts } from './utils';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 300000, // 5 minutes
    },
  },
});

export class ProductCard extends HTMLElement {
  private root: Root | null = null;

  connectedCallback() {
    const shadow = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
    shadow.innerHTML = '';
    const mountPoint = document.createElement('div');
    shadow.appendChild(mountPoint);

    addStyle(shadow, [ProductCardStyles]);
    addFonts();

    this.root = createRoot(mountPoint);
    this.renderApp();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (oldValue === newValue || !this.root) return;
    this.renderApp();
  }

  private navigateToProductDetail(product: ProductSummary) {
    window.open(product.link, '_blank');
  }

  private renderApp() {
    if (!this.root) return;

    const productId = Number(this.getAttribute('product-id')) || 0;
    const image = this.getAttribute('image') || '';
    const imageAlt = this.getAttribute('image-alt') || '';
    const title = this.getAttribute('title') || '';
    const price = Number(this.getAttribute('price')) || 0;
    const description = this.getAttribute('description') || '';
    const link = this.getAttribute('link') || '';

    const product: ProductSummary = {
      id: productId,
      image,
      imageAlt,
      title,
      price,
      description,
      link
    };
    this.root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ProductCardComponent product={product} onProductClicked={this.navigateToProductDetail} />
          </ThemeProvider>
        </QueryClientProvider>
      </StrictMode>,
    );

  }
  disconnectedCallback() {
    this.root?.unmount();
  }
}
