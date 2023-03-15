import {useRef, useMemo, useEffect} from "react";
import {
  throttledScrollHandler,
  getInnerStyles,
  getWrapperStyles,
  getItemWrapperStyle,
  getVirtualListData,
} from "./helpers";
import {VirtualListProps} from "./types";
import {useCutIndexes, useUpdateCutIndexesOnHeightChange} from "./hooks";

export const VirtualList = <T extends { id: string | number }>(props: VirtualListProps<T>) => {
  const { data, renderItem, maxHeight, getItemHeight, overScanCount = 1, onScroll, apiRef } = props;

  const { itemsStyles, listHeight } = useMemo(() => getVirtualListData(data, getItemHeight), [data]);
  const wrapperHeight = listHeight > maxHeight ? maxHeight : listHeight;

  const { startIndex, endIndex, setCutIndexes } = useCutIndexes(maxHeight, overScanCount, data, itemsStyles);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollTopRef = useRef(0);

  const handleScroll = () => throttledScrollHandler(scrollTopRef, wrapperRef, setCutIndexes, onScroll);

  // todo: think of set this as option
  useUpdateCutIndexesOnHeightChange(listHeight, scrollTopRef, setCutIndexes);

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

  return (
    <div onScroll={handleScroll} style={getWrapperStyles(wrapperHeight) as any} ref={wrapperRef}>
      <div style={getInnerStyles(listHeight) as any}>
        {data.slice(startIndex, endIndex).map((item, index) => {
          const itemWrapperStyle = getItemWrapperStyle(itemsStyles[startIndex + index]) as any;
          return (
            <div key={item.id} style={itemWrapperStyle}>
              {renderItem(item, data, startIndex + index)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
