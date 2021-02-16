/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { ReactElement } from 'react';
import styled from '@emotion/styled';
import { typoHeadline, typoTitle1 } from '../styles/typography';
import rem from '../macros/rem.macro';
import PageContainer from '../components/PageContainer';

const Main = styled(PageContainer)`
  max-height: unset;
`;

const Title = styled.h1`
  margin: 0 0 ${rem(32)};
  text-align: center;
  ${typoTitle1}
`;

const List = styled.ol`
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  display: grid;
  grid-template-columns: ${rem(40)} 1fr ${rem(40)};
  grid-column-gap: ${rem(8)};
  margin: ${rem(4)} 0;
  font-weight: bold;
  ${typoHeadline}
`;

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

export default function Index(): ReactElement {
  return (
    <Main>
      <Title>Hall of Fame 🏆</Title>
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
