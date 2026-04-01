/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-array-index-key */
import './background-animate.scss';

import React from 'react';
import LogoPng from '@/assets/img/logo.png';

type Props = {
  count?: number;
};

export const BackgroundAnimate = ({count = 5}: Props) => {
  const countArr = [...new Array(count)];

  return (
    <ul className="background-animate">
      {countArr.map((_, index) => (
        <li key={`woodline-${index}`} className="background-animate__li">
          <img
            src={LogoPng}
            alt="woodline logo"
            width={80}
            height={50}
          />
        </li>
      ))}
    </ul>
  );
};
