import { createContext } from 'react';

export interface EChartsThemeValues {
  theme?: string;
}

export const EChartsThemeContext = createContext<EChartsThemeValues>({
  theme: undefined,
});

EChartsThemeContext.displayName = 'EChartsThemeContext';

export const EChartsThemeProvider = EChartsThemeContext.Provider;
