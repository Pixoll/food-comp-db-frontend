import { Card } from "react-bootstrap";
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip, Cell, PieLabelRenderProps } from "recharts";

type DataItem = {
  name: string;
  value: number;
  fill: string;
};

type GraphicProps = {
  data: DataItem[];
  title: string;
};

// Función personalizada para renderizar etiquetas con líneas
const renderCustomizedLabel = (props: PieLabelRenderProps & { fill: string }) => {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    outerRadius = 0,
    value,
    fill,
  } = props;

  // Filtra valores menores a 0.01 para que no se muestren
  if (value === undefined || value < 0.01) return null;

  const cxNum = Number(cx);
  const cyNum = Number(cy);
  const outerRadiusNum = Number(outerRadius);

  const RADIAN = Math.PI / 180;
  const radius = outerRadiusNum + 20; // Ajusta la distancia de las etiquetas
  const x = cxNum + radius * Math.cos(-midAngle * RADIAN);
  const y = cyNum + radius * Math.sin(-midAngle * RADIAN);

  // Ajustar alineación según posición
  const textAnchor = x > cxNum ? "start" : "end";

  return (
    <>
      {/* Línea que conecta el segmento con la etiqueta */}
      <line
        x1={cxNum + (outerRadiusNum + 5) * Math.cos(-midAngle * RADIAN)} // Punto inicial de la línea
        y1={cyNum + (outerRadiusNum + 5) * Math.sin(-midAngle * RADIAN)}
        x2={x} // Punto final de la línea
        y2={y}
        stroke={fill} // Color correspondiente al segmento
        strokeWidth={1.5}
      />
      {/* Etiqueta numérica */}
      <text
        x={x}
        y={y}
        fill={fill} // Color del texto coincide con el segmento
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize="12px"
        fontWeight="bold"
      >
        {value?.toFixed(2)} {/* Redondea los números a 2 decimales */}
      </text>
    </>
  );
};

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
              data={data.filter((item) => item.value >= 0.01)} // Filtra segmentos pequeños
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              innerRadius="30%"
              paddingAngle={3}
              label={renderCustomizedLabel} // Usa etiquetas personalizadas
              labelLine // Habilita las líneas de las etiquetas
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{
                backgroundColor: "#f8f9fa",
                border: "1px solid #dee2e6",
                borderRadius: "8px",
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