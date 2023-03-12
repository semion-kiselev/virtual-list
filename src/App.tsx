import { VirtualList } from "./VirtualList/VirtualList";

type Item = {
  id: string;
  title: string;
};

const data = new Array(100).fill(null).map((_, idx) => ({
  id: String(idx + 1),
  title: `Title ${idx + 1}`,
}));

const getItemHeight = () => 50;

const itemStyles = {
  display: "flex",
  alignItems: "center",
  height: 50,
  background: "cadetblue",
  borderBottom: "1px solid #f3f3f3",
};

const App = () => {
  const renderItem = (i: Item) => (
    <div style={itemStyles}>
      {i.title}
    </div>
  );

  return (
    <div style={{ width: 800, margin: "100px auto" }}>
      <VirtualList<Item>
        data={data}
        maxHeight={200}
        getItemHeight={getItemHeight}
        renderItem={renderItem}
      />
    </div>
  );
};

export default App
