import React from 'react';

type ResizableHeaderProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
  width?: number;
  columnResize?: (width: number) => void;
};

export const ResizableHeader = React.forwardRef<HTMLTableCellElement, ResizableHeaderProps>(
  ({columnResize, width, style, children, ...rest}, ref) => {
    if (!width || !columnResize) {
      return (
        <th {...rest} ref={ref} style={style}>
          {children}
        </th>
      );
    }

    const startResize = (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const startX = event.clientX;
      const startWidth = width;

      const onMove = (moveEvent: MouseEvent) => {
        columnResize(Math.max(64, Math.round(startWidth + moveEvent.clientX - startX)));
      };

      const onUp = () => {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    };

    return (
      <th {...rest} ref={ref} style={{...style, position: 'relative'}}>
        {children}
        <span className="col-resizer" onMouseDown={startResize} onClick={(event) => event.stopPropagation()} />
      </th>
    );
  }
);

ResizableHeader.displayName = 'ResizableHeader';
