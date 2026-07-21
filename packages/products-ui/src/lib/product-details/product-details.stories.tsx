import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProductDetails } from './product-details';
import { expect } from 'storybook/test';
import { ProductSummary } from '@card-component-demo/shared-models';
import { ThemeProvider } from '@card-component-demo/shared-utils';
import { fn } from 'storybook/test';

const product: ProductSummary = {
  id: 1,
  image: '/product-images/hp-laptop.jpg',
  imageAlt: 'HP Laptop',
  title: 'HP OmniBook 13 Laptop',
  price: 449.99,
  description: '17.3 inch Laptop PC, FHD Display, AMD Ryzen 3 30, 8 GB RAM, 512 GB SSD, AMD Radeon 610M Graphics, Windows 11 Home, Mica Silver, 17-dp0199nr',
  link: '/products/1',
};

const meta = {
  component: ProductDetails,
  title: 'ProductDetails',
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ProductDetails>;
export default meta;

type Story = StoryObj<typeof ProductDetails>;

export const Primary = {
  args: {
    product,
  },
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/ProductDetails/gi)).toBeTruthy();
  },
} satisfies Story;
