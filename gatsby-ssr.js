import React from 'react';

import AppEnvironment from 'components/templates/AppEnvironment';

export const wrapRootElement = ({ element }) => {
  return (
    <AppEnvironment>
      {element}
    </AppEnvironment>
  );
};