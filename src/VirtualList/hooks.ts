// Copyright © 2022 EPAM Systems, Inc.
// All Rights Reserved.
// All information contained herein is, and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by international intellectual property law.
// Dissemination of this information or reproduction of this material is strictly forbidden, unless prior written permission is obtained from EPAM Systems, Inc.

import { useState } from "react";
import { getEndIndex, getStartIndex } from "./helpers";
import { ItemStyles } from "./types";

export const useCutIndexes = <T>(
  maxHeight: number,
  overScanCount: number,
  data: T[],
  itemsStyles: ItemStyles[]
) => {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(() =>
    getEndIndex(0, maxHeight, overScanCount, data, itemsStyles)
  );

  const setCutIndexes = (scrollTop: number) => {
    setStartIndex(getStartIndex(scrollTop, maxHeight, overScanCount, data, itemsStyles));
    setEndIndex(getEndIndex(scrollTop, maxHeight, overScanCount, data, itemsStyles));
  };

  return { startIndex, endIndex, setCutIndexes };
};
