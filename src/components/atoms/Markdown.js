import * as React from 'react';
import styled from '@emotion/styled';
import { rhythm } from 'utils/typography';
import Theme from 'utils/theme';

export default function Markdown({ children }) {
  const MarkdownContainer = styled.div`
      a {
        color: ${Theme.pickColor('hyperLink')};
      }
      p, span, small, h1, h2, h3, h4, h5, h6, li, th, td {
        color: ${Theme.pickColor('foreground')};
      }
      strong {
        color: ${Theme.pickColor('accent')}
      }
      hr {
        background-color: ${Theme.pickColor('foreground')};
      }
      blockquote {
        margin-left: 0;
        border-left-color: ${Theme.pickColor('foreground')};
      }
      th, td {
        border-color: ${Theme.pickColor('foreground')};
      }
      ol {
        margin-left: ${rhythm(0.4)};
      }
      ul {
        margin-left: ${rhythm(0.7)};
      }
  `;

  return (
    <MarkdownContainer dangerouslySetInnerHTML={{ __html: children }} />
  );
}