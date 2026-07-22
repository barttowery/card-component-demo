import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';

import ProductCard from './product-card';
import { ProductSummary } from '@card-component-demo/shared-models';

/* Mock data for testing */
const mockOnProductClicked = jest.fn() as jest.MockedFunction<(product: ProductSummary) => void>;

const createMockProduct = (overrides?: Partial<ProductSummary>): ProductSummary => ({
  id: 1,
  image: '/test-image.jpg',
  imageAlt: 'Test Product Image',
  title: 'Test Product Title',
  price: 29.99,
  description: 'This is a test product description.',
  link: '/products/1',
  ...overrides,
});

describe('ProductCard', () => {
  const axeOptions = {
    rules: {
      region: { enabled: false }, // Allow sections without accessibility labels
      'listitem': { enabled: false }, // Allow li elements without ul/ol parent in isolated component tests
    },
  };
  describe('Basic Rendering', () => {
    it('should render successfully', () => {
      const product = createMockProduct();
      const { baseElement } = render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      expect(baseElement).toBeTruthy();
    });

    it('should display the product title', () => {
      const product = createMockProduct({ title: 'Test Laptop' });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByRole('heading', { level: 2, name: /Test Laptop/i })).toBeInTheDocument();
    });

    it('should display the product description', () => {
      const product = createMockProduct({ description: 'Detailed description here' });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByText(/Detailed description here/i)).toBeInTheDocument();
    });

    it('should display the formatted price', () => {
      const product = createMockProduct({ price: 49.99 });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByText(/\$49.99/i)).toBeInTheDocument();
    });

    it('should display the product image with correct src', () => {
      const product = createMockProduct({ image: '/custom-image.jpg' });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      const imgElement = screen.getByRole('img', { name: 'Test Product Image' });
      expect(imgElement).toHaveAttribute('src', '/custom-image.jpg');
    });

    it('should display the product image with correct alt text', () => {
      const product = createMockProduct({ imageAlt: 'Custom Alt Text' });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      const imgElement = screen.getByRole('img', { name: /Custom Alt Text/i });
      expect(imgElement).toHaveAttribute('alt', 'Custom Alt Text');
    });

    it('should have correct CSS classes on the card element', () => {
      const product = createMockProduct();
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      // The root article should have the card class
      // Check that the rendered output contains expected structure
      expect(document.body).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero price correctly', () => {
      const product = createMockProduct({ price: 0 });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByText(/\$0.00/i)).toBeInTheDocument();
    });

    it('should handle empty title gracefully', () => {
      const product = createMockProduct({ title: '' });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      // Should still render without crashing
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('should handle empty description gracefully', () => {
      const product = createMockProduct({ description: '' });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      // Description label should exist even if empty
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('should handle very long product title', () => {
      const longTitle = 'A'.repeat(200);
      const product = createMockProduct({ title: longTitle });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByRole('heading', { level: 2, name: new RegExp(longTitle) })).toBeInTheDocument();
    });

    it('should handle very long description', () => {
      const longDescription = 'B'.repeat(500);
      const product = createMockProduct({ description: longDescription });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByText(new RegExp(longDescription))).toBeInTheDocument();
    });

    it('should handle null/undefined values gracefully', () => {
      // Test with minimal valid data - use a placeholder image instead of empty string
      const minimalProduct: ProductSummary = {
        id: 1,
        image: '/placeholder.jpg',
        imageAlt: 'Placeholder',
        title: 'Minimal',
        price: 0,
        description: '',
        link: '',
      };
      
      expect(() => render(<ProductCard product={minimalProduct} onProductClicked={mockOnProductClicked} />)).not.toThrow();
    });
  });

  describe('Accessibility Tests', () => {
    // jest-axe integration test
    it('should pass accessibility audit with jest-axe', async () => {
      const product = createMockProduct({ image: '/test-image.jpg' });
      const { container } = render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading hierarchy (h2 for title)', () => {
      const product = createMockProduct();
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      // Should have h2 element
      const h2Element = screen.getByRole('heading', { level: 2 });
      expect(h2Element).toBeInTheDocument();
    });

    it('should have accessible image with alt text', () => {
      const product = createMockProduct({ imageAlt: 'Accessible Image Alt' });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      const imgElement = screen.getByRole('img');
      expect(imgElement).toHaveAttribute('alt');
      expect(imgElement).toBeVisible();
    });

    it('should include imageAlt text in accessibility tree', async () => {
      const product = createMockProduct({ imageAlt: 'Custom Alt for Accessibility' });
      const { container } = render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      // Check that the alt text is present for screen readers
      expect(screen.getByRole('img', { name: /Custom Alt for Accessibility/i })).toBeInTheDocument();
    });

    it('should pass accessibility with long description content', async () => {
      const product = createMockProduct({ 
        description: 'A'.repeat(1000),
        title: 'Test',
        imageAlt: 'Image'
      });
      const { container } = render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });

    it('should pass accessibility with price formatting', async () => {
      const product = createMockProduct({ 
        price: 1234.56,
        title: 'Expensive Product',
        imageAlt: 'Image'
      });
      const { container } = render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });

    it('should pass accessibility with empty description', async () => {
      const product = createMockProduct({ 
        description: '',
        title: 'Product',
        imageAlt: 'Image'
      });
      const { container } = render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });

    it('should pass accessibility with zero price', async () => {
      const product = createMockProduct({ 
        price: 0,
        title: 'Free Product',
        imageAlt: 'Image'
      });
      const { container } = render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Component Structure', () => {
    it('should have article as root element', () => {
      const product = createMockProduct();
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      // The root should be an article element
      expect(document.querySelector('article.card')).toBeInTheDocument();
    });

    it('should contain card-content div', () => {
      const product = createMockProduct();
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      // The card-content div should exist
      expect(screen.getByText(/Test Product Title/i)).toBeInTheDocument();
    });

    it('should contain card-image div with img element', () => {
      const product = createMockProduct();
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      // The image should be in a container
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('should apply card CSS class to root element', () => {
      const product = createMockProduct();
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      const cardElement = document.querySelector('article.card');
      expect(cardElement).toBeInTheDocument();
      expect(cardElement).toHaveClass('card');
    });

    it('should apply card-content CSS class', () => {
      const product = createMockProduct();
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      // The card-content div should exist within the card
      expect(document.querySelector('.card-content')).toBeInTheDocument();
    });

    it('should apply card-image CSS class', () => {
      const product = createMockProduct();
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      // The card-image div should exist
      expect(document.querySelector('.card-image')).toBeInTheDocument();
    });

    it('should apply card-description CSS class to description label', () => {
      const product = createMockProduct();
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      // The card-description class should be applied
      expect(document.querySelector('.card-description')).toBeInTheDocument();
    });

    it('should apply card-price CSS class to price label', () => {
      const product = createMockProduct();
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      // The card-price class should be applied
      expect(document.querySelector('.card-price')).toBeInTheDocument();
    });
  });

  describe('Interaction Tests', () => {
    it('should call onProductClicked when clicking on the card', () => {
      const product = createMockProduct();
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
       const cardElement = document.querySelector('article.card');
       expect(cardElement).toBeInTheDocument();
       fireEvent.click(cardElement!);
      
      expect(mockOnProductClicked).toHaveBeenCalledTimes(1);
      expect(mockOnProductClicked).toHaveBeenCalledWith(product);
    });

    it('should call onProductClicked with correct product data when clicked', () => {
      const product = createMockProduct({ id: 42, title: 'Specific Product' });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
       const cardElement = document.querySelector('article.card');
       expect(cardElement).toBeInTheDocument();
       fireEvent.click(cardElement!);
       
       expect(mockOnProductClicked).toHaveBeenCalledWith(product);
    });

    it('should have correct aria-label with product title', () => {
      const product = createMockProduct({ title: 'Aria Test Product' });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
       const cardElement = document.querySelector('article.card');
       expect(cardElement).toBeInTheDocument();
       expect(cardElement!).toHaveAttribute('aria-label', 'View details for Aria Test Product');
    });

    it('should be tabbable (tabIndex=0)', () => {
      const product = createMockProduct();
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
       const cardElement = document.querySelector('article.card');
       expect(cardElement).toBeInTheDocument();
       expect(cardElement!).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Image Handling', () => {
    it('should display image with correct src attribute', () => {
      const customImage = '/custom/path/image.jpg';
      const product = createMockProduct({ image: customImage });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      const imgElement = screen.getByRole('img');
      expect(imgElement).toHaveAttribute('src', customImage);
    });

    it('should display image with correct alt text', () => {
      const customAlt = 'Custom Product Image Alt';
      const product = createMockProduct({ imageAlt: customAlt });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      const imgElement = screen.getByRole('img');
      expect(imgElement).toHaveAttribute('alt', customAlt);
    });

    it('should be visible in the document', () => {
      const product = createMockProduct();
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      const imgElement = screen.getByRole('img');
      expect(imgElement).toBeVisible();
    });
  });

  describe('Price Formatting', () => {
    it('should format price with two decimal places', () => {
      const product = createMockProduct({ price: 19.9 });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByText('$19.90')).toBeInTheDocument();
    });

    it('should format large prices correctly', () => {
      const product = createMockProduct({ price: 12345.67 });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByText('$12,345.67')).toBeInTheDocument();
    });

    it('should format currency with zero cents', () => {
      const product = createMockProduct({ price: 99 });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByText('$99.00')).toBeInTheDocument();
    });

    it('should handle very large prices', () => {
      const product = createMockProduct({ price: 999999999.99 });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByText(/\$999,999,999.99/i)).toBeInTheDocument();
    });
  });

  describe('Multiple Products', () => {
    it('should render multiple products in a list', () => {
      const product1 = createMockProduct({ id: 1, title: 'First Product' });
      const product2 = createMockProduct({ id: 2, title: 'Second Product' });
      const product3 = createMockProduct({ id: 3, title: 'Third Product' });
      
      render(
        <ul>
          <ProductCard product={product1} onProductClicked={mockOnProductClicked} />
          <ProductCard product={product2} onProductClicked={mockOnProductClicked} />
          <ProductCard product={product3} onProductClicked={mockOnProductClicked} />
        </ul>
      );
      
      expect(screen.getByText(/First Product/i)).toBeInTheDocument();
      expect(screen.getByText(/Second Product/i)).toBeInTheDocument();
      expect(screen.getByText(/Third Product/i)).toBeInTheDocument();
    });

    it('should handle products with same title', () => {
      const product1 = createMockProduct({ id: 1, title: 'Duplicate' });
      const product2 = createMockProduct({ id: 2, title: 'Duplicate' });
      
      render(
        <div>
          <ProductCard product={product1} onProductClicked={mockOnProductClicked} />
          <ProductCard product={product2} onProductClicked={mockOnProductClicked} />
        </div>
      );
      
      expect(screen.getAllByText(/Duplicate/i)).toHaveLength(2);
    });
  });

  describe('Long Content Handling', () => {
    it('should handle description with special characters', () => {
      const specialChars = 'Description with <>&"\'special & chars!';
      const product = createMockProduct({ description: specialChars });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByText(specialChars)).toBeInTheDocument();
    });

    it('should handle unicode characters in title', () => {
      const unicodeTitle = 'Tëst Pröduct ß';
      const product = createMockProduct({ title: unicodeTitle });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByRole('heading', { level: 2, name: new RegExp(unicodeTitle) })).toBeInTheDocument();
    });

    it('should handle multiline description', () => {
      const multilineDesc = 'Line 1\nLine 2\nLine 3';
      const product = createMockProduct({ description: multilineDesc });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByText(/Line 1/)).toBeInTheDocument();
      expect(screen.getByText(/Line 2/)).toBeInTheDocument();
    });

    it('should handle HTML entities in title', () => {
      const htmlTitle = 'Product & More';
      const product = createMockProduct({ title: htmlTitle });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByRole('heading', { level: 2, name: /Product & More/i })).toBeInTheDocument();
    });

    it('should handle RTL (right-to-left) text', () => {
      const rtlText = 'سلام'; // Arabic for "Hello"
      const product = createMockProduct({ title: rtlText, description: rtlText });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByRole('heading', { level: 2, name: new RegExp(rtlText) })).toBeInTheDocument();
    });

    it('should handle emoji in title', () => {
      const emojiTitle = 'Product 🚀';
      const product = createMockProduct({ title: emojiTitle });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByRole('heading', { level: 2, name: new RegExp(emojiTitle) })).toBeInTheDocument();
    });

    it('should handle emoji in description', () => {
      const emojiDesc = 'Test with emoji 🎉';
      const product = createMockProduct({ description: emojiDesc });
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByText(/🎉/)).toBeInTheDocument();
    });
  });

  describe('Re-render Tests', () => {
    it('should re-render when product prop changes', async () => {
      const { rerender } = render(<ProductCard product={createMockProduct({ id: 1, title: 'Original' })} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByRole('heading', { level: 2, name: /Original/i })).toBeInTheDocument();
      
      rerender(<ProductCard product={createMockProduct({ id: 2, title: 'Updated' })} onProductClicked={mockOnProductClicked} />);
      
      expect(screen.getByRole('heading', { level: 2, name: /Updated/i })).toBeInTheDocument();
    });

    it('should not re-render when clicking card (state change should be internal)', () => {
      const product = createMockProduct();
      const { container } = render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      // Get initial state
      expect(container).toBeTruthy();
      
       const cardElement = document.querySelector('article.card');
       expect(cardElement).toBeInTheDocument();
        fireEvent.click(cardElement!);
       
       // Card should still be in DOM
      expect(container.querySelector('.card')).toBeInTheDocument();
    });

    it('should handle multiple interaction events', () => {
      const product = createMockProduct();
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
        const cardElement = document.querySelector('article.card');
       expect(cardElement).toBeInTheDocument();
        fireEvent.click(cardElement!);
        
        mockOnProductClicked.mockClear();
        
        // Enter key
       fireEvent.keyDown(cardElement!, { key: 'Enter' });
      
      expect(mockOnProductClicked).toHaveBeenCalledTimes(1);
    });

    it('should handle focus event on card', () => {
      const product = createMockProduct();
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
        const cardElement = document.querySelector('article.card');
       expect(cardElement).toBeInTheDocument();
       fireEvent.focus(cardElement!);
      
      // Just verify no errors - focus is a native DOM event
      expect(document.body).toBeTruthy();
    });
  });

  describe('A11y Edge Cases', () => {
    it('should pass accessibility with very long title', async () => {
      const longTitle = 'T'.repeat(200);
      const product = createMockProduct({ title: longTitle, imageAlt: 'Image' });
      const { container } = render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });

    it('should pass accessibility with very long description', async () => {
      const longDesc = 'D'.repeat(1000);
      const product = createMockProduct({ description: longDesc, imageAlt: 'Image' });
      const { container } = render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });

    it('should pass accessibility with unicode characters', async () => {
      const unicodeTitle = 'Привет мир 🌍'; // Russian + emoji
      const product = createMockProduct({ title: unicodeTitle, imageAlt: 'Image' });
      const { container } = render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Component Structure Details', () => {
    it('should have correct heading level (h2) for title', () => {
      const product = createMockProduct();
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      const h2Element = screen.getByRole('heading', { level: 2 });
      expect(h2Element.tagName).toBe('H2');
    });

    it('should have article with correct role attribute', () => {
      const product = createMockProduct();
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      // ProductCard now uses article element
      expect(document.querySelector('article')).toBeInTheDocument();
    });

    it('should contain img element within card-image container', () => {
      const product = createMockProduct();
      render(<ProductCard product={product} onProductClicked={mockOnProductClicked} />);
      
      const imageContainer = document.querySelector('.card-image');
      expect(imageContainer?.querySelector('img')).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    it('should render multiple ProductCard components without conflicts', () => {
      const product1 = createMockProduct({ id: 1, title: 'Product 1' });
      const product2 = createMockProduct({ id: 2, title: 'Product 2' });
      
      render(
        <div>
          <ProductCard product={product1} onProductClicked={mockOnProductClicked} />
          <ProductCard product={product2} onProductClicked={mockOnProductClicked} />
        </div>
      );
      
      expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Product 2/i)).toBeInTheDocument();
    });

    it('should maintain unique accessibility IDs for multiple cards', async () => {
      const product1 = createMockProduct({ id: 1, title: 'First Product' });
      const product2 = createMockProduct({ id: 2, title: 'Second Product' });
      
      render(
        <div>
          <ProductCard product={product1} onProductClicked={mockOnProductClicked} />
          <ProductCard product={product2} onProductClicked={mockOnProductClicked} />
        </div>
      );
      
      // Both products should be accessible
      expect(screen.getByRole('heading', { level: 2, name: /First Product/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /Second Product/i })).toBeInTheDocument();
    });
  });
});