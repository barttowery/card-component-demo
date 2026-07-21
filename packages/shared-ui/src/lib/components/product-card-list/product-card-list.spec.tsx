import { render } from '@testing-library/react';

import ProductCardList from './product-card-list';

describe('ProductCardList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProductCardList />);
    expect(baseElement).toBeTruthy();
  });
});
