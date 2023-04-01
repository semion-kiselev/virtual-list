import { MutableRefObject, RefObject, ReactNode } from "react";

export type GetItemHeight<T> = (item: T, data: T[]) => number;

export type OnScroll = (scrollTop: number, scrollHeight: number) => void;

type VirtualListApi = {
  scrollTop: (scrollValue: number) => void;
  scrollToItem: (rowIndex: number) => void;
};

export type VirtualListProps<T> = {
  maxHeight: number;
  overScanCount?: number;
  data: T[];
  idField: string;
  getItemHeight: GetItemHeight<T>;
  renderItem: (item: T, data: T[], index: number) => ReactNode;
  onScroll?: OnScroll;
  apiRef?: MutableRefObject<VirtualListApi>;
};

export type HandleScroll = (
  scrollTopRef: MutableRefObject<number>,
  scrolledElRef: RefObject<HTMLDivElement>,
  setCutIndexes: (scrollTop: number) => void,
  onScroll?: OnScroll
) => void;

export type ItemStyles = {
  top: number;
  height: number;
};

export type VirtualListData = {
  itemsStyles: ItemStyles[];
  listHeight: number;
};
