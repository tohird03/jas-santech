import './content.scss';

import React, { useEffect } from 'react';
import {Layout as AntdLayout} from 'antd';

type Props = {
  children: React.ReactNode;
  isTablet: boolean;
};

const headerCellsOf = (table: Element) => [...table.querySelectorAll('.ant-table-thead th')];

const widenColumnsForFooter = (table: Element) => {
  const summary = table.querySelector('.ant-table-summary');
  const headerCells = headerCellsOf(table);

  if (!summary || !headerCells.length) {
    return;
  }

  summary.querySelectorAll('tr').forEach((row) => {
    let column = 0;

    row.querySelectorAll('td').forEach((cell) => {
      const span = Number(cell.getAttribute('colspan') || 1);
      const content = cell.firstElementChild;
      const header = headerCells[column];

      if (span === 1 && content && header) {
        const range = document.createRange();

        range.selectNodeContents(content);
        const needed = Math.ceil(range.getBoundingClientRect().width + 24);
        const current = header.getBoundingClientRect().width;

        if (header instanceof HTMLElement && needed > current + 1) {
          header.style.minWidth = `${needed}px`;
        }
      }

      column += span;
    });
  });
};

const syncTableFooters = (root: Element) => {
  let pending = false;

  root.querySelectorAll('.ant-table').forEach((table) => {
    const summary = table.querySelector('.ant-table-summary');
    const headerCells = headerCellsOf(table);

    if (!summary || !headerCells.length) {
      return;
    }

    const widths = headerCells.map((cell) => cell.getBoundingClientRect().width);

    if (widths.every((width) => width === 0)) {
      pending = true;

      return;
    }

    summary.querySelectorAll('tr').forEach((row) => {
      let column = 0;

      row.querySelectorAll('td').forEach((cell) => {
        const span = Number(cell.getAttribute('colspan') || 1);
        const width = widths.slice(column, column + span).reduce((sum, item) => sum + item, 0);

        cell.style.width = `${width}px`;
        column += span;
      });
    });

    const scroller = table.querySelector('.ant-table-content, .ant-table-body');

    if (scroller instanceof HTMLElement) {
      const footerHeight = Math.ceil(summary.getBoundingClientRect().height) + 8;
      const nextHeight = `${Math.max(table.getBoundingClientRect().height - footerHeight, 80)}px`;

      scroller.style.paddingBottom = '0px';
      scroller.style.height = nextHeight;
    }
  });

  return pending;
};

export const Content = ({children, isTablet}: Props) => {
  useEffect(() => {
    const root = document.querySelector('.content');

    if (!root) {
      return undefined;
    }

    let frame = 0;
    let retries = 0;
    const observed = new Set<Element>();
    let schedule = () => {};
    const resizeObserver = new ResizeObserver(() => schedule());
    const observeColumns = () => {
      root.querySelectorAll('.ant-table-thead th').forEach((cell) => {
        if (observed.has(cell)) {
          return;
        }

        observed.add(cell);
        resizeObserver.observe(cell);
      });
    };

    schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.querySelectorAll('.ant-table').forEach(widenColumnsForFooter);
        observeColumns();
        frame = requestAnimationFrame(() => {
          const pending = syncTableFooters(root);

          if (pending && retries < 8) {
            retries += 1;
            schedule();
          } else {
            retries = 0;
          }
        });
      });
    };

    schedule();

    const later = window.setTimeout(schedule, 300);
    const mutationObserver = new MutationObserver(schedule);

    resizeObserver.observe(root);
    mutationObserver.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style'],
    });

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(later);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <AntdLayout.Content className={isTablet ? 'tablet__content content' : 'content'}>
      {children}
    </AntdLayout.Content>
  );
};
