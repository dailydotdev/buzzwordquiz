import normalize from 'emotion-normalize';
import colors, { overlayQuaternary } from './colors';
import { shadow2, shadow3 } from './shadows';
import { css } from '@emotion/react';

export default css`
  ${normalize}

  html {
    font-family: -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Ubuntu,
      Segoe UI, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
      Segoe UI Symbol;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--theme-background-primary);
    color: var(--theme-label-primary);
  }

  /* stylelint-disable-next-line no-descending-specificity */
  html,
  html.light .invert,
  html .invert .invert {
    --theme-active: ${colors.salt['90']}33;
    --theme-focus: ${colors.blueCheese['40']};
    --theme-float: ${colors.salt['90']}14;
    --theme-hover: ${colors.salt['90']}1F;

    --theme-background-primary: ${colors.pepper['90']};
    --theme-background-secondary: ${colors.pepper['70']};
    --theme-background-tertiary: ${colors.pepper['80']};

    --theme-label-primary: #ffffff;
    --theme-label-secondary: ${colors.salt['50']};
    --theme-label-tertiary: ${colors.salt['90']};
    --theme-label-quaternary: ${colors.salt['90']}A3;
    --theme-label-disabled: ${colors.salt['90']}52;
    --theme-label-link: ${colors.water['20']};
    --theme-label-invert: ${colors.pepper['90']};

    --theme-divider-primary: ${colors.salt['90']};
    --theme-divider-secondary: ${colors.salt['90']}66;
    --theme-divider-tertiary: ${colors.salt['90']}33;
    --theme-divider-quaternary: ${colors.salt['90']}14;

    --theme-status-error: ${colors.ketchup['40']};
    --theme-status-help: ${colors.cheese['40']};
    --theme-status-success: ${colors.avocado['40']};

    --theme-shadow2: ${shadow2('#00000066')};
    --theme-shadow3: ${shadow3('#000000A3')};

    --theme-post-disabled: ${colors.pepper['70']}66;

    --theme-overlay-quaternary: ${overlayQuaternary('white')};
  }

  /* stylelint-disable-next-line no-descending-specificity */
  html.light,
  html .invert,
  html.light .invert .invert {
    --theme-active: ${colors.pepper['10']}33;
    --theme-focus: ${colors.blueCheese['60']};
    --theme-float: ${colors.pepper['10']}14;
    --theme-hover: ${colors.pepper['10']}1F;

    --theme-background-primary: #ffffff;
    --theme-background-secondary: ${colors.salt['10']};
    --theme-background-tertiary: ${colors.salt['20']};

    --theme-label-primary: ${colors.pepper['90']};
    --theme-label-secondary: ${colors.pepper['50']};
    --theme-label-tertiary: ${colors.pepper['10']};
    --theme-label-quaternary: ${colors.pepper['10']}A3;
    --theme-label-disabled: ${colors.pepper['10']}52;
    --theme-label-link: ${colors.water['80']};
    --theme-label-invert: #ffffff;

    --theme-divider-primary: ${colors.pepper['10']};
    --theme-divider-secondary: ${colors.pepper['10']}66;
    --theme-divider-tertiary: ${colors.pepper['10']}33;
    --theme-divider-quaternary: ${colors.pepper['10']}14;

    --theme-status-error: ${colors.ketchup['60']};
    --theme-status-help: ${colors.cheese['60']};
    --theme-status-success: ${colors.avocado['60']};

    --theme-shadow2: ${shadow2(`${colors.salt['90']}66`)};
    --theme-shadow3: ${shadow3(`${colors.salt['90']}A3`)};

    --theme-post-disabled: #ffffff66;

    --theme-overlay-quaternary: ${overlayQuaternary('pepper')};
  }

  * {
    box-sizing: border-box;
    flex-shrink: 0;
  }

  #__next {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: stretch;
  }
`;
