import { Theme } from "./theme.model";

export const defaultTheme: Theme = {
  colors: {
    primary: '#0066CC',
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
    background: {
      base: '#ffffff',
      hover: '#f5f5f5',
    },
    border: '#e0e0e0',
    focus: '#0066CC',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
  shadows: {
    subtle: '0 1px 3px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.15)',
    focus: '0 0 0 3px rgba(0, 102, 204, 0.1)',
  },
  borderRadius: '8px',
  transitions: '200ms ease-in-out',
};
