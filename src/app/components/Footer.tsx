"use client";

import { useTranslation } from "@/context/I18nContext";
import Link from "next/link";
import type { JSX } from "react";

export default function Footer(): JSX.Element {
    const { t } = useTranslation();

    return (
        <footer className="border-t border-fog bg-paper text-graphite">
            <div
                className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row
                md:justify-between"
            >
                <div>
                    <p className="text-[15px] font-semibold text-carbon">{t.footer.copyright.title}</p>
                    <p className="mt-1 text-[13px]">
                        {t.footer.contact.email}
                        <a href="mailto:contacto@capchical.com" className="text-brand hover:underline">
                            contacto@capchical.com
                        </a>
                    </p>
                </div>
                <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
                    <Link href="/search" className="hover:text-carbon">{t.navbar.search}</Link>
                    <Link href="/compare" className="hover:text-carbon">{t.navbar.compare}</Link>
                    <Link href="/history" className="hover:text-carbon">{t.navbar.history}</Link>
                    <Link href="/about-us" className="hover:text-carbon">{t.navbar.aboutUs}</Link>
                </nav>
            </div>
            <div className="border-t border-fog">
                <p className="mx-auto max-w-[1400px] px-4 py-4 text-center text-[12px] text-ash sm:px-6">
                    <a href="https://db.capchical.com/" className="hover:text-carbon">{t.footer.copyright.title}</a>
                    {" "}© 2024-2026 {t.footer.copyright.by}{" "}
                    <a href="https://capchical.com/" className="hover:text-carbon">CapChiCAL</a>
                    {" "}{t.footer.copyright.licensedUnder}{" "}
                    <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" className="hover:text-carbon">
                        CC BY-NC-ND 4.0
                    </a>
                </p>
            </div>
        </footer>
    );
}
