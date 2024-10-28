import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

interface DataItem {
    name: string;
    value: number;
    fill: string;
  }

interface GraphicProps {
    data: DataItem[];
  }
  const Graphic: React.FC<GraphicProps> = ({ data }) => {
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      >
        {data.map((element, index) => (
          <Cell key={`cell-${index}`} fill={element.fill} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default Graphic;
