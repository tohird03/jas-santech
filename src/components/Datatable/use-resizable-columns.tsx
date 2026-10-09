import React, {useEffect, useRef, useState} from 'react';
import {TableOutlined} from '@ant-design/icons';
import {Button, Checkbox, Popover} from 'antd';
import {ColumnType} from 'antd/es/table';
import {ResizableHeader} from './resizable-header';

type WidthMap = Record<string, number>;

type Options = {
  keys: string[];
  defaults: WidthMap;
  mins: WidthMap;
  titles: {key: string, title: React.ReactNode}[];
  flexKey?: string;
  fit?: boolean;
};

export const resizableTableProps = {
  className: 'resizable-table',
  tableLayout: 'fixed' as const,
  components: {header: {cell: ResizableHeader}},
};

export const useResizableColumns = ({keys, defaults, mins, titles, flexKey, fit = true}: Options) => {
  const boxRef = useRef<HTMLElement>(null);
  const [widths, setWidths] = useState<WidthMap>(defaults);
  const [containerWidth, setContainerWidth] = useState(0);
  const [visible, setVisible] = useState<string[]>([...keys]);
  const shownKeys = keys.filter((key) => visible.includes(key));

  useEffect(() => {
    const box = boxRef.current;

    if (!box) {
      return undefined;
    }

    const update = () => {
      const table = box.querySelector('.ant-table-container');

      setContainerWidth((table ?? box).clientWidth);
    };
    const observer = new ResizeObserver(update);

    update();
    observer.observe(box);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!fit || !containerWidth) {
      return;
    }

    const shown = keys.filter((key) => visible.includes(key));

    if (shown.length === 0) {
      return;
    }

    setWidths((prev) => {
      const next = {...prev};
      let sum = 0;

      shown.forEach((key) => {
        const width = prev[key] ?? defaults[key] ?? mins[key] ?? 64;

        next[key] = width;
        sum += width;
      });

      const diff = containerWidth - sum;

      if (Math.abs(diff) < 2) {
        return prev;
      }

      const preferred = flexKey ?? 'name';
      const flex = shown.includes(preferred) ? preferred : shown[shown.length - 1];

      if (diff > 0) {
        next[flex] += diff;

        return next;
      }

      let need = -diff;
      const wider = [...shown].sort((left, right) => (
        (next[right] - (defaults[right] ?? 0)) - (next[left] - (defaults[left] ?? 0))
      ));

      wider.forEach((key) => {
        if (need <= 0) {
          return;
        }

        const spare = next[key] - (defaults[key] ?? mins[key] ?? 64);

        if (spare <= 0) {
          return;
        }

        const take = Math.min(spare, need);

        next[key] -= take;
        need -= take;
      });

      shown.forEach((key) => {
        if (need <= 0) {
          return;
        }

        const spare = next[key] - (mins[key] ?? 64);

        if (spare <= 0) {
          return;
        }

        const take = Math.min(spare, need);

        next[key] -= take;
        need -= take;
      });

      const changed = shown.some((key) => next[key] !== prev[key]);

      return changed ? next : prev;
    });
  }, [containerWidth, visible, keys, defaults, mins, flexKey, fit]);

  const resizePair = (leftId: string, nextLeft: number) => {
    setWidths((prev) => {
      const place = shownKeys.indexOf(leftId);
      const rightId = shownKeys[place + 1];

      if (!rightId) {
        return prev;
      }

      const leftWidth = prev[leftId] ?? defaults[leftId];
      const rightWidth = prev[rightId] ?? defaults[rightId];
      const maxLeft = leftWidth + rightWidth - (mins[rightId] ?? 64);
      const left = Math.min(Math.max(mins[leftId] ?? 64, nextLeft), maxLeft);
      const delta = left - leftWidth;

      if (!delta) {
        return prev;
      }

      return {
        ...prev,
        [leftId]: left,
        [rightId]: rightWidth - delta,
      };
    });
  };

  const toggleColumn = (key: string, checked: boolean) => {
    setVisible((prev) => {
      if (!checked && prev.length === 1) {
        return prev;
      }

      if (checked) {
        return keys.filter((item) => item === key || prev.includes(item));
      }

      return prev.filter((item) => item !== key);
    });
  };

  const apply = <T,>(columns: Array<ColumnType<T> & {children?: Array<ColumnType<T>>}>) => {
    const visit = (column: ColumnType<T> & {children?: Array<ColumnType<T>>}): (ColumnType<T> & {children?: Array<ColumnType<T>>}) | null => {
      if (column.children?.length) {
        const children = column.children.map(visit).filter((child): child is ColumnType<T> => Boolean(child));

        if (!children.length) {
          return null;
        }

        return {...column, children};
      }

      const id = String(column.key);

      if (!shownKeys.includes(id)) {
        return null;
      }

      const width = widths[id] ?? defaults[id];
      const hasNeighbor = shownKeys.indexOf(id) < shownKeys.length - 1;
      const earlier = column.onHeaderCell as ((value: unknown) => Record<string, unknown>) | undefined;
      const headerProps = {
        ...(earlier ? earlier(column) : {}),
        width,
        columnResize: hasNeighbor ? (next: number) => resizePair(id, next) : undefined,
      };

      return {
        ...column,
        width,
        onHeaderCell: () => headerProps,
      };
    };

    return columns.map(visit).filter((column): column is ColumnType<T> => Boolean(column));
  };

  const picker = (
    <Popover
      trigger="click"
      placement="bottomRight"
      content={(
        <div className="staff-columns">
          {titles.map((column) => (
            <Checkbox
              key={column.key}
              checked={visible.includes(column.key)}
              onChange={(event) => toggleColumn(column.key, event.target.checked)}
            >
              {column.title}
            </Checkbox>
          ))}
        </div>
      )}
    >
      <Button icon={<TableOutlined />}>Ustunlar</Button>
    </Popover>
  );

  return {boxRef, apply, picker};
};
