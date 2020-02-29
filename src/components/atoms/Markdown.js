import * as React from 'react';
import styled from '@emotion/styled';
import { rhythm } from 'utils/typography';
import { pickColor } from 'constants/themes';

export default function Markdown({ children }) {
  const MarkdownContainer = styled.div`
      a {
        color: ${pickColor('hyperLink')};
      }
      p, span, small, h1, h2, h3, h4, h5, h6, li, th, td {
        color: ${pickColor('foreground')};
      }
      strong {
        color: ${pickColor('accent')}
      }
      hr {
        background-color: ${pickColor('foreground')};
      }
      blockquote {
        margin-left: 0;
        border-left-color: ${pickColor('foreground')};
      }
      th, td {
        border-color: ${pickColor('foreground')};
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