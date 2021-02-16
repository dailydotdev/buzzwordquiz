/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { ReactElement } from 'react';
import { typoTitle1 } from '../styles/typography';

export default function Index(): ReactElement {
  return (
    <div
      css={css`
        ${typoTitle1}
      `}
    >
      Hello world
    </div>
  );
}
