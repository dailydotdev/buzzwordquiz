import { ReactElement } from 'react';
import BaseButton, { ButtonProps, StyledButtonProps } from './BaseButton';
import colors, {
  ColorName,
  overlayQuaternary,
  overlayTertiary,
} from '../../styles/colors';
import { shadow2, shadow3 } from '../../styles/shadows';

export const secondaryStyle = (color?: ColorName): StyledButtonProps => ({
  darkStates: {
    default: {
      color: 'var(--theme-label-primary)',
      background: 'none',
      borderColor: 'var(--theme-label-primary)',
    },
    hover: {
      color: color ? colors[color]['40'] : undefined,
      background: color ? overlayQuaternary(color) : `${colors.salt['90']}1F`,
      borderColor: color ? colors[color]['40'] : undefined,
      shadow: color
        ? shadow3(`${colors[color]['50']}66`)
        : 'var(--theme-shadow3)',
    },
    active: {
      color: color ? colors[color]['40'] : undefined,
      background: color ? overlayTertiary(color) : `${colors.salt['90']}33`,
      borderColor: color ? colors[color]['40'] : undefined,
      shadow: color
        ? shadow2(`${colors[color]['50']}A3`)
        : 'var(--theme-shadow2)',
    },
    pressed: {
      color: 'var(--theme-label-invert)',
      background: color ? colors[color]['40'] : '#FFFFFF',
      borderColor: 'transparent',
    },
    disabled: {
      borderColor: `${colors.salt['90']}33`,
      color: 'var(--theme-label-disabled)',
    },
  },
  lightStates: {
    hover: {
      color: color ? colors[color]['60'] : undefined,
      background: color ? overlayQuaternary(color) : `${colors.pepper['10']}1F`,
      borderColor: color ? colors[color]['60'] : undefined,
    },
    active: {
      color: color ? colors[color]['60'] : undefined,
      background: color ? overlayTertiary(color) : `${colors.pepper['10']}33`,
      borderColor: color ? colors[color]['60'] : undefined,
    },
    pressed: {
      background: color ? colors[color]['60'] : colors.pepper['90'],
    },
    disabled: {
      borderColor: `${colors.pepper['10']}33`,
    },
  },
});

export default function SecondaryButton<
  Tag extends keyof JSX.IntrinsicElements
>(props: ButtonProps<Tag>): ReactElement {
  const style = secondaryStyle(props.themeColor);
  return BaseButton<Tag>({
    ...props,
    ...style,
  });
}
