import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

export type Theme = 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme?: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme] = useState<Theme>('dark');

  useEffect(() => {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.style.colorScheme = 'dark';

    // Normalize any legacy stored preference to dark theme
    try {
      const saved = localStorage.getItem('workflowx_preferences');
      if (saved) {
        const preferences = JSON.parse(saved);
        if (preferences.theme !== 'dark') {
          preferences.theme = 'dark';
          localStorage.setItem(
            'workflowx_preferences',
            JSON.stringify(preferences)
          );
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const setTheme = () => {
    // Only dark theme is supported
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
};
