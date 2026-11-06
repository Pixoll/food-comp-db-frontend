"use client";

import { useTranslation } from "@/context/I18nContext";
import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Icon from "../../../public/icon.png";

const linkClass = "text-on-footer/80 transition-colors hover:text-on-footer";

export default function Footer(): JSX.Element {
    const { t } = useTranslation();

    return (
        <footer className="footer-surface text-footer-muted">
            <div
                className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row
                md:items-start md:justify-between"
            >
                <div className="flex items-start gap-3">
                    <Image
                        src={Icon}
                        alt=""
                        width={40}
                        height={40}
                        className="size-10 shrink-0 rounded-full bg-white object-contain p-0.5"
                    />
                    <div>
                        <p className="text-[15px] font-semibold text-on-footer">{t.footer.copyright.title}</p>
                        <p className="mt-1 text-[13px]">
                            {t.footer.contact.email}
                            <a href="mailto:contacto@capchical.com" className="text-footer-link hover:underline">
                                contacto@capchical.com
                            </a>
                        </p>
                    </div>
                </div>
                <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
                    <Link href="/search" className={linkClass}>{t.navbar.search}</Link>
                    <Link href="/compare" className={linkClass}>{t.navbar.compare}</Link>
                    <Link href="/history" className={linkClass}>{t.navbar.history}</Link>
                    <Link href="/about-us" className={linkClass}>{t.navbar.aboutUs}</Link>
                </nav>
            </div>
            <div className="border-t border-footer-line">
                <p className="mx-auto max-w-[1400px] px-4 py-4 text-center text-[12px] sm:px-6">
                    <a href="https://db.capchical.com/" className="hover:text-on-footer">{t.footer.copyright.title}</a>
                    {" "}© 2024-2026 {t.footer.copyright.by}{" "}
                    <a href="https://capchical.com/" className="hover:text-on-footer">CapChiCAL</a>
                    {" "}{t.footer.copyright.licensedUnder}{" "}
                    <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" className="hover:text-on-footer">
                        CC BY-NC-ND 4.0
                    </a>
                </p>
            </div>
        </footer>
    );
}
