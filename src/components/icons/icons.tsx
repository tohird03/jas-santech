// import {ReactComponent as Logo} from './icon-files/logo.svg';
import {makeIcon} from './make-icon';
import {paths} from './paths';

export const Icons = {
  ArrowDown: makeIcon(paths.arrowPrev, 12, 8, 'rotate(-90, 4, 4)'),
  ArrowNext: makeIcon(paths.arrowPrev, 8, 12, 'rotate(180, 4, 6)'),
  ArrowPrev: makeIcon(paths.arrowPrev, 7, 12),
  ArrowUp: makeIcon(paths.arrowPrev, 12, 8, 'rotate(90, 6, 6)'),
  Logo: makeIcon(paths.logo, 69, 46),
  Breadcrumb: makeIcon(paths.breadcrumb, 30, 30),
} as const;
