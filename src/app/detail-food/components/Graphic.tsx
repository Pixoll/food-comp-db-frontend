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

// variables CSS del tema: el gráfico cambia de colores junto con el tema claro/oscuro
const COLORS = [
    "var(--color-brand)",
    "var(--color-leaf)",
    "var(--color-sky)",
    "var(--color-amber)",
    "var(--color-magenta)",
    "#5aa9a0",
    "#e8590c",
    "var(--color-ash)",
];

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
                                tick={{ fontSize: 12, fill: "var(--color-graphite)" }}
                            />
                            <Tooltip
                                cursor={{ fill: "var(--color-mist)" }}
                                formatter={(value, _name, entry) => [
                                    `${formatNumber(Number(value), language)} ${(entry.payload as GraphicItem).unit}`,
                                    "",
                                ]}
                                separator=""
                                contentStyle={{
                                    border: "1px solid var(--color-fog)",
                                    borderRadius: 8,
                                    background: "var(--color-paper)",
                                    color: "var(--color-carbon)",
                                    boxShadow: "var(--shadow-panel)",
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
                                    style={{ fontSize: 12, fill: "var(--color-graphite)" }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
