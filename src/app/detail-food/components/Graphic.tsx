'use client'
import {useEffect, useState} from "react";
import { Legend, Pie, PieChart, Tooltip, Cell, PieLabelRenderProps } from "recharts";

    type DataItem = {
      name: string;
      value: number;
      fill: string;
    };

    type GraphicProps = {
      data: DataItem[];
      title: string;
      grams: number;
    };

    const renderCustomizedLabel = (props: PieLabelRenderProps) => {
        const {
            cx = 0,
            cy = 0,
            midAngle = 0,
            outerRadius = 0,
            value,
            fill,
            name,
        } = props;

        if (value === undefined || value < 0.01) return null;

        const cxNum = Number(cx);
        const cyNum = Number(cy);
        const outerRadiusNum = Number(outerRadius);

        const RADIAN = Math.PI / 180;
        const radius = outerRadiusNum + 20;
        const x = cxNum + radius * Math.cos(-midAngle * RADIAN);
        const y = cyNum + radius * Math.sin(-midAngle * RADIAN);

        const textAnchor = x > cxNum ? "start" : "end";

        return (
            <>
                <line
                    x1={cxNum + (outerRadiusNum + 5) * Math.cos(-midAngle * RADIAN)}
                    y1={cyNum + (outerRadiusNum + 5) * Math.sin(-midAngle * RADIAN)}
                    x2={x}
                    y2={y}
                    stroke={fill}
                    strokeWidth={1.5}
                />
                <text
                    x={x}
                    y={y}
                    fill={fill}
                    textAnchor={textAnchor}
                    dominantBaseline="central"
                    fontSize="12px"
                    fontWeight="bold"
                >
                    {typeof value === 'number' ? `${value.toFixed(2)}%` : ''}
                </text>
            </>
        );
    };

    export default function Graphic({ data, title , grams}: GraphicProps) {
        const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
        return (
            <div className="w-full p-[16px] border-[1px] rounded-[4px] shadow-[0_4px_10px_rgba(0,0,0,0.2)] bg-[white]">
                <div className="text-center">
                    <h3 className="text-[20px] font-[700] text-gray-800">{title}</h3>
                </div>
                <div className="w-full h-[400px] mt-[10px] flex justify-center">
                    <PieChart key ={grams} width={450} height={400}>
                        <Pie
                            data={data.filter((item) => item.value >= 0.01)}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            outerRadius={120}
                            innerRadius={60}
                            paddingAngle={3}
                            label={renderCustomizedLabel}
                            labelLine={false}
                            startAngle={90}
                            endAngle={-270}
                            onMouseEnter={(_, index) => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.fill}
                                    stroke={hoveredIndex === index ? "#000" : "none"}
                                    strokeWidth={hoveredIndex === index ? 2 : 0}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [`${value}%`, name]}
                            contentStyle={{
                                backgroundColor: "#f8f9fa",
                                border: "1px solid #dee2e6",
                                borderRadius: "8px",
                                padding: "10px",
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            layout="horizontal"
                            iconType="circle"
                            wrapperStyle={{
                                paddingTop: "20px",
                            }}
                        />
                    </PieChart>
                </div>
            </div>
        );
    };
