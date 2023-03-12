import {useRef, useEffect, RefObject, useMemo, useState, MutableRefObject} from "react";
import { GetItemHeight } from "./types";
import {getEndIndexUtil, getStartIndexUtil} from "./helpers";

export const usePrevious = <T>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export const useScrollSubscription = (scrolledElRef: RefObject<HTMLDivElement>, handleScroll: () => void ) => {
  useEffect(() => {
    if (!scrolledElRef.current) return;
    scrolledElRef.current.onscroll = handleScroll;

    return () => {
      if (!scrolledElRef.current) return;
      scrolledElRef.current.onscroll = null;
    };
  }, []);
}

export const useCutIndexes = <T, >(maxHeight: number, overScanCount: number, data: T[], getItemHeight: GetItemHeight<T>) => {
  const getStartIndex = useMemo(
    () => getStartIndexUtil(maxHeight, overScanCount, data, getItemHeight),
    [maxHeight, overScanCount, data, getItemHeight]
  );
  const getEndIndex = useMemo(
    () => getEndIndexUtil(maxHeight, overScanCount, data, getItemHeight),
    [maxHeight, overScanCount, data, getItemHeight]
  );

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(() => getEndIndex(0));

  const setCutIndexes = (scrollTop: number) => {
    setStartIndex(getStartIndex(scrollTop));
    setEndIndex(getEndIndex(scrollTop));
  };

  return { startIndex, endIndex, setCutIndexes };
}

export const useUpdateCutIndexesOnHeightChange = (
  listHeight: number,
  scrollTopRef: MutableRefObject<number>,
  setCutIndexes: (scrollTop: number) => void
) => {
  const prevListHeight = usePrevious(listHeight);
  useEffect(() => {
    if (prevListHeight && prevListHeight !== listHeight) {
      setCutIndexes(scrollTopRef.current);
    }
  }, [listHeight, prevListHeight]);
}
