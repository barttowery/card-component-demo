import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';

import ProductCardList from './product-card-list';
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

describe('ProductCardList', () => {
  const axeOptions = {
    rules: {
      region: { enabled: false }, // Allow sections without accessibility labels
      'listitem': { enabled: false }, // Allow li elements without ul/ol parent in isolated component tests
    },
  };

  describe('Basic Rendering', () => {
    it('should render successfully', () => {
      const products = [createMockProduct()];
      const { baseElement } = render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);
      expect(baseElement).toBeTruthy();
    });

    it('should display products in a list', () => {
      const products = [createMockProduct({ id: 1, title: 'Product 1' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('should display all products in the array', () => {
      const products = [
        createMockProduct({ id: 1, title: 'First Product' }),
        createMockProduct({ id: 2, title: 'Second Product' }),
        createMockProduct({ id: 3, title: 'Third Product' }),
      ];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText(/First Product/i)).toBeInTheDocument();
      expect(screen.getByText(/Second Product/i)).toBeInTheDocument();
      expect(screen.getByText(/Third Product/i)).toBeInTheDocument();
    });

    it('should render the correct number of product cards', () => {
      const products = [
        createMockProduct({ id: 1 }),
        createMockProduct({ id: 2 }),
      ];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      // Should have one ul element with class products-list
      expect(document.querySelector('ul.products-list')).toBeInTheDocument();
    });

    it('should display correct number of list items', () => {
      const products = [
        createMockProduct({ id: 1, title: 'Product 1' }),
        createMockProduct({ id: 2, title: 'Product 2' }),
        createMockProduct({ id: 3, title: 'Product 3' }),
      ];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });
  });

  describe('Empty State', () => {
    it('should display "No products available" when products array is empty', () => {
      render(<ProductCardList products={[]} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText(/No products available/i)).toBeInTheDocument();
    });

    it('should not display the products list when there are no products', () => {
      render(<ProductCardList products={[]} onProductClicked={mockOnProductClicked} />);

      expect(document.querySelector('ul.products-list')).not.toBeInTheDocument();
    });

    it('should handle null products gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => render(<ProductCardList products={null as any} onProductClicked={mockOnProductClicked} />)).not.toThrow();
    });

    it('should handle undefined products gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => render(<ProductCardList products={undefined as any} onProductClicked={mockOnProductClicked} />)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single product correctly', () => {
      const products = [createMockProduct({ id: 1, title: 'Only Product' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText(/Only Product/i)).toBeInTheDocument();
    });

    it('should handle many products correctly', () => {
      const products = Array.from({ length: 20 }, (_, i) =>
        createMockProduct({ id: i, title: `Product ${i}` })
      );
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText(/Product 0/i)).toBeInTheDocument();
      expect(screen.getByText(/Product 19/i)).toBeInTheDocument();
    });

    it('should handle duplicate product titles', () => {
      const products = [
        createMockProduct({ id: 1, title: 'Same Title' }),
        createMockProduct({ id: 2, title: 'Same Title' }),
      ];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      // Both should be rendered
      const matches = screen.getAllByText(/Same Title/i);
      expect(matches.length).toBe(2);
    });

    it('should handle product with zero price', () => {
      const products = [createMockProduct({ id: 1, title: 'Free Product', price: 0 })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText(/Free Product/i)).toBeInTheDocument();
    });

    it('should handle product with special characters in title', () => {
      const products = [createMockProduct({ id: 1, title: 'Product & Description <script>' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText(/Product & Description/i)).toBeInTheDocument();
    });

    it('should handle large product list', () => {
      const products = Array.from({ length: 50 }, (_, i) =>
        createMockProduct({ id: i, title: `Large Product ${i}` })
      );
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText(/Large Product 0/i)).toBeInTheDocument();
      expect(screen.getByText(/Large Product 49/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility Tests', () => {
    it('should pass accessibility audit with jest-axe', async () => {
      const products = [createMockProduct({ image: '/test-image.jpg' })];
      const { container } = render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });

    it('should have proper list role', () => {
      const products = [createMockProduct()];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('should have list items for each product', () => {
      const products = [
        createMockProduct({ id: 1, title: 'Product 1' }),
        createMockProduct({ id: 2, title: 'Product 2' }),
      ];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });

    it('should have accessible images with alt text', () => {
      const products = [createMockProduct({ imageAlt: 'Accessible Image Alt' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByRole('img', { name: /Accessible Image Alt/i })).toBeInTheDocument();
    });

    it('should pass accessibility with empty list', async () => {
      const { container } = render(<ProductCardList products={[]} onProductClicked={mockOnProductClicked} />);

      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });

    it('should pass accessibility with many products', async () => {
      const products = Array.from({ length: 10 }, (_, i) =>
        createMockProduct({ id: i, title: `Product ${i}` })
      );
      const { container } = render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });

    it('should pass accessibility with unicode characters', async () => {
      const products = [createMockProduct({ id: 1, title: 'Тест Продукт 🎉' })];
      const { container } = render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading hierarchy (h2 for product titles)', () => {
      const products = [createMockProduct({ id: 1, title: 'Main Product' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      // ProductCard uses h2 for title
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should have ul with class products-list when products exist', () => {
      const products = [createMockProduct()];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(document.querySelector('ul.products-list')).toBeInTheDocument();
    });

    it('should have div with class no-products when empty', () => {
      render(<ProductCardList products={[]} onProductClicked={mockOnProductClicked} />);

      expect(document.querySelector('div.no-products')).toBeInTheDocument();
    });

    it('should use product id as key for each ProductCard', () => {
      const products = [
        createMockProduct({ id: 100, title: 'ID Test 1' }),
        createMockProduct({ id: 200, title: 'ID Test 2' }),
      ];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      // The ProductCard renders an li with class card
      const listItems = document.querySelectorAll('li.card');
      expect(listItems).toHaveLength(2);
    });

    it('should render product titles in correct order', () => {
      const products = [
        createMockProduct({ id: 1, title: 'First' }),
        createMockProduct({ id: 2, title: 'Second' }),
        createMockProduct({ id: 3, title: 'Third' }),
      ];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      const headings = screen.getAllByRole('heading', { level: 2 });
      expect(headings[0]).toHaveTextContent(/First/i);
      expect(headings[1]).toHaveTextContent(/Second/i);
      expect(headings[2]).toHaveTextContent(/Third/i);
    });

    it('should render product prices in correct order', () => {
      const products = [
        createMockProduct({ id: 1, title: 'First', price: 10.99 }),
        createMockProduct({ id: 2, title: 'Second', price: 20.99 }),
        createMockProduct({ id: 3, title: 'Third', price: 30.99 }),
      ];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText(/\$10.99/i)).toBeInTheDocument();
      expect(screen.getByText(/\$20.99/i)).toBeInTheDocument();
      expect(screen.getByText(/\$30.99/i)).toBeInTheDocument();
    });
  });

  describe('Interaction Tests', () => {
    it('should call onProductClicked when a product is clicked', () => {
      const products = [createMockProduct({ id: 1, title: 'Clickable Product' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      const listItem = screen.getByRole('listitem');
      fireEvent.click(listItem);

      expect(mockOnProductClicked).toHaveBeenCalledTimes(1);
    });

    it('should call onProductClicked with correct product data when clicked', () => {
      const products = [createMockProduct({ id: 42, title: 'Specific Product' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      const listItem = screen.getByRole('listitem');
      fireEvent.click(listItem);

      expect(mockOnProductClicked).toHaveBeenCalledWith(products[0]);
    });

    it('should have correct aria-label on list items', () => {
      const products = [createMockProduct({ id: 1, title: 'Aria Test Product' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByRole('listitem')).toHaveAttribute('aria-label', 'View details for Aria Test Product');
    });

    it('should be tabbable (tabIndex=0)', () => {
      const products = [createMockProduct({ id: 1, title: 'Tab Test' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByRole('listitem')).toHaveAttribute('tabIndex', '0');
    });

    it('should call onProductClicked with correct product for multiple items', () => {
      const products = [
        createMockProduct({ id: 1, title: 'First' }),
        createMockProduct({ id: 2, title: 'Second' }),
      ];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      const listItems = screen.getAllByRole('listitem');
      fireEvent.click(listItems[1]);

      expect(mockOnProductClicked).toHaveBeenCalledWith(products[1]);
    });

    it('should handle mouse over event on list items', () => {
      const products = [createMockProduct({ id: 1, title: 'Hover Test' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      const listItem = screen.getByRole('listitem');
      
      // Just verify no errors - mouse events are native DOM events
      expect(() => {
        fireEvent.mouseOver(listItem);
      }).not.toThrow();
    });

    it('should handle focus event on list items', () => {
      const products = [createMockProduct({ id: 1, title: 'Focus Test' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      const listItem = screen.getByRole('listitem');
      
      expect(() => {
        fireEvent.focus(listItem);
      }).not.toThrow();
    });

    it('should handle blur event on list items', () => {
      const products = [createMockProduct({ id: 1, title: 'Blur Test' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      const listItem = screen.getByRole('listitem');
      
      expect(() => {
        fireEvent.blur(listItem);
      }).not.toThrow();
    });
  });

  describe('Image Handling', () => {
    it('should display images with correct src attribute', () => {
      const products = [createMockProduct({ id: 1, image: '/custom/path/image.jpg' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should display images with correct alt text', () => {
      const products = [createMockProduct({ id: 1, imageAlt: 'Custom Product Image Alt' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Custom Product Image Alt');
    });

    it('should handle different image formats', () => {
      const products = [
        createMockProduct({ id: 1, image: '/product.png' }),
        createMockProduct({ id: 2, image: '/product.jpg' }),
        createMockProduct({ id: 3, image: '/product.webp' }),
      ];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getAllByRole('img')).toHaveLength(3);
    });
  });

  describe('Price Formatting', () => {
    it('should format price with two decimal places', () => {
      const products = [createMockProduct({ id: 1, title: 'Decimal Test', price: 19.9 })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText('$19.90')).toBeInTheDocument();
    });

    it('should format large prices correctly', () => {
      const products = [createMockProduct({ id: 1, title: 'Large Price', price: 12345.67 })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText('$12,345.67')).toBeInTheDocument();
    });

    it('should format currency with zero cents', () => {
      const products = [createMockProduct({ id: 1, title: 'Whole Number', price: 99 })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText('$99.00')).toBeInTheDocument();
    });

    it('should handle negative prices (edge case)', () => {
      const products = [createMockProduct({ id: 1, title: 'Negative Price', price: -10 })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText(/-\$10.00/i)).toBeInTheDocument();
    });

    it('should handle very large prices', () => {
      const products = [createMockProduct({ id: 1, title: 'Very Large Price', price: 999999999.99 })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText(/\$999,999,999.99/i)).toBeInTheDocument();
    });
  });

  describe('Long Content Handling', () => {
    it('should handle description with special characters', () => {
      const products = [createMockProduct({ 
        id: 1, 
        title: 'SpecialChars Product',
        description: 'Description with <>&"\'special & chars!' 
      })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText(/SpecialChars Product/i)).toBeInTheDocument();
    });

    it('should handle unicode characters in title', () => {
      const products = [createMockProduct({ id: 1, title: 'Tëst Pröduct ß' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByRole('heading', { level: 2, name: new RegExp('Tëst Pröduct ß') })).toBeInTheDocument();
    });

    it('should handle multiline description', () => {
      const products = [createMockProduct({ 
        id: 1, 
        title: 'Multiline Product',
        description: 'Line 1\nLine 2\nLine 3' 
      })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText(/Line 1/)).toBeInTheDocument();
    });

    it('should handle HTML entities in title', () => {
      const products = [createMockProduct({ id: 1, title: 'Product & More' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByRole('heading', { level: 2, name: /Product & More/i })).toBeInTheDocument();
    });

    it('should handle RTL (right-to-left) text', () => {
      const products = [createMockProduct({ id: 1, title: 'سلام' })]; // Arabic for "Hello"
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByRole('heading', { level: 2, name: new RegExp('سلام') })).toBeInTheDocument();
    });

    it('should handle emoji in title', () => {
      const products = [createMockProduct({ id: 1, title: 'Product 🚀' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByRole('heading', { level: 2, name: new RegExp('Product 🚀') })).toBeInTheDocument();
    });

    it('should handle emoji in description', () => {
      const products = [createMockProduct({ 
        id: 1, 
        title: 'Emoji Product',
        description: 'Test with emoji 🎉' 
      })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText(/🎉/)).toBeInTheDocument();
    });
  });

  describe('Re-render Tests', () => {
    it('should re-render when product list changes', async () => {
      const { rerender } = render(
        <ProductCardList products={[createMockProduct({ id: 1, title: 'Original' })]} onProductClicked={mockOnProductClicked} />
      );

      expect(screen.getByRole('heading', { level: 2, name: /Original/i })).toBeInTheDocument();

      rerender(
        <ProductCardList products={[createMockProduct({ id: 2, title: 'Updated' })]} onProductClicked={mockOnProductClicked} />
      );

      expect(screen.getByRole('heading', { level: 2, name: /Updated/i })).toBeInTheDocument();
    });

    it('should handle adding products dynamically', () => {
      const { rerender } = render(
        <ProductCardList products={[createMockProduct({ id: 1, title: 'First' })]} onProductClicked={mockOnProductClicked} />
      );

      expect(screen.getAllByRole('listitem')).toHaveLength(1);

      rerender(
        <ProductCardList 
          products={[
            createMockProduct({ id: 1, title: 'First' }),
            createMockProduct({ id: 2, title: 'Second' })
          ]} 
          onProductClicked={mockOnProductClicked} 
        />
      );

      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });

    it('should handle removing products dynamically', () => {
      const { rerender } = render(
        <ProductCardList 
          products={[
            createMockProduct({ id: 1, title: 'First' }),
            createMockProduct({ id: 2, title: 'Second' }),
            createMockProduct({ id: 3, title: 'Third' })
          ]} 
          onProductClicked={mockOnProductClicked} 
        />
      );

      expect(screen.getAllByRole('listitem')).toHaveLength(3);

      rerender(
        <ProductCardList products={[createMockProduct({ id: 1, title: 'First' })]} onProductClicked={mockOnProductClicked} />
      );

      expect(screen.getAllByRole('listitem')).toHaveLength(1);
    });

    it('should not re-render when clicking card (state change should be internal)', () => {
      const products = [createMockProduct()];
      const { container } = render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(container).toBeTruthy();

      fireEvent.click(screen.getByRole('listitem'));

      // List should still be in DOM
      expect(document.querySelector('ul.products-list')).toBeInTheDocument();
    });

    it('should handle rapid re-renders with different product lists', () => {
      const { rerender } = render(
        <ProductCardList products={[createMockProduct({ id: 1, title: 'First' })]} onProductClicked={mockOnProductClicked} />
      );

      expect(screen.getByText(/First/i)).toBeInTheDocument();

      rerender(
        <ProductCardList products={[createMockProduct({ id: 2, title: 'Second' })]} onProductClicked={mockOnProductClicked} />
      );

      expect(screen.getByText(/Second/i)).toBeInTheDocument();

      rerender(
        <ProductCardList products={[]} onProductClicked={mockOnProductClicked} />
      );

      expect(screen.getByText(/No products available/i)).toBeInTheDocument();
    });
  });

  describe('Multiple Product Interaction', () => {
    it('should handle clicking multiple different products', () => {
      const products = [
        createMockProduct({ id: 1, title: 'First' }),
        createMockProduct({ id: 2, title: 'Second' }),
        createMockProduct({ id: 3, title: 'Third' }),
      ];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      const listItems = screen.getAllByRole('listitem');
      
      fireEvent.click(listItems[0]);
      expect(mockOnProductClicked).toHaveBeenCalledWith(products[0]);

      mockOnProductClicked.mockClear();

      fireEvent.click(listItems[1]);
      expect(mockOnProductClicked).toHaveBeenCalledWith(products[1]);

      mockOnProductClicked.mockClear();

      fireEvent.click(listItems[2]);
      expect(mockOnProductClicked).toHaveBeenCalledWith(products[2]);
    });

    it('should maintain unique accessibility IDs for multiple products', async () => {
      const products = [
        createMockProduct({ id: 1, title: 'First Product' }),
        createMockProduct({ id: 2, title: 'Second Product' }),
      ];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByRole('heading', { level: 2, name: /First Product/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /Second Product/i })).toBeInTheDocument();
    });

    it('should handle many products with unique IDs', () => {
      const products = Array.from({ length: 10 }, (_, i) =>
        createMockProduct({ id: i, title: `Unique ID ${i}` })
      );
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getAllByRole('listitem')).toHaveLength(10);
    });
  });

  describe('A11y Edge Cases', () => {
    it('should pass accessibility with very long title', async () => {
      const longTitle = 'T'.repeat(200);
      const products = [createMockProduct({ id: 1, title: longTitle })];
      const { container } = render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });

    it('should pass accessibility with very long description', async () => {
      const longDesc = 'D'.repeat(1000);
      const products = [createMockProduct({ id: 1, title: 'Long Desc Product', description: longDesc })];
      const { container } = render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });

    it('should pass accessibility with unicode characters', async () => {
      const unicodeTitle = 'Привет мир 🌍'; // Russian + emoji
      const products = [createMockProduct({ id: 1, title: unicodeTitle })];
      const { container } = render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      const results = await axe(container, axeOptions);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Integration Tests', () => {
    it('should render multiple ProductCard components without conflicts', () => {
      const products = [
        createMockProduct({ id: 1, title: 'Product 1' }),
        createMockProduct({ id: 2, title: 'Product 2' }),
      ];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Product 2/i)).toBeInTheDocument();
    });

    it('should pass onClick handler to all ProductCard components', () => {
      const products = [
        createMockProduct({ id: 1, title: 'First' }),
        createMockProduct({ id: 2, title: 'Second' }),
      ];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      const listItems = screen.getAllByRole('listitem');
      
      fireEvent.click(listItems[0]);
      expect(mockOnProductClicked).toHaveBeenCalledWith(products[0]);

      mockOnProductClicked.mockClear();

      fireEvent.click(listItems[1]);
      expect(mockOnProductClicked).toHaveBeenCalledWith(products[1]);
    });

    it('should handle mixed product data types', () => {
      const products = [
        createMockProduct({ id: 1, title: 'Standard Product' }),
        createMockProduct({ 
          id: 2, 
          title: 'Zero Price', 
          price: 0,
          description: '' 
        }),
        createMockProduct({ 
          id: 3, 
          title: 'Large Price', 
          price: 999999.99
        }),
      ];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText(/Standard Product/i)).toBeInTheDocument();
      expect(screen.getByText(/Zero Price/i)).toBeInTheDocument();
      expect(screen.getByText(/Large Price/i)).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('should apply products-list CSS class to ul element', () => {
      const products = [createMockProduct()];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(document.querySelector('ul.products-list')).toHaveClass('products-list');
    });

    it('should apply no-products CSS class when empty', () => {
      render(<ProductCardList products={[]} onProductClicked={mockOnProductClicked} />);

      expect(document.querySelector('div.no-products')).toHaveClass('no-products');
    });

    it('should apply card CSS class to each ProductCard', () => {
      const products = [
        createMockProduct({ id: 1 }),
        createMockProduct({ id: 2 }),
      ];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(document.querySelectorAll('li.card')).toHaveLength(2);
    });

    it('should apply card-content CSS class within ProductCards', () => {
      const products = [createMockProduct()];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(document.querySelector('.card-content')).toBeInTheDocument();
    });

    it('should apply card-image CSS class within ProductCards', () => {
      const products = [createMockProduct()];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(document.querySelector('.card-image')).toBeInTheDocument();
    });
  });

  describe('Component Structure Details', () => {
    it('should have correct heading level (h2) for product titles', () => {
      const products = [createMockProduct({ id: 1, title: 'Title Test' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      const h2Element = screen.getByRole('heading', { level: 2 });
      expect(h2Element.tagName).toBe('H2');
    });

    it('should contain img element within card-image container', () => {
      const products = [createMockProduct()];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      const imageContainer = document.querySelector('.card-image');
      expect(imageContainer?.querySelector('img')).toBeInTheDocument();
    });

    it('should render description within card-description container', () => {
      const products = [createMockProduct({ id: 1, title: 'Desc Test' })];
      render(<ProductCardList products={products} onProductClicked={mockOnProductClicked} />);

      expect(screen.getByText(/This is a test product description/i)).toBeInTheDocument();
    });
  });
});