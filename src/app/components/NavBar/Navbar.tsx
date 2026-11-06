"use client";

import api from "@/api";
import { useAuth } from "@/context/AuthContext";
import { useComparison } from "@/context/ComparisonContext";
import { type Language, useTranslation } from "@/context/I18nContext";
import { useToast } from "@/context/ToastContext";
import { useTheme } from "@/hooks/useTheme";
import { Languages, LogOut, Menu, MonitorCog, Moon, Search, Sun, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type JSX, useEffect, useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Icon from "../../../../public/icon.png";

const languages: Array<{ code: Language; label: string }> = [
    { code: "es", label: "Español" },
    { code: "en", label: "English" },
];

export default function NavBar(): JSX.Element {
    const [menuOpen, setMenuOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);
    const { t, language, setLanguage } = useTranslation();
    const { addToast } = useToast();
    const { state, logout } = useAuth();
    const { comparisonFoods } = useComparison();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const onClick = (event: MouseEvent): void => {
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setLangMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const handleLogout = async (): Promise<void> => {
        const result = await api.logout().catch(error => ({ error }));

        if (result.error) {
            addToast({
                type: "Danger",
                message: (result.error as { message?: string }).message ?? t.common.unknownError,
                position: "top-end",
            });
            return;
        }

        logout();
        router.push("/");
    };

    const links = [
        { href: "/search", label: t.navbar.search, icon: <Search size={16}/> },
        { href: "/compare", label: t.navbar.compare, badge: comparisonFoods.length || undefined },
        { href: "/history", label: t.navbar.history },
        { href: "/about-us", label: t.navbar.aboutUs },
    ];

    const isActive = (href: string): boolean => pathname === href || pathname.startsWith(`${href}/`);

    return (
        <header className="nav-surface relative z-40 border-b border-white/5 text-on-nav shadow-subtle">
            <nav className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
                <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={t.navbar.home}>
                    <Image
                        height={40}
                        width={40}
                        src={Icon}
                        alt="CapChiCAL"
                        quality={100}
                        priority
                        className="size-10 rounded-full bg-white object-contain p-0.5"
                    />
                    <span className="hidden text-[15px] font-semibold tracking-tight lg:inline">CapChiCAL</span>
                </Link>

                <ul
                    className={`${menuOpen ? "flex" : "hidden"} nav-surface absolute inset-x-0 top-16 flex-col gap-1
                    border-t border-white/10 p-3 shadow-panel md:static md:flex md:flex-1 md:flex-row
                    md:justify-center md:border-0 md:bg-none md:p-0 md:shadow-none`}
                >
                    {links.map(link => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[15px] font-medium
                                transition-colors ${isActive(link.href)
                                    ? "bg-white/15 text-on-nav"
                                    : "text-on-nav/80 hover:bg-white/10 hover:text-on-nav"}`}
                            >
                                {link.label}
                                {link.icon}
                                {link.badge !== undefined && (
                                    <span
                                        className="rounded-full bg-mint px-1.5 text-[12px] font-semibold tabular-nums
                                        text-brand-ink"
                                    >
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="ml-auto flex items-center gap-1 md:ml-0">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={theme === "dark" ? t.navbar.lightTheme : t.navbar.darkTheme}
                        title={theme === "dark" ? t.navbar.lightTheme : t.navbar.darkTheme}
                        className="rounded-full p-2 text-on-nav/80 hover:bg-white/10 hover:text-on-nav"
                    >
                        {theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}
                    </button>

                    <div ref={langRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setLangMenuOpen(open => !open)}
                            aria-label={t.navbar.changeLanguage}
                            aria-expanded={langMenuOpen}
                            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium
                            text-on-nav/80 hover:bg-white/10 hover:text-on-nav"
                        >
                            <Languages size={18}/>
                            <span className="uppercase">{language}</span>
                        </button>
                        {langMenuOpen && (
                            <div
                                className="absolute right-0 mt-2 w-36 overflow-hidden rounded-input border border-fog
                                bg-paper py-1 text-carbon shadow-panel animate-fade-in"
                            >
                                {languages.map(lang => (
                                    <button
                                        key={lang.code}
                                        type="button"
                                        onClick={() => {
                                            setLanguage(lang.code);
                                            setLangMenuOpen(false);
                                        }}
                                        className={`block w-full px-3 py-2 text-left text-[14px] hover:bg-mist ${
                                            lang.code === language ? "font-semibold text-brand" : ""}`}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {state.isAuthenticated ? (
                        <>
                            <Link
                                href="/admin-page"
                                aria-label={t.navbar.adminPanel}
                                title={t.navbar.adminPanel}
                                className={`rounded-full p-2 hover:bg-white/10 ${isActive("/admin-page")
                                    ? "bg-white/15"
                                    : ""}`}
                            >
                                <MonitorCog size={18}/>
                            </Link>
                            <button
                                type="button"
                                onClick={() => void handleLogout()}
                                aria-label={t.navbar.signOut}
                                title={t.navbar.signOut}
                                className="flex items-center gap-2 rounded-full px-3 py-2 text-[13px] font-medium
                                text-on-nav/80 hover:bg-white/10 hover:text-on-nav"
                            >
                                <LogOut size={18}/>
                                <span className="hidden xl:inline">{t.navbar.signOut}</span>
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="ml-1 rounded-full bg-mint px-4 py-2 text-[14px] font-medium text-brand-ink
                            shadow-subtle transition hover:brightness-110"
                        >
                            {t.navbar.signIn}
                        </Link>
                    )}

                    <button
                        type="button"
                        onClick={() => setMenuOpen(open => !open)}
                        className="rounded-full p-2 hover:bg-white/10 md:hidden"
                        aria-label={menuOpen ? t.navbar.closeMenu : t.navbar.openMenu}
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? <X size={22}/> : <Menu size={22}/>}
                    </button>
                </div>
            </nav>
        </header>
    );
}
