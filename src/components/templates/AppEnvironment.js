import React from 'react';

import { Global, css } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';

import useSiteMetadata from 'utils/useSiteMetadata';

import { Theme } from 'constants/themes';

export default function AppEnvironment({ children }) {
  const { theme: themeConfiguration } = useSiteMetadata();

  return (
    <ThemeProvider theme={new Theme(themeConfiguration)}>
      <Global
        styles={({ backgroundColor }) =>
          css`
            :root {
              background-color: ${backgroundColor};
            }
          `
        }
      />
      {children}
    </ThemeProvider>
  );
};