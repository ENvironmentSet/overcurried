import styled from '@emotion/styled';

import { pickColor } from 'constants/themes';

export const Text = styled.p`
  color: ${pickColor('foreground')};
`;
export default Text;
export const H1Text = Text.withComponent('h1');
export const H3Text = Text.withComponent('h3');
export const SmallText = Text.withComponent('small');