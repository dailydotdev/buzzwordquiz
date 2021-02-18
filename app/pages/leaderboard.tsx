/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import React, { ReactElement, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import useSWR from 'swr';
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
import { useRouter } from 'next/router';

const Main = styled(PageContainer)`
  padding: ${rem(20)};
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetcher = (input: RequestInfo, init?: RequestInit): Promise<any> =>
  fetch(input, init).then((res) => res.json());

const getTwitterShareLink = (link: string, text: string): string =>
  `http://twitter.com/share?url=${encodeURIComponent(
    link,
  )}&text=${encodeURIComponent(`${text} by @dailydotdev`)}`;

type LeaderboardRow = {
  id: string;
  name: string;
  date: string;
  score: number;
};

export default function Index(): ReactElement {
  const router = useRouter();

  const [currentSession, setCurrentSession] = useState<{
    sessionId: string;
    name: string;
    score: number;
  }>(null);
  const [myScore, setMyScore] = useState<{
    rank: number;
    name: string;
    score: number;
  }>(null);
  const { data } = useSWR<{ leaderboard: LeaderboardRow[] }>(
    '/api/leaderboard',
    fetcher,
  );

  useEffect(() => {
    if (router.query.sessionId) {
      setCurrentSession({
        sessionId: router.query.sessionId.toString(),
        name: router.query.name.toString(),
        score: parseInt(router.query.score.toString()),
      });
      router.replace('/leaderboard', undefined, { shallow: true });
    }
  }, [router.query]);

  useEffect(() => {
    if (currentSession) {
      if (data?.leaderboard) {
        const myRank = data.leaderboard.findIndex(
          (leader) => leader.id === currentSession.sessionId,
        );
        if (myRank > -1) {
          setMyScore({
            score: data.leaderboard[myRank].score,
            name: data.leaderboard[myRank].name,
            rank: myRank + 1,
          });
          return;
        }
      }
      setMyScore({
        rank: 0,
        name: currentSession.name,
        score: currentSession.score,
      });
    }
  }, [data, currentSession]);

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
      {data?.leaderboard && (
        <>
          {myScore && (
            <>
              <MyScoreTitle>Your rank</MyScoreTitle>
              <MyScore>
                <div>
                  {myScore.rank > 0 ? rankRepresentation(myScore.rank) : 'N/A'}
                </div>
                <div>{myScore.name}</div>
                <div
                  css={css`
                    margin-left: auto;
                  `}
                >
                  {myScore.score}
                </div>
              </MyScore>
              <PrimaryButton onClick={share}>
                Challenge a friend 💩
              </PrimaryButton>
            </>
          )}
          <BigEmoji
            css={css`
              margin-top: ${rem(40)};
            `}
          >
            🏆
          </BigEmoji>
          <Title>Hall of Fame</Title>
          <List>
            {data?.leaderboard.map((record, index) => (
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
        </>
      )}
    </Main>
  );
}
