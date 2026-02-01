"use client";

import type {JSX} from "react";
import {useTranslation} from "@/context/I18nContext";
import Footer from "@/app/components/Footer";

export default function HistoryPage(): JSX.Element {
    const { t } = useTranslation();
    return (
        <div>
            <div className="flex flex-col mx-auto w-full max-w-[896px] px-[24px] py-[32px] gap-[32px]">
                <div className="flex flex-col gap-[12px]">
                    <h2 className="text-[24px] font-bold">
                        {t.historyPage.constitutionTitle}
                    </h2>
                    <p className="text-[#374151] text-[18px]">
                        {t.historyPage.constitutionContent}
                    </p>
                </div>

                <div className="flex flex-col gap-[12px]">
                    <h2 className="text-[24px] font-bold">
                        {t.historyPage.projectParticipationTitle}
                    </h2>
                    <p className="text-[#374151] text-[18px]">
                        {t.historyPage.projectParticipationContent}
                    </p>
                </div>

                <div className="flex flex-col gap-[12px]">
                    <h2 className="text-[24px] font-bold">
                        {t.historyPage.nameChangeTitle}
                    </h2>
                    <p className="text-[#374151] text-[18px]">
                        {t.historyPage.nameChangeContent}
                    </p>
                </div>

            </div>
            <Footer />
        </div>

    );
}
