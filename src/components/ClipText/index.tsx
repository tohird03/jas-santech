import React, {ReactNode} from 'react';

type Props = {
  text?: string | null;
  children: ReactNode;
};

export const ClipText = ({children}: Props) => <>{children}</>;
