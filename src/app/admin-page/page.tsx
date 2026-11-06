"use client";

import RequireAdmin from "@/app/components/RequireAdmin";
import { PageContainer, PageHeader } from "@/app/components/ui";
import { useTranslation } from "@/context/I18nContext";
import { ArrowRight, BookOpen, FileSpreadsheet, FlaskConical, Leaf, PlusCircle, SquarePen } from "lucide-react";
import Link from "next/link";
import type { JSX, ReactNode } from "react";

export default function AdminPage(): JSX.Element {
    const { t } = useTranslation();
    const a = t.adminPage;

    const cards: Array<{ href: string; icon: ReactNode; title: string; description: string }> = [
        { href: "/admin-page/add-food", icon: <PlusCircle size={20}/>, ...a.addFood },
        { href: "/admin-page/import", icon: <FileSpreadsheet size={20}/>, ...a.importXlsx },
        { href: "/admin-page/add-reference", icon: <BookOpen size={20}/>, ...a.addReference },
        { href: "/admin-page/add-scientific-name", icon: <Leaf size={20}/>, ...a.addScientificName },
        { href: "/admin-page/nutrients", icon: <FlaskConical size={20}/>, ...a.nutrients },
        { href: "/search", icon: <SquarePen size={20}/>, ...a.modifyFood },
    ];

    return (
        <RequireAdmin>
            <PageContainer>
                <PageHeader title={a.title} description={a.description}/>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map(card => (
                        <Link
                            key={card.href}
                            href={card.href}
                            className="group flex flex-col gap-4 rounded-card border border-fog bg-paper p-6
                            transition-shadow duration-150 hover:shadow-panel"
                        >
                            <span
                                className="flex size-10 items-center justify-center rounded-full bg-brand text-white"
                            >
                                {card.icon}
                            </span>
                            <div className="flex-1">
                                <h2 className="text-[18px] font-semibold text-carbon">{card.title}</h2>
                                <p className="mt-1 text-[14px] leading-relaxed text-graphite">{card.description}</p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[14px] font-medium text-brand">
                                {a.open}
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5"/>
                            </span>
                        </Link>
                    ))}
                </div>
            </PageContainer>
        </RequireAdmin>
    );
}
