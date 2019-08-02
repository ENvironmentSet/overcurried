import React from 'react';

import AppEnvironment from 'components/templates/AppEnvironment';

export const wrapPageElement = ({ element }) => {
  return (
    <AppEnvironment>
      {element}
    </AppEnvironment>
  );
};