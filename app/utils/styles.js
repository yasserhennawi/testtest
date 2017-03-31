import { css } from 'styled-components';
import breakpoints from './breakpoints';

// use ${unit} in breakpoints to work properly cross-browser and support users
// changing their browsers font-size: https://zellwk.com/blog/media-query-units/
const pxToEm = (px) => `${px / 16}em`;

export const addSpacings = ({ verticalPadding, horizontalPadding }, type) => {
  const get = (paddings, screen) => typeof paddings === 'object' ? paddings[screen] : (paddings || 0);

  return `
    @media(min-width: ${pxToEm(breakpoints.xl)}) {
      ${type}: ${get(verticalPadding, 'xl')}px ${get(horizontalPadding, 'xl')}px;
    }
    @media(max-width: ${pxToEm(breakpoints.xl)}) {
      ${type}: ${get(verticalPadding, 'lg')}px ${get(horizontalPadding, 'lg')}px;
    }
    @media(max-width: ${pxToEm(breakpoints.lg)}) {
      ${type}: ${get(verticalPadding, 'md')}px ${get(horizontalPadding, 'md')}px;
    }
    @media(max-width: ${pxToEm(breakpoints.md)}) {
      ${type}: ${get(verticalPadding, 'sm')}px ${get(horizontalPadding, 'sm')}px;
    }
    @media(max-width: ${pxToEm(breakpoints.sm)}) {
      ${type}: ${get(verticalPadding, 'xs')}px ${get(horizontalPadding, 'xs')}px;
    }
  `;
};

export const addPaddings = ({ verticalPadding, horizontalPadding }) =>
  addSpacings({ verticalPadding, horizontalPadding }, 'padding');

export const addMargins = ({ verticalPadding, horizontalPadding }) =>
  addSpacings({ verticalPadding, horizontalPadding }, 'margin');

export const media = {
  xs: (...args) => css`
    @media(max-width: ${pxToEm(breakpoints.sm)}) {
      ${css(...args)}
    }
  `,
  sm: (...args) => css`
    @media(max-width: ${pxToEm(breakpoints.md)}) {
      ${css(...args)}
    }
  `,
  md: (...args) => css`
    @media(max-width: ${pxToEm(breakpoints.lg)}) {
      ${css(...args)}
    }
  `,
  lg: (...args) => css`
    @media(max-width: ${pxToEm(breakpoints.xl)}) {
      ${css(...args)}
    }
  `,
  xl: (...args) => css`
    @media(min-width: ${pxToEm(breakpoints.xl)}) {
      ${css(...args)}
    }
  `,
};
