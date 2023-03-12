import {GetItemHeight, HandleScroll} from "./types";
import {MutableRefObject} from "react";

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

export const getItemWrapperStyle = <T,>(item: T, data: T[], idx: number, getItemHeight: (item: T, data: T[]) => number ) => ({
  position: "absolute",
  width: "100%",
  left: 0,
  top: idx * getItemHeight(item, data),
});

export const getStartIndexUtil = <T,>(
  frameHeight: number,
  overScanCount: number,
  data: T[],
  getItemHeight: GetItemHeight<T>
) => (scrollTop: number) => {
  const freeHeight = scrollTop - frameHeight * overScanCount;

  if (freeHeight <= 0) {
    return 0;
  }

  let itemsHeight = 0;
  for (let i = 0; i < data.length; i++) {
    itemsHeight += getItemHeight(data[i], data);
    if (itemsHeight >= freeHeight) {
      return i;
    }
  }

  return 0;
};

export const getEndIndexUtil = <T,>(
  frameHeight: number,
  overScanCount: number,
  data: T[],
  getItemHeight: GetItemHeight<T>
) => (scrollTop: number) => {
  const heightToCover = scrollTop + frameHeight + frameHeight * overScanCount;
  let itemsHeight = 0;
  for (let i = 0; i < data.length; i++) {
    itemsHeight += getItemHeight(data[i], data);
    if (itemsHeight >= heightToCover) {
      return i + 1;
    }
  }
  return data.length;
};

const handleScroll: HandleScroll = (scrollTopRef, scrolledElRef, setCutIndexes) => {
  if (!scrolledElRef.current) {
    return;
  }
  const { scrollTop } = scrolledElRef.current;
  scrollTopRef.current = scrollTop;
  setCutIndexes(scrollTop);
}
export const throttledScrollHandler = rafThrottle(handleScroll);
