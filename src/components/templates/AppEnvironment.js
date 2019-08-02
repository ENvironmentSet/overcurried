import React from 'react';

import { Global, css } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';

import useSiteMetadata from 'utils/useSiteMetadata';

import themes from 'constants/themes';

export default function AppEnvironment({ children }) {
  const { theme: selectedTheme } = useSiteMetadata();
  const theme = themes[selectedTheme];

  return (
    <ThemeProvider theme={theme}>
      <Global
        styles={
          css`
           :root {
              background-color: ${theme.backgroundColor};
            }
          `
        }
      />
      {children}
    </ThemeProvider>
  );
};