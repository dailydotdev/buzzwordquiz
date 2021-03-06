/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { ReactElement, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import rem from '../macros/rem.macro';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { typoCallout, typoFootnote, typoTitle3 } from '../styles/typography';
import SecondaryButton from '../components/buttons/SecondaryButton';
import RadialProgress from '../components/RadialProgress';
import colors, { ColorName } from '../styles/colors';
import TertiaryButton from '../components/buttons/TertiaryButton';
import PageContainer from '../components/PageContainer';
import useGameSession, { UnansweredQuestion } from '../hooks/useGameSession';
import useTimer from '../hooks/useTimer';
import useSound from 'use-sound';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const SubmitScore = dynamic(() => import('../components/SubmitScore'));

const Main = styled(PageContainer)`
  padding: ${rem(24)} ${rem(20)} ${rem(40)};
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${rem(32)};
`;

const Score = styled.h2`
  margin: 0;
  ${typoTitle3}
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  width: 22vh;
  max-width: ${rem(180)};
  align-self: center;
  margin-bottom: ${rem(32)};

  img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${rem(16)};
    box-shadow: var(--theme-shadow2);
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
  margin-top: auto;

  > * {
    width: ${rem(40)};
    height: ${rem(40)};
  }
`;

const progressColors: ColorName[] = ['avocado', 'cheese', 'ketchup'];

function updateArrayItem<T>(array: T[], index: number, item: T): T[] {
  return [...array.slice(0, index), item, ...array.slice(index + 1)];
}

export default function Game(): ReactElement {
  const router = useRouter();
  const [question, setQuestion] = useState<UnansweredQuestion>(null);
  const [optionsState, setOptionsState] = useState<
    { selected: boolean; letter: string }[]
  >(null);
  const [answerLetters, setAnswerLetters] = useState<string[]>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [completed, setCompleted] = useState(false);

  const [playSuccess] = useSound('/success.mp3');
  const [playFail] = useSound('/fail.mp3');
  const [playTap] = useSound('/tap.mp3');

  const [playClock, { stop: stopClock }] = useSound('/clock.mp3', {
    loop: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  const {
    session,
    startSession,
    sendAnswer,
    skipQuestion,
    completeSession,
  } = useGameSession();
  const { millisecondsLeft, quantizedProgress, lastTenSeconds } = useTimer(
    session?.duration * 1000,
    isLoading || isLoadingImage,
    3,
    () => {
      stopClock();
      setCompleted(true);
    },
  );

  useEffect(() => {
    startSession().then(({ session }) => {
      setQuestion(session.nextQuestion);
    });
  }, []);

  useEffect(() => {
    if (question) {
      setOptionsState(
        question.letters.map((option) => ({ selected: false, letter: option })),
      );
      setAnswerLetters(
        question.words.flatMap((word, index) => {
          const base: string[] = new Array(word).fill(null);
          if (index < question.words.length - 1) {
            return [...base, 'space'];
          }
          return base;
        }),
      );
    }
  }, [question]);

  useEffect(() => {
    if (lastTenSeconds) {
      playClock();
    }
  }, [lastTenSeconds]);

  const submitAnswer = async (answer: string): Promise<void> => {
    setIsLoading(true);
    const res = await sendAnswer(answer);
    setIsLoading(false);
    if (res.correct) {
      setIsLoadingImage(true);
      playSuccess();
      setQuestion(res.session.nextQuestion);
      navigator.vibrate?.(250);
    } else {
      playFail();
      navigator.vibrate?.([250, 250, 250]);
    }
  };

  const onOptionClick = (index: number): void => {
    const availableSpot = answerLetters.findIndex((letter) => !letter);
    if (availableSpot > -1) {
      playTap();
      const newAnswerLetters = updateArrayItem(
        answerLetters,
        availableSpot,
        optionsState[index].letter,
      );
      setAnswerLetters(newAnswerLetters);
      setOptionsState(
        updateArrayItem(optionsState, index, {
          ...optionsState[index],
          selected: true,
        }),
      );
      const nextSpot = newAnswerLetters.findIndex((letter) => !letter);
      if (nextSpot < 0) {
        submitAnswer(
          newAnswerLetters
            .map((letter) => (letter === 'space' ? ' ' : letter))
            .join(''),
        );
      }
    }
  };

  const onAnswerClick = (index: number): void => {
    const optionIndex = optionsState.findIndex(
      (option) => option.selected && option.letter === answerLetters[index],
    );
    if (optionIndex > -1) {
      setAnswerLetters(updateArrayItem(answerLetters, index, null));
      setOptionsState(
        updateArrayItem(optionsState, optionIndex, {
          ...optionsState[optionIndex],
          selected: false,
        }),
      );
    }
  };

  const skip = async () => {
    setIsLoadingImage(true);
    const res = await skipQuestion();
    setQuestion(res.session.nextQuestion);
  };

  const submitScore = async (name: string) => {
    const res = await completeSession(name);
    await router.push(
      `/leaderboard?sessionId=${res.sessionId}&score=${res.score}&name=${name}`,
    );
  };

  if (!question || !session) {
    return <></>;
  }

  return (
    <Main>
      {completed ? (
        <SubmitScore score={session.score} submitScore={submitScore} />
      ) : (
        <>
          <Header>
            <Score>Score: {session.score}</Score>
            <RadialProgress
              steps={session.duration * 1000}
              progress={millisecondsLeft}
              css={css`
                position: relative;
                --radial-progress-step: var(--theme-background-secondary);
                --radial-progress-completed-step: ${colors[
                  progressColors[quantizedProgress]
                ]['50']};
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
                {(millisecondsLeft / 1000).toFixed()}
              </span>
            </RadialProgress>
          </Header>
          <ImageContainer>
            <img
              src={question.logo
                .replace('/upload/', '/upload/f_auto,q_auto/')
                .replace('.jpg', '')}
              alt="Logo"
              onLoad={() => setIsLoadingImage(false)}
            />
          </ImageContainer>
          {!isLoadingImage && (
            <>
              <Letters>
                {answerLetters?.map((letter, index) =>
                  !letter ? (
                    <EmptyLetter key={index} />
                  ) : letter === 'space' ? (
                    <WrapBreak key={index} />
                  ) : (
                    <SecondaryButton
                      buttonSize="small"
                      key={letter + index}
                      onClick={() => onAnswerClick(index)}
                    >
                      {letter}
                    </SecondaryButton>
                  ),
                )}
              </Letters>
              <Options>
                {optionsState?.map((option, index) => (
                  <PrimaryButton
                    key={option.letter + index}
                    disabled={option.selected}
                    onClick={() => onOptionClick(index)}
                  >
                    {option.letter}
                  </PrimaryButton>
                ))}
              </Options>
              <TertiaryButton
                css={css`
                  margin-top: ${rem(40)};
                `}
                onClick={skip}
                disabled={session.skips >= session.maxSkips}
              >
                Skip ({session.skips}/{session.maxSkips})
              </TertiaryButton>
            </>
          )}
        </>
      )}
    </Main>
  );
}
