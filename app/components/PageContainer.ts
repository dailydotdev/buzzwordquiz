import styled from '@emotion/styled';
import rem from '../macros/rem.macro';

const PageContainer = styled.main`
  display: flex;
  width: 100%;
  max-width: ${rem(375)};
  height: 100%;
  max-height: ${rem(815)};
  margin: auto;
  flex-direction: column;
  align-self: stretch;
  padding: ${rem(40)};
`;

export default PageContainer;
