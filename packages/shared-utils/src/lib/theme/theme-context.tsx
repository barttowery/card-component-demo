import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { Theme } from './theme.model';
import { defaultTheme } from './theme-default';

interface ThemeContextType {
  themeTokens: Theme;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  themeTokens: Theme;
}

export function ThemeProvider({
  children,
  themeTokens = defaultTheme
}: ThemeProviderProps) {
  const value = useMemo<ThemeContextType>(() => ({ themeTokens }), [themeTokens]);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--color-primary', themeTokens.colors.primary);
    root.style.setProperty('--color-text-primary', themeTokens.colors.text.primary);
    root.style.setProperty('--color-text-secondary', themeTokens.colors.text.secondary);
    root.style.setProperty('--color-background-base', themeTokens.colors.background.base);
    root.style.setProperty('--color-background-hover', themeTokens.colors.background.hover);
    root.style.setProperty('--color-border', themeTokens.colors.border);
    root.style.setProperty('--color-focus', themeTokens.colors.focus);
    root.style.setProperty('--spacing-xs', themeTokens.spacing.xs);
    root.style.setProperty('--spacing-sm', themeTokens.spacing.sm);
    root.style.setProperty('--spacing-md', themeTokens.spacing.md);
    root.style.setProperty('--spacing-lg', themeTokens.spacing.lg);
    root.style.setProperty('--shadow-subtle', themeTokens.shadows.subtle);
    root.style.setProperty('--shadow-medium', themeTokens.shadows.medium);
    root.style.setProperty('--shadow-focus', themeTokens.shadows.focus);
    root.style.setProperty('--border-radius', themeTokens.borderRadius);
    root.style.setProperty('--transition', themeTokens.transitions);
  }, [themeTokens]);

  return (
    <ThemeContext value={value}>
      {children}
    </ThemeContext>
  );
}

// export const ThemeProvider: React.FC<{ children: React.ReactNode, initialTheme: Theme }> = ({ children }) => {
//   const [theme, setTheme] = useState<Theme>(initialTheme);

//   useEffect(() => {
//     const root = document.documentElement;

//     root.style.setProperty('--color-primary', theme.colors.primary);
//     root.style.setProperty('--color-text-primary', theme.colors.text.primary);
//     root.style.setProperty('--color-text-secondary', theme.colors.text.secondary);
//     root.style.setProperty('--color-background-base', theme.colors.background.base);
//     root.style.setProperty('--color-background-hover', theme.colors.background.hover);
//     root.style.setProperty('--color-border', theme.colors.border);
//     root.style.setProperty('--color-focus', theme.colors.focus);
//     root.style.setProperty('--spacing-xs', theme.spacing.xs);
//     root.style.setProperty('--spacing-sm', theme.spacing.sm);
//     root.style.setProperty('--spacing-md', theme.spacing.md);
//     root.style.setProperty('--spacing-lg', theme.spacing.lg);
//     root.style.setProperty('--shadow-subtle', theme.shadows.subtle);
//     root.style.setProperty('--shadow-medium', theme.shadows.medium);
//     root.style.setProperty('--shadow-focus', theme.shadows.focus);
//     root.style.setProperty('--border-radius', theme.borderRadius);
//     root.style.setProperty('--transition', theme.transitions);
//   }, [theme]);

//   return (
//     <ThemeContext.Provider value={{ theme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

export default ThemeContext;
