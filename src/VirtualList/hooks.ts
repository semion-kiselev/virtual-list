import {useRef, useEffect, useState, MutableRefObject} from "react";
import { ItemStyles } from "./types";
import {getEndIndex, getStartIndex} from "./helpers";

export const usePrevious = <T>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export const useCutIndexes = <T, >(maxHeight: number, overScanCount: number, data: T[], itemsStyles: ItemStyles[]) => {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(() => getEndIndex(0, maxHeight, overScanCount, data, itemsStyles));

  const setCutIndexes = (scrollTop: number) => {
    setStartIndex(getStartIndex(scrollTop, maxHeight, overScanCount, data, itemsStyles));
    setEndIndex(getEndIndex(scrollTop, maxHeight, overScanCount, data, itemsStyles));
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
