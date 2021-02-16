/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { ReactElement } from 'react';
import styled from '@emotion/styled';
import rem from '../macros/rem.macro';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { typoCallout, typoFootnote } from '../styles/typography';
import SecondaryButton from '../components/buttons/SecondaryButton';
import RadialProgress from '../components/RadialProgress';
import colors, { ColorName } from '../styles/colors';
import TertiaryButton from '../components/buttons/TertiaryButton';
import PageContainer from '../components/PageContainer';

const Main = styled(PageContainer)`
  padding: ${rem(40)} ${rem(20)};
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  width: 30vh;
  max-width: ${rem(256)};
  align-items: center;
  justify-content: center;
  align-self: center;
  overflow: hidden;
  margin-bottom: ${rem(32)};
  border-radius: ${rem(16)};
  background: var(--theme-label-primary);
  box-shadow: var(--theme-shadow2);

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
    padding-top: 100%;
  }
`;

const Letters = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: ${rem(-4)} ${rem(-2)};
  align-self: center;
  font-weight: bold;
  ${typoFootnote}

  > * {
    width: ${rem(32)};
    height: ${rem(32)};
    margin: ${rem(4)} ${rem(2)};
    box-sizing: border-box;
  }
`;

const EmptyLetter = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${rem(8)};
  background: var(--theme-background-secondary);
  border: ${rem(1)} solid var(--theme-divider-tertiary);
`;

const WrapBreak = styled.span`
  flex-basis: 100%;
  width: unset;
  height: 0;
`;

const Options = styled(Letters)`
  max-width: ${rem(256)};
  margin-top: auto;
`;

const words = [5];
const options = ['R', 'E', 'D', 'I', 'S', 'A', 'B', 'C', 'D', 'E'];
const progress = 80;

export default function Game(): ReactElement {
  const answerLetters = words.flatMap((word, index) => {
    const base: string[] = new Array(word).fill(null);
    if (index < words.length - 1) {
      return [...base, 'space'];
    }
    return base;
  });
  answerLetters[0] = 'R';
  answerLetters[1] = 'E';

  const progressColor: ColorName = 'avocado';

  return (
    <Main>
      <RadialProgress
        steps={90}
        progress={progress}
        css={css`
          position: relative;
          align-self: flex-end;
          margin-right: ${rem(16)};
          margin-bottom: ${rem(32)};
          --radial-progress-step: var(--theme-background-secondary);
          --radial-progress-completed-step: ${colors[progressColor]['50']};
        `}
      >
        <span
          css={css`
            display: flex;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            ${typoCallout}
          `}
        >
          {progress}
        </span>
      </RadialProgress>
      <ImageContainer>
        <img src="https://daily-now-res.cloudinary.com/image/upload/v1611565802/logos/dd2e9bdf8f9e4d0f8e0a48063f3f36c9.jpg" />
      </ImageContainer>
      <Letters>
        {answerLetters.map((letter, index) =>
          !letter ? (
            <EmptyLetter key={index} />
          ) : letter === 'space' ? (
            <WrapBreak key={index} />
          ) : (
            <SecondaryButton buttonSize="small" key={index}>
              {letter}
            </SecondaryButton>
          ),
        )}
      </Letters>
      <Options>
        {options.map((letter, index) => (
          <PrimaryButton buttonSize="small" key={index} disabled={index < 2}>
            {letter}
          </PrimaryButton>
        ))}
      </Options>
      <TertiaryButton
        css={css`
          margin-top: ${rem(40)};
        `}
      >
        Skip (0/5)
      </TertiaryButton>
    </Main>
  );
}
