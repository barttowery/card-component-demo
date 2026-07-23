import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProductCard } from './product-card';
import { ProductSummary } from '@card-component-demo/shared-models';
import { ThemeProvider } from '@card-component-demo/shared-utils';
import { fn } from 'storybook/test';

/* Mock Data - Normally these are in a mocks package or library */
const product1: ProductSummary = {
  id: 1,
  image: '/product-images/hp-laptop.jpg',
  imageAlt: 'HP Laptop',
  title: 'HP OmniBook 13 Laptop',
  price: 449.99,
  description: '17.3 inch Laptop PC, FHD Display, AMD Ryzen 3 30, 8 GB RAM, 512 GB SSD, AMD Radeon 610M Graphics, Windows 11 Home, Mica Silver, 17-dp0199nr',
  link: '/products/1',
};

const productLongDescription: ProductSummary = {
  id: 2,
  image: '/product-images/samsung-monitor.jpg',
  imageAlt: 'Samsung 27" Monitor',
  title: 'Samsung 27" Curved Monitor',
  price: 109.97,
  description: 'Samsung 27" Essential S3 (S36GD) Series FHD 1800R Curved Computer Monitor Samsung 27" Essential S3 (S36GD) Series FHD 1800R Curved Computer Monitor Samsung 27" Essential S3 (S36GD) Series FHD 1800R Curved Computer Monitor Samsung 27" Essential S3 (S36GD) Series FHD 1800R Curved Computer Monitor Samsung 27" Essential S3 (S36GD) Series FHD 1800R Curved Computer Monitor Samsung 27" Essential S3 (S36GD) Series FHD 1800R Curved Computer Monitor',
  link: '/products/2',
};

const productLongTitle: ProductSummary =   {
  id: 2,
  image: '/product-images/samsung-monitor.jpg',
  imageAlt: 'Samsung 27" Monitor',
  title: 'Samsung 27" Curved Monitor with Game Mode',
  price: 109.97,
  description: 'Samsung 27" Essential S3 (S36GD) Series FHD 1800R Curved Computer Monitor, 100Hz, Game Mode, Advanced Eye Comfort, HDMI and D-sub Ports, LS27D366GANXZA, 2024',
  link: '/products/2',
};

const meta = {
  component: ProductCard,
  title: 'ProductCard',
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  args: {
    onProductClicked: fn(),
  },
} satisfies Meta<typeof ProductCard>;
export default meta;

type Story = StoryObj<typeof ProductCard>;

export const Primary = {
  args: {
    product: product1,
  },
} satisfies Story;

export const ProductLongDescription = {
  args: {
    product: productLongDescription,
  },
} satisfies Story;

export const ProductLongTitle = {
  args: {
    product: productLongTitle,
  },
} satisfies Story;

export const NoImage = {
  args: {
    product: {...product1, image: ''},
  },
} satisfies Story;
