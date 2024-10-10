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
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="40%"
        cy="40%"
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
