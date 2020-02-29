import React from 'react';

import AppEnvironment from 'components/templates/AppEnvironment';

export const wrapRootElement = ({ element }) => (
  <AppEnvironment>
    {element}
  </AppEnvironment>
);