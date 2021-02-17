/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import React, { ReactElement } from 'react';
import styled from '@emotion/styled';
import {
  typoBody,
  typoHeadline,
  typoTitle1,
  typoTitle3,
} from '../styles/typography';
import rem from '../macros/rem.macro';
import PageContainer from '../components/PageContainer';
import DailyDevLogo from '../components/DailyDevLogo';
import PrimaryButton from '../components/buttons/PrimaryButton';
import BigEmoji from '../components/BigEmoji';
import Link from 'next/link';
import SecondaryButton from '../components/buttons/SecondaryButton';

const Main = styled(PageContainer)`
  max-height: unset;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  margin: ${rem(8)} 0 ${rem(16)};
  text-align: center;
  ${typoTitle1}
`;

const List = styled.ol`
  margin: 0;
  padding: 0 ${rem(10)};
`;

const ListItem = styled.li`
  display: grid;
  grid-template-columns: ${rem(40)} 1fr ${rem(40)};
  grid-column-gap: ${rem(8)};
  margin: ${rem(4)} 0;
  font-weight: bold;
  ${typoBody}
`;

const MyScoreTitle = styled.h2`
  margin: ${rem(32)} 0 0;
  color: var(--theme-label-primary);
  ${typoTitle3}
`;

const MyScore = styled.div`
  display: grid;
  grid-template-columns: ${rem(40)} 1fr ${rem(40)};
  grid-column-gap: ${rem(8)};
  align-items: center;
  margin: ${rem(16)} 0;
  padding: ${rem(4)} ${rem(8)};
  background: var(--theme-background-secondary);
  border-radius: ${rem(8)};
  border: ${rem(1)} solid var(--theme-divider-tertiary);
  box-shadow: var(--theme-shadow2);
  font-weight: bold;
  ${typoHeadline}
`;

const myScore = { rank: 1, name: 'Nimrod', score: 20 };

const leaderboard = [
  { name: 'Ido', score: 12 },
  { name: 'Tom', score: 8 },
  { name: 'Jack', score: 5 },
  { name: 'Gal', score: 4 },
];

const rankRepresentation = (rank: number) => {
  if (rank === 1) {
    return '🥇';
  }
  if (rank === 2) {
    return '🥈';
  }
  if (rank === 3) {
    return '🥉';
  }

  return `#${rank}`;
};

const getTwitterShareLink = (link: string, text: string): string =>
  `http://twitter.com/share?url=${encodeURIComponent(
    link,
  )}&text=${encodeURIComponent(`${text} by @dailydotdev`)}`;

export default function Index(): ReactElement {
  const share = async () => {
    const text = `I nailed ${myScore.score} logos on buzzword quiz. Let's see if you can beat me! 💩`;
    const url = 'https://buzzwordquiz.vercel.app/';
    if ('share' in navigator) {
      await navigator.share({
        text,
        url,
      });
    } else {
      window.open(getTwitterShareLink(url, text), '_blank');
    }
  };

  return (
    <Main>
      <Header>
        <a href="https://app.daily.dev/?ref=buzzwordquiz">
          <DailyDevLogo
            css={css`
              width: ${rem(88)};
            `}
          />
        </a>
        <Link href="/game" passHref>
          <SecondaryButton as="a" buttonSize="small">
            Play again
          </SecondaryButton>
        </Link>
      </Header>
      <>
        <MyScoreTitle>Your rank</MyScoreTitle>
        <MyScore>
          <div>{rankRepresentation(myScore.rank)}</div>
          <div>{myScore.name}</div>
          <div
            css={css`
              margin-left: auto;
            `}
          >
            {myScore.score}
          </div>
        </MyScore>
        <PrimaryButton onClick={share}>Challenge a friend 💩</PrimaryButton>
      </>
      <BigEmoji
        css={css`
          margin-top: ${rem(40)};
        `}
      >
        🏆
      </BigEmoji>
      <Title>Hall of Fame</Title>
      <List>
        {leaderboard.map((record, index) => (
          <ListItem value={record.score} key={index}>
            <div>{rankRepresentation(index + 1)}</div>
            <div>{record.name}</div>
            <div
              css={css`
                margin-left: auto;
              `}
            >
              {record.score}
            </div>
          </ListItem>
        ))}
      </List>
    </Main>
  );
}
