import 'typeface-montserrat';
import 'typeface-merriweather';
import * as React from 'react';
import { Global, css } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import useSiteMetadata from 'utils/useSiteMetadata';
import Theme from 'utils/theme';
import 'array.prototype.flat';

export default function AppEnvironment({ children }) {
  const { theme: themeConfiguration } = useSiteMetadata();

  return (
    <ThemeProvider theme={new Theme(themeConfiguration)}>
      <Global
        styles={buildGlobalStyle}
      />
      {children}
    </ThemeProvider>
  );
};

const buildGlobalStyle = ({ backgroundColor }) =>
  css`
    :root {
      background-color: ${backgroundColor};
    }
    
    code[class*="language-"],
    pre[class*="language-"] {
      font-family: Consolas, Menlo, Monaco, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", "Courier New", Courier, monospace;
      font-size: 1em;
      line-height: 1.5;
      direction: ltr;
      text-align: left;
      white-space: pre;
      word-spacing: normal;
      word-break: normal;
      word-wrap: normal;

      -moz-tab-size: 4;
      -o-tab-size: 4;
      tab-size: 4;

      -webkit-hyphens: none;
      -moz-hyphens: none;
      -ms-hyphens: none;
      hyphens: none;
      background: #24242e;
      color: #767693;
    }

    pre > code[class*="language-"] {
      font-size: 1em;
    }

    pre[class*="language-"]::-moz-selection, pre[class*="language-"] ::-moz-selection,
    code[class*="language-"]::-moz-selection, code[class*="language-"] ::-moz-selection {
      text-shadow: none;
      background: #5151e6;
    }

    pre[class*="language-"]::selection, pre[class*="language-"] ::selection,
    code[class*="language-"]::selection, code[class*="language-"] ::selection {
      text-shadow: none;
      background: #5151e6;
    }

    pre[class*="language-"] {
      padding: 1em;
      margin: .5em 0;
      overflow: auto;
      border-radius: 0.3em;
    }

    :not(pre) > code[class*="language-"] {
      padding: .1em;
      border-radius: .3em;
      white-space: normal;
    }

    .token.comment,
    .token.prolog,
    .token.doctype,
    .token.cdata {
      color: #5b5b76;
    }

    .token.punctuation {
      color: #5b5b76;
    }

    .token.namespace {
      opacity: .7;
    }

    .token.tag,
    .token.operator,
    .token.number {
      color: #dd672c;
    }

    .token.property,
    .token.function {
      color: #767693;
    }

    .token.tag-id,
    .token.selector,
    .token.atrule-id {
      color: #ebebff;
    }

    code.language-javascript,
    .token.attr-name {
      color: #aaaaca;
    }

    code.language-css,
    code.language-scss,
    .token.boolean,
    .token.string,
    .token.entity,
    .token.url,
    .language-css .token.string,
    .language-scss .token.string,
    .style .token.string,
    .token.attr-value,
    .token.keyword,
    .token.control,
    .token.directive,
    .token.unit,
    .token.statement,
    .token.regex,
    .token.atrule {
      color: #fe8c52;
    }

    .token.placeholder,
    .token.variable {
      color: #fe8c52;
    }

    .token.deleted {
      text-decoration: line-through;
    }

    .token.inserted {
      border-bottom: 1px dotted #ebebff;
      text-decoration: none;
    }

    .token.italic {
      font-style: italic;
    }

    .token.important,
    .token.bold {
      font-weight: bold;
    }

    .token.important {
      color: #aaaaca;
    }

    .token.entity {
      cursor: help;
    }

    pre > code.highlight {
      outline: .4em solid #7676f4;
      outline-offset: .4em;
    }

    .gatsby-highlight-code-line {
      background: rgba(221, 103, 44, 0.2);
      background: -webkit-linear-gradient(left, rgba(221, 103, 44, 0.2) 70%, rgba(221, 103, 44, 0));
      background: linear-gradient(to right, rgba(221, 103, 44, 0.2) 70%, rgba(221, 103, 44, 0));
      border-left: 0.25em solid rgba(221, 103, 44, 0.5);
      display: block;
      margin-right: -1em;
      margin-left: -1em;
      padding-right: 1em;
      padding-left: 0.75em;
    }
    
    body {
      word-break: keep-all;
    }
  `;