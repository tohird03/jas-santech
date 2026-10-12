import React, {ReactNode} from 'react';
import {Tooltip} from 'antd';

type Props = {
  text?: string | null;
  children: ReactNode;
};

export const ClipText = ({text, children}: Props) => {
  const value = (text || '').trim();

  if (!value) {
    return <>{children}</>;
  }

  return (
    <Tooltip
      title={value}
      placement="topLeft"
      mouseEnterDelay={0}
      zIndex={3000}
      getPopupContainer={() => document.body}
    >
      {children}
    </Tooltip>
  );
};
