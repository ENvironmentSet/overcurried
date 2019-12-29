import 'typeface-montserrat';
import 'typeface-merriweather';
import 'prismjs/themes/prism-okaidia.css';

import React from 'react';

import AppEnvironment from 'components/templates/AppEnvironment';

export const wrapPageElement = ({ element }) => {
  return (
    <AppEnvironment>
      {element}
    </AppEnvironment>
  );
};