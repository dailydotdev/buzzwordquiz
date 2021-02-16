import React, { forwardRef, LegacyRef, ReactElement, ReactNode } from 'react';
import styled from '@emotion/styled';
import sizeN from '../macros/sizeN.macro';

const TWO_PI = 2 * Math.PI;

const radius = 22;
const center = 24;
const circumference = TWO_PI * radius;

const Container = styled.div`
  width: 1em;
  height: 1em;
  font-size: ${sizeN(12)};
  overflow: hidden;

  svg {
    width: 100%;
    height: 100%;
  }

  circle {
    stroke-width: 4;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    stroke: var(--radial-progress-step);

    &.completed {
      stroke: var(--radial-progress-completed-step);
      transform: rotate(90deg);
      transform-origin: center;
      transition: stroke-dashoffset 0.1s ease-out;
    }
  }
`;

export type RadialProgressProps = {
  progress: number;
  steps: number;
  className?: string;
  children?: ReactNode;
};

export default forwardRef(function RadialProgress(
  { progress, steps, children, ...props }: RadialProgressProps,
  ref: LegacyRef<HTMLDivElement>,
): ReactElement {
  const progressRatio = steps > 0 ? progress / steps : 1;

  return (
    <Container
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={steps}
      ref={ref}
      {...props}
    >
      <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <circle r={radius} cx={center} cy={center} />
        <circle
          r={radius}
          cx={center}
          cy={center}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progressRatio)}
          className="completed"
        />
      </svg>
      {children}
    </Container>
  );
});
