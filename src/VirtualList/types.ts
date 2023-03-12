import {MutableRefObject, RefObject, ReactNode} from "react";

export type GetItemHeight<T> = (item: T, data: T[]) => number;

export type VirtualListProps<T> = {
  maxHeight: number;
  overScanCount?: number;
  data: T[];
  getItemHeight: GetItemHeight<T>;
  renderItem: (item: T, data: T[]) => ReactNode;
};

export type HandleScroll = (
  scrollTopRef: MutableRefObject<number>,
  scrolledElRef: RefObject<HTMLDivElement>,
  setCutIndexes: (scrollTop: number) => void
) => void;
