import React from 'react';
import styled from '@emotion/styled';

import { pickColor } from 'constants/themes';

export default function Markdown({ children }) {
  const MarkdownContainer = styled.div`
      a {
        color: ${pickColor('hyperLink')};
      }
      p, span, small, h1, h2, h3, h4, h5, h6 {
        color: ${pickColor('foreground')};
      }
      strong {
        color: ${pickColor('accent')}
      }
      hr {
        background-color: ${pickColor('foreground')};
      }
  `;

  return (
    <MarkdownContainer dangerouslySetInnerHTML={{ __html: children }} />
  );
}