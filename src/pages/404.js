import * as React from 'react';
import SEO from 'components/templates/SEO';
import BaseLayout from 'components/templates/BaseLayout';
import HyperLink from 'components/atoms/HyperLink';
import { Text, H1Text } from 'components/atoms/Text';
import Accent from 'components/atoms/Accent';

export default function NotFoundPage() {
  function NotFoundMessage() {
    return (
      <>
        <H1Text>Not Found</H1Text>
        <Text>
          Oops, My route function has produced
          {' '}
          <Accent>
            <HyperLink to='https://wiki.haskell.org/Bottom'>⊥</HyperLink>
          </Accent>,
          You should check your <HyperLink to='https://en.wikipedia.org/wiki/Uniform_Resource_Identifier'>URI</HyperLink>.
        </Text>
      </>
    );
  }

  return (
    <BaseLayout>
      <SEO
        title='404: Not Found'
        description='Oops, My route function has produced ⊥, You should check your URI'
      />
      <NotFoundMessage />
    </BaseLayout>
  );
};