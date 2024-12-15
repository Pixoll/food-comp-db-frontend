import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import { Card } from 'react-bootstrap';

type DataItem = {
  name: string;
  value: number;
  fill: string;
}

type GraphicProps = {
  data: DataItem[];
  title: string;
}

export default function Graphic({ data, title }: GraphicProps) {

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-white text-center">
        <h3 className="h4 text-dark font-weight-bold">{title}</h3>
      </Card.Header>
      <Card.Body>
        <ResponsiveContainer width="100%" height={450}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              innerRadius="10%"
              paddingAngle={2}
              labelLine={false}
              startAngle={90}
              endAngle={-270}
            >

            </Pie>
            <Tooltip 
              formatter={(value, name) => [value, name]}
              contentStyle={{ 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #dee2e6',
                borderRadius: '8px'
              }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              layout="horizontal"
              iconType="circle"
              wrapperStyle={{
                paddingTop: "20px",
                marginTop: "20px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}