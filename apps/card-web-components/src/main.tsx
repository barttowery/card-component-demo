// import { StrictMode } from 'react';
// import * as ReactDOM from 'react-dom/client';
// import App from './app/app';

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement,
// );

// root.render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );

import { ProductCard } from "./custom-elements/product-card";

if (!customElements.get('product-card')) {
  customElements.define(
    'product-card',
    ProductCard,
  );
}
