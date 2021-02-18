/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ReactElement, useEffect, useState } from 'react';
import Confetti from 'react-dom-confetti';
import BigEmoji from './BigEmoji';
import TextField from './fields/TextField';
import PrimaryButton from './buttons/PrimaryButton';
import rem from '../macros/rem.macro';
import styled from '@emotion/styled';
import { typoFootnote, typoMega3 } from '../styles/typography';

const confettiConfig = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: 70,
  dragFriction: 0.12,
  duration: 3000,
  stagger: 3,
  width: rem(10),
  height: rem(10),
  perspective: rem(500),
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
};

const Score = styled.h2`
  margin: ${rem(16)} 0 ${rem(48)};
  text-align: center;
  ${typoMega3}
`;

const Hint = styled.div`
  margin: ${rem(32)} ${rem(12)} ${rem(8)};
  color: var(--theme-label-quaternary);
  ${typoFootnote}
`;

export type SubmitScoreProps = {
  score: number;
  submitScore: (name: string) => unknown;
};

export default function SubmitScore({
  score,
  submitScore,
}: SubmitScoreProps): ReactElement {
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  const onClick = () => {
    setLoading(true);
    submitScore(name);
  };

  return (
    <>
      <BigEmoji>🎉</BigEmoji>
      <Score>Your score: {score}</Score>
      <Hint>Fill in your nickname to enter our hall of fame</Hint>
      <TextField
        inputId="nickname"
        label="Nickname"
        required
        maxLength={20}
        valueChanged={setName}
        validityChanged={setValid}
      />
      <PrimaryButton
        disabled={!valid}
        onClick={onClick}
        loading={loading}
        css={css`
          margin-top: ${rem(32)};
          align-self: center;
        `}
      >
        For fame and glory 🎖
      </PrimaryButton>
      <Confetti active={showConfetti} config={confettiConfig} />
    </>
  );
}
