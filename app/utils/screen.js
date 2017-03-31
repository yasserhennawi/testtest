import breakpoints from './breakpoints';

export const getWindowDimensions = () => {
  const w = window;
  const d = document;
  const e = d.documentElement;
  const g = d.getElementsByTagName('body')[0];
  const width = w.innerWidth || e.clientWidth || g.clientWidth;
  const height = w.innerHeight || e.clientHeight || g.clientHeight;

  return {
    width,
    height,
  };
};

export const getWindowHeight = () => getWindowDimensions().height;

export const getWindowWidth = () => getWindowDimensions().width;

export const isXSScreen = () => getWindowWidth() < breakpoints.sm;

export const isSMScreen = () => getWindowWidth() >= breakpoints.sm && getWindowWidth() < breakpoints.md;

export const isMDScreen = () => getWindowWidth() >= breakpoints.md && getWindowWidth() < breakpoints.lg;

export const isLGScreen = () => getWindowWidth() >= breakpoints.lg && getWindowWidth() < breakpoints.xl;

export const isXLScreen = () => getWindowWidth() >= breakpoints.xl;
