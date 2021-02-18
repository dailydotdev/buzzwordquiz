import styled from '@emotion/styled';
import rem from '../macros/rem.macro';
import { typoFootnote } from '../styles/typography';

const Credit = styled.a`
  margin-bottom: ${rem(16)};
  align-self: center;
  color: var(--theme-label-tertiary);
  text-decoration: underline;
  ${typoFootnote}
`;

export default Credit;
