import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer, Text } from "recharts";

interface DataItem {
  name: string;
  value: number;
  fill: string;
}

interface GraphicProps {
  data: DataItem[];
  title: string;  
}

const Graphic: React.FC<GraphicProps> = ({ data, title }) => {
  return (
    <div style={{ textAlign: "center", marginBottom: "30px" }}>
      <h3 style={{ fontSize: "24px", color: "#05260d", fontWeight: "bold", marginBottom: "20px" }}>
        {title}  
      </h3>

      <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "15px", border: "#000" }}>
        <ResponsiveContainer width="100%" height={450}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="50%"
              innerRadius="10%"
              label
              startAngle={90} 
              endAngle={-270}
            >

            </Pie>
            <Legend
              verticalAlign="bottom"    
              align="left"         
              layout="horizontal"    
              wrapperStyle={{
                paddingTop: "20px",  
                marginTop: "20px", 
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Graphic;
