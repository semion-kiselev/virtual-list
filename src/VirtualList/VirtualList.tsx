import {useRef, useMemo} from "react";
import {throttledScrollHandler, getInnerStyles, getWrapperStyles, getItemWrapperStyle} from "./helpers";
import {VirtualListProps} from "./types";
import {useScrollSubscription, useCutIndexes, useUpdateCutIndexesOnHeightChange} from "./hooks";

export const VirtualList = <T extends { id: string | number }>(props: VirtualListProps<T>) => {
  const { data, renderItem, maxHeight, getItemHeight, overScanCount = 1 } = props;

  const { startIndex, endIndex, setCutIndexes } = useCutIndexes(maxHeight, overScanCount, data, getItemHeight);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollTopRef = useRef(0);

  const handleScroll = () => throttledScrollHandler(scrollTopRef, wrapperRef, setCutIndexes);
  useScrollSubscription(wrapperRef, handleScroll);

  const getListHeight = () => data.reduce((acc, i) => acc + getItemHeight(i, data), 0);
  const listHeight = useMemo(getListHeight, [data]);
  const wrapperHeight = listHeight > maxHeight ? maxHeight : listHeight;
  useUpdateCutIndexesOnHeightChange(listHeight, scrollTopRef, setCutIndexes);

  return (
    <div style={getWrapperStyles(wrapperHeight) as any} ref={wrapperRef}>
      <div style={getInnerStyles(listHeight) as any}>
        {data.map((item, idx) => {
          const itemWrapperStyle = getItemWrapperStyle<T>(item, data, idx, getItemHeight) as any;
          const shouldRender = idx >= startIndex && idx < endIndex

          if (shouldRender) {
            return (
              <div key={item.id} style={itemWrapperStyle}>
                {renderItem(item, data)}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
