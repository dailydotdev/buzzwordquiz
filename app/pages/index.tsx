import React, { ReactElement } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { typoTitle1 } from '../styles/typography';
import rem from '../macros/rem.macro';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import PageContainer from '../components/PageContainer';

const Main = styled(PageContainer)`
  > a {
    margin: ${rem(16)} 0;
  }
`;

const Title = styled.h1`
  margin: 0 0 auto;
  text-align: center;
  ${typoTitle1}
`;

export default function Index(): ReactElement {
  return (
    <Main>
      <Title>Buzzword Quiz</Title>
      <Link href="/game" passHref>
        <PrimaryButton as="a" buttonSize="large">
          {`Let's roll! 🕹`}
        </PrimaryButton>
      </Link>
      <Link href="/leaderboard" passHref>
        <SecondaryButton as="a" buttonSize="large">
          Leaderboard please... 🍿
        </SecondaryButton>
      </Link>
    </Main>
  );
}
