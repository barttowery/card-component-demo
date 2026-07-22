import styles from './app.module.css';
import { Outlet } from 'react-router-dom';
import { ThemeProvider, Theme } from '@card-component-demo/shared-utils';
import { useState } from 'react';

export function App() {
  const [ defaultThemeActive, setDefaultThemeActive ] = useState(true);
  const defaultTheme: Theme = {
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
  const alternateTheme: Theme = {
    colors: {
      primary: '#FF0000',
      text: {
        primary: '#1a1a1a',
        secondary: '#666666',
      },
      background: {
        base: '#ffffff',
        hover: '#f5f5f5',
      },
      border: '#e0e0e0',
      focus: '#FF0000',
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
  const [ currentTheme, setCurrentTheme ] = useState<Theme>(defaultTheme);

  const toggleTheme = () => {
    if (defaultThemeActive) {
      setDefaultThemeActive(false);
      setCurrentTheme(alternateTheme);
    }
    else {
      setDefaultThemeActive(true);
      setCurrentTheme(defaultTheme);
    }
  }

  return (
    <ThemeProvider themeTokens={currentTheme}>
      <div className={styles['app']}>
        <div className={styles['header']}>
          <div className={styles['app-title']}>Card Component Demo</div>
          <div className={styles['theme-toggle']}>
            <button onClick={toggleTheme}>Toggle Theme</button>
          </div>
        </div>
        <div className={styles['content']}>
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
