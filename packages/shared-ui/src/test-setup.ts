// Import jest-dom matchers for better assertions
import '@testing-library/jest-dom';

// Mock window.matchMedia for testing responsive components
global.matchMedia = global.matchMedia || function () {
  return {
    matches: false,
    media: '',
    onchange: null,
    addListener: function () {},
    removeListener: function () {},
    dispatchEvent: function () { return true; },
  };
};
