import * as React from 'react';
import AppEnvironment from 'components/templates/AppEnvironment';
import BaseLayout from 'components/templates/BaseLayout';
import { nameComponent } from 'utils/nameComponent';

function toWrapper(Component) {
  return nameComponent(
    ({ element }) => (
      <Component>
        {element}
      </Component>
    ),
    typeof Component.displayName === 'string' ? Component.displayName : Component.name
  );
}

export const wrapRootElement = toWrapper(AppEnvironment);
export const wrapPageElement = toWrapper(BaseLayout);