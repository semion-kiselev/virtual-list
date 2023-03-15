import { VirtualList } from "./VirtualList/VirtualList";
import { useState } from "react";

type Item = {
  id: string;
  title: string;
  isOpened: boolean;
};

const initialData = new Array(100).fill(null).map((_, idx) => ({
  id: String(idx + 1),
  title: `Title ${idx + 1}`,
  isOpened: false,
}));

const getItemHeight = (item: Item) => item.isOpened ? 150 : 60;

const getItemStyles = (index: number) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: 8,
  height: "100%",
  background: index % 2 === 0 ? "#f3f3f3" : "#f8f8f0",
  borderBottom: "1px solid #f3f3f3",
});

const App = () => {
  const [data, setData] = useState(initialData);

  const handleToggle = (index: number) => {
    const updatedData = [
      ...data.slice(0, index),
      {...data[index], isOpened: !data[index].isOpened},
      ...data.slice(index + 1),
    ];
    setData(updatedData);
  };

  const renderItem = (i: Item, data: Item[], index: number) => (
    <div style={getItemStyles(index)}>
      {i.title} <button onClick={() => handleToggle(index)}>{i.isOpened ? "close" : "open"}</button>
    </div>
  );

  return (
    <div style={{ width: 400, margin: "100px auto" }}>
      <VirtualList<Item>
        data={data}
        overScanCount={1}
        maxHeight={200}
        getItemHeight={getItemHeight}
        renderItem={renderItem}
      />
    </div>
  );
};

export default App
