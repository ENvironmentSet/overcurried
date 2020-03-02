import * as React from 'react';
import AppEnvironment from 'components/templates/AppEnvironment';
import BaseLayout from 'components/templates/BaseLayout';
import { nameComponent } from 'utils/nameComponent';
import { getComponentName } from 'utils/getComponentName';

function toWrapper(Component) {
  return nameComponent(
    ({ element }) => (
      <Component>
        {element}
      </Component>
    ),
    `WrapElementWith${getComponentName(Component)}`
  );
}

export const wrapRootElement = toWrapper(AppEnvironment);
export const wrapPageElement = toWrapper(BaseLayout);