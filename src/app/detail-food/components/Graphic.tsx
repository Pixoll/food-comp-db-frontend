"use client";

import { useTranslation } from "@/context/I18nContext";
import { formatNumber } from "@/utils/nutrients";
import type { JSX } from "react";
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type GraphicItem = {
    name: string;
    value: number;
    unit: string;
};

type GraphicProps = {
    title: string;
    description?: string;
    data: GraphicItem[];
};

const COLORS = ["#1d6735", "#7cbb70", "#2c6fdc", "#c27c00", "#b83a8a", "#5aa9a0", "#ff3e00", "#8a8f98"];

/**
 * Barras horizontales en vez de torta: los macronutrientes de primer nivel se solapan
 * (p. ej. carbohidratos totales y disponibles), así que un gráfico de partes de un todo engañaría.
 */
export default function Graphic({ title, description, data }: GraphicProps): JSX.Element {
    const { t, language } = useTranslation();
    const items = data.filter(item => item.value > 0);
    const height = Math.max(160, items.length * 34 + 24);

    return (
        <div className="rounded-card border border-fog bg-paper p-5">
            <h3 className="text-[16px] font-semibold text-carbon">{title}</h3>
            {description && <p className="mt-1 text-[13px] text-graphite">{description}</p>}
            {items.length === 0 ? (
                <p className="mt-6 text-[13px] text-ash">{t.foodDetail.graphics.empty}</p>
            ) : (
                <div className="mt-4" style={{ height }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={items} layout="vertical" margin={{ top: 0, right: 56, bottom: 0, left: 0 }}>
                            <XAxis type="number" hide/>
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={140}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: "#666666" }}
                            />
                            <Tooltip
                                cursor={{ fill: "#f5f5f5" }}
                                formatter={(value, _name, entry) => [
                                    `${formatNumber(Number(value), language)} ${(entry.payload as GraphicItem).unit}`,
                                    "",
                                ]}
                                separator=""
                                contentStyle={{
                                    border: "1px solid #e8e8e8",
                                    borderRadius: 8,
                                    boxShadow: "0 1px 3px rgb(0 0 0 / 0.06), 0 8px 16px rgb(0 0 0 / 0.06)",
                                    fontSize: 13,
                                }}
                            />
                            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
                                {items.map((item, index) => (
                                    <Cell key={item.name} fill={COLORS[index % COLORS.length]}/>
                                ))}
                                <LabelList
                                    dataKey="value"
                                    position="right"
                                    formatter={(value) => `${formatNumber(Number(value), language, 2)} g`}
                                    style={{ fontSize: 12, fill: "#666666" }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
