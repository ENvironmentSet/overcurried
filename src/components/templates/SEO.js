import React from 'react';

import Helmet from 'react-helmet';
import { useLocation } from '@reach/router'

import useSiteMetadata from 'utils/useSiteMetadata';

function adaptMetaInformation(metaInformation) {
  function _adaptMetaInformation(withPrefix, metaInformation) {
    function buildWithPrefix(prefix) {
      return name => withPrefix(`${prefix}:${name}`);
    }

    return Object.entries(metaInformation).map(([name, content]) =>
      typeof content === 'object' ?
        _adaptMetaInformation(buildWithPrefix(name), content) :
        { name: withPrefix(name), content }
    );
  }

  return _adaptMetaInformation(x => x, metaInformation).flat(Infinity);
}

function mergeObject(x, y) {
  return [
    ...adaptMetaInformation(x),
    ...adaptMetaInformation(y)
  ];
}

export default function SEO({ description, title, type = 'website', keywords = '', additionalMetaInfo = {} }) {
  const { author, title: siteTitle, social: { twitter }, locale } = useSiteMetadata();
  const { href, pathname: path } = useLocation();
  const defaultMetaInfo = {
    description,
    author,
    keywords,
    og: {
      title,
      url: `${href}${path}`,
      description,
      site_name: siteTitle,
      type,
      locale: locale.join('-')
    },
    twitter: {
      card: 'summary',
      creator: `@${twitter}`,
      title,
      description
    },
  };
  const metaInfo = mergeObject(defaultMetaInfo, additionalMetaInfo);

  return (
    <Helmet
      htmlAttributes={{ lang: locale[0] }}
      title={title}
      titleTemplate={`%s | ${siteTitle}`}
      meta={metaInfo}
    />
  );
};