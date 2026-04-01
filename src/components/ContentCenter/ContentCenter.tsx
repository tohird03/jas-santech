import React from 'react';
import classnames from 'classnames';
import classnamesBind from 'classnames/bind';
import styles from './content-center.scss';

const cn = classnamesBind.bind(styles);

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const ContentCenter: React.FC<Props> = ({children, className}) => (
  <div className={classnames(cn('content-center'), className)}>
    {children}
  </div>
);
