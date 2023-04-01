// Copyright © 2022 EPAM Systems, Inc.
// All Rights Reserved.
// All information contained herein is, and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by international intellectual property law.
// Dissemination of this information or reproduction of this material is strictly forbidden, unless prior written permission is obtained from EPAM Systems, Inc.

import { useRef, useMemo, useEffect } from "react";
import {
  throttledScrollHandler,
  getInnerStyles,
  getWrapperStyles,
  getItemWrapperStyle,
  getVirtualListData,
  getItemKey,
} from "./helpers";
import { useCutIndexes } from "./hooks";
import { VirtualListProps } from "./types";

export const VirtualList = <T extends Record<string, unknown>>(props: VirtualListProps<T>) => {
  const {
    data,
    idField = "id",
    renderItem,
    maxHeight,
    getItemHeight,
    overScanCount = 1,
    onScroll,
    apiRef,
  } = props;

  const { itemsStyles, listHeight } = useMemo(
    () => getVirtualListData(data, getItemHeight),
    [data]
  );

  const wrapperHeight = useMemo(
    () => (listHeight > maxHeight ? maxHeight : listHeight),
    [listHeight, maxHeight]
  );

  const { startIndex, endIndex, setCutIndexes } = useCutIndexes(
    maxHeight,
    overScanCount,
    data,
    itemsStyles
  );

  useEffect(() => {
    setCutIndexes(scrollTopRef.current);
  }, [listHeight]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollTopRef = useRef(0);

  const handleScroll = () =>
    throttledScrollHandler(scrollTopRef, wrapperRef, setCutIndexes, onScroll);

  const scrollTop = (value: number) => {
    if (!wrapperRef.current) return;
    wrapperRef.current.scrollTop = value;
  };

  const scrollToItem = (index: number) => {
    scrollTop(itemsStyles[index].top);
  };

  useEffect(() => {
    if (!apiRef) return;
    apiRef.current.scrollTop = scrollTop;
    apiRef.current.scrollToItem = scrollToItem;
  }, []);

  const wrapperStyles = useMemo(() => getWrapperStyles(wrapperHeight) as any, [wrapperHeight]);
  const innerStyles = useMemo(() => getInnerStyles(listHeight) as any, [listHeight]);

  return (
    <div ref={wrapperRef} style={wrapperStyles} onScroll={handleScroll}>
      <div style={innerStyles}>
        {data.slice(startIndex, endIndex).map((item, index) => {
          const itemIndex = startIndex + index;
          const itemWrapperStyle = getItemWrapperStyle(itemsStyles[itemIndex]) as any;
          const key = getItemKey(item[idField]);

          const renderedItem = renderItem(item, data, itemIndex);

          return (
            <div key={key} style={itemWrapperStyle}>
              {renderedItem}
            </div>
          );
        })}
      </div>
    </div>
  );
};
