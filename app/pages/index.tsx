import React, { ReactElement } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { typoCallout, typoFootnote } from '../styles/typography';
import rem from '../macros/rem.macro';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import PageContainer from '../components/PageContainer';

const ImageContainer = styled.div`
  position: relative;

  img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:before {
    content: '';
    display: block;
  }
`;

const BrandImage = styled(ImageContainer)`
  width: 70%;
  align-self: center;
  margin: 0;

  &:before {
    padding-top: 70%;
  }
`;

const CoverImage = styled(ImageContainer)`
  margin: ${rem(32)} ${rem(-40)};

  &:before {
    padding-top: 48%;
  }
`;

const Main = styled(PageContainer)`
  padding-top: ${rem(20)};
  padding-bottom: ${rem(20)};

  > a {
    margin: ${rem(16)} 0;
  }
`;

const Subtitle = styled.h2`
  margin: 0 0 auto;
  color: var(--theme-label-secondary);
  font-weight: normal;
  text-align: center;
  ${typoCallout}
`;

const Credit = styled.a`
  margin-bottom: ${rem(16)};
  align-self: center;
  color: var(--theme-label-tertiary);
  text-decoration: underline;
  ${typoFootnote}
`;

export default function Index(): ReactElement {
  return (
    <Main>
      <BrandImage>
        <img
          src="https://daily-now-res.cloudinary.com/image/upload/f_auto,q_auto/v1613675218/Buzzword_quiz_pgcvvq"
          alt="Buzzword Quiz"
        />
      </BrandImage>
      <CoverImage>
        <img
          src="https://daily-now-res.cloudinary.com/image/upload/f_auto,q_auto/v1613673783/Cover_10_fupmqb"
          alt="Cover image"
        />
      </CoverImage>
      <Subtitle>
        Have a good sense for developer logos? Take a quiz to show off your
        skills 🎸
      </Subtitle>
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
      <Credit href="https://app.daily.dev/?ref=buzzwordquiz">
        Made with ❤️ by daily.dev
      </Credit>
    </Main>
  );
}
