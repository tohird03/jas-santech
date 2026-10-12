import React, {ReactElement, ReactNode, useState} from 'react';
import {Tooltip} from 'antd';

type Props = {
  text?: string | null;
  children: ReactNode;
};

const CLIP_SELECTOR = '.cell-ellipsis, .staff-list__name, .staff-payment__name, .staff-payment__note';

const isClipped = (node: HTMLElement) => {
  const target = node.matches(CLIP_SELECTOR)
    ? node
    : (node.querySelector(CLIP_SELECTOR) as HTMLElement | null) || node;

  return target.scrollWidth > target.clientWidth + 1;
};

export const ClipText = ({text, children}: Props) => {
  const value = (text || '').trim();
  const [open, setOpen] = useState(false);

  if (!value || !React.isValidElement(children)) {
    return <>{children}</>;
  }

  const child = children as ReactElement<any>;

  return (
    <Tooltip
      title={value}
      open={open}
      placement="topLeft"
      mouseEnterDelay={0}
      zIndex={3000}
      getPopupContainer={() => document.body}
    >
      {React.cloneElement(child, {
        onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
          child.props.onMouseEnter?.(event);
          setOpen(isClipped(event.currentTarget));
        },
        onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
          child.props.onMouseLeave?.(event);
          setOpen(false);
        },
      })}
    </Tooltip>
  );
};
