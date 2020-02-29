import * as React from 'react';
import AppEnvironment from 'components/templates/AppEnvironment';
import BaseLayout from 'components/templates/BaseLayout';

export const wrapRootElement = ({ element }) => (
  <AppEnvironment>
    {element}
  </AppEnvironment>
);

export const wrapPageElement = ({ element }) => (
  <BaseLayout>
    {element}
  </BaseLayout>
);