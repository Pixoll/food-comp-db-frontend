"use client";

import { useTranslation } from "@/context/I18nContext";
import type { JSX } from "react";

export default function Footer(): JSX.Element {
    const { t } = useTranslation();

    return (
        <footer className="bg-[#343a40] text-[white] py-[12px]">
            <div className="container mx-auto px-[20px]">
                <div className="flex flex-col h-full justify-between">
                    <div className="flex flex-wrap items-start justify-between">
                        <div className="flex-grow min-w-[200px] text-[white]">
                            <h5 className="text-[14px] font-semibold mb-[4px]">{t.footer.contact.title}</h5>
                            <p className="text-[12px] text-[#d1d5db]">{t.footer.contact.email}</p>
                        </div>
                        <div className="flex-grow text-[white]">
                            <h5 className="text-[14px] font-semibold mb-[4px]">{t.footer.address.title}</h5>
                            <p className="text-[12px] text-[#d1d5db]">{t.footer.address.details}</p>
                        </div>
                        <div className="flex-grow min-w-[200px] text-[white]">
                            <h5 className="text-[14px] font-semibold mb-[4px]">{t.footer.policies.title}</h5>
                            <ul className="list-none p-0">
                                <li>
                                    <a
                                        href="/politica-privacidad"
                                        className="
                                        text-[12px]
                                        text-[#d1d5db]
                                        hover:text-[white]
                                        transition-colors no-underline
                                        "
                                    >
                                        {t.footer.policies.privacy}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-[#6b7280] pt-[8px] mt-[12px]">
                        <div className="text-center text-[white]">
                            <p className="text-[11px] text-[#9ca3af]">{t.footer.copyright}</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
