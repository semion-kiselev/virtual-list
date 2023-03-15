import {GetItemHeight, HandleScroll, ItemStyles, VirtualListData} from "./types";

export const rafThrottle = (cb: any) => {
  let isWait = false;
  return (...args: any[]) => {
    if (isWait) {
      return;
    }
    isWait = true;
    requestAnimationFrame(() => {
      cb(...args);
      isWait = false;
    })
  }
}

export const getWrapperStyles = (wrapperHeight: number) => ({
  position: "relative",
  willChange: "transform",
  height: wrapperHeight,
  overflow: "auto",
});

export const getInnerStyles = (listHeight: number) => ({
  height: listHeight,
});

export const getItemWrapperStyle = (
 itemStyle: { top: number; height: number }
) => ({
  ...itemStyle,
  position: "absolute",
  width: "100%",
  left: 0,
});

export const getStartIndex = <T,>(
  scrollTop: number,
  frameHeight: number,
  overScanCount: number,
  data: T[],
  itemsStyles: ItemStyles[]
) => {
  const freeHeight = scrollTop - frameHeight * overScanCount;

  if (freeHeight <= 0) {
    return 0;
  }

  let itemsHeight = 0;
  for (let i = 0; i < data.length; i++) {
    itemsHeight += itemsStyles[i].height;
    if (itemsHeight >= freeHeight) {
      return i;
    }
  }

  return 0;
};

export const getEndIndex = <T,>(
  scrollTop: number,
  frameHeight: number,
  overScanCount: number,
  data: T[],
  itemsStyles: ItemStyles[]
) => {
  const heightToCover = scrollTop + frameHeight + frameHeight * overScanCount;
  let itemsHeight = 0;
  for (let i = 0; i < data.length; i++) {
    itemsHeight += itemsStyles[i].height;
    if (itemsHeight >= heightToCover) {
      return i + 1;
    }
  }
  return data.length;
};

export const handleScroll: HandleScroll = (
  scrollTopRef,
  scrolledElRef,
  setCutIndexes,
  onScroll
) => {
  if (!scrolledElRef.current) {
    return;
  }
  const { scrollTop, scrollHeight } = scrolledElRef.current;
  scrollTopRef.current = scrollTop;
  setCutIndexes(scrollTop);
  if (onScroll) {
    onScroll(scrollTop, scrollHeight);
  }
}

export const throttledScrollHandler = rafThrottle(handleScroll);

export const getVirtualListData = <T,>(data: T[], getItemHeight: GetItemHeight<T>) => data.reduce<VirtualListData>(
  (acc, item, index) => {
    if (index === 0) {
      const itemHeight = getItemHeight(item, data);
      acc.itemsStyles.push({ height: itemHeight, top: 0 });
      acc.listHeight += itemHeight;
      return acc;
    }

    const prevItem = acc.itemsStyles[index - 1];
    const itemHeight = getItemHeight(item, data);
    acc.itemsStyles.push({
      height: itemHeight,
      top: prevItem.top + prevItem.height
    });
    acc.listHeight += itemHeight;
    return acc;
  },
  { itemsStyles: [], listHeight: 0 }
);
