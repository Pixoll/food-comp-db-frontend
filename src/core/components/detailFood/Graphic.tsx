import { PieChart, Pie, Tooltip, Legend, Cell,ResponsiveContainer } from "recharts";

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
    <ResponsiveContainer width="100%" height={370}>
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%" // 40 
        outerRadius= "50%" // 80 
        label 
      >
        {data.map((element, index) => (
          <Cell key={`cell-${index}`} fill={element.fill} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
    </ResponsiveContainer>
  );
};

export default Graphic;

