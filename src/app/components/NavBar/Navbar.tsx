"use client";

import api from "@/api";
import { useAuth } from "@/context/AuthContext";
import { type Language, useTranslation } from "@/context/I18nContext";
import { useToast } from "@/context/ToastContext";
import { Languages, LogOut, Menu, MonitorCog, Search, X } from "lucide-react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Icon from "../../../../public/icon.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type JSX, useEffect, useState } from "react";
import Image from "next/image";

import "./index.css";

export default function NavBar(): JSX.Element {
    const [menuOpen, setMenuOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const { t, setLanguage } = useTranslation();
    const { addToast } = useToast();
    const { state, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const handleResize = (): void => {
            if (window.innerWidth >= 768) {
                setMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const changeLanguage = (lng: Language): void => {
        // noinspection JSIgnoredPromiseFromCall
        setLanguage(lng);
        setLangMenuOpen(false);
    };

    const handleLogout = async (): Promise<void> => {
        try {
            const result = await api.logout();

            if (result.error) {
                console.error(result.error);
                addToast({
                    duration: 5000,
                    message: result.error.message,
                });
                return;
            }

            logout();
            router.push("/");
        } catch (error) {
            console.error(error);
            addToast({
                duration: 5000,
                message: (error as Error)?.message || "Error",
            });
        }
    };

    const toggleMenu = (): void => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className="navbar-header">
            <nav className="navbar-container">
                <div className="navbar-logo">
                    <Link href="/" className="navbar-link navbar-logo-link">
                        <Image 
                            height={70}
                            width={70}
                            src={Icon}
                            alt="CapChical"
                            quality={100}
                            priority
                            className="navbar-icon"
                        />
                    </Link>
                </div>

                <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
                    <ul className="navbar-menu-list">
                        <li>
                            <Link href="/search" className="navbar-link" onClick={() => setMenuOpen(false)}>
                                {t.navbar.search}
                                <Search className="ml-[8px]" size={24}/>
                            </Link>
                        </li>
                        <li>
                            <Link href="/compare" className="navbar-link" onClick={() => setMenuOpen(false)}>
                                {t.navbar.compare}
                            </Link>
                        </li>
                        <li>
                            <Link href="/history" className="navbar-link" onClick={() => setMenuOpen(false)}>
                                {t.navbar.history}
                            </Link>
                        </li>
                        <li>
                            <Link href="/about-us" className="navbar-link" onClick={() => setMenuOpen(false)}>
                                {t.navbar.aboutUs}
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="navbar-actions">
                    <div className="language-selector">
                        <button
                            onClick={() => setLangMenuOpen(!langMenuOpen)}
                            aria-label={t.navbar.changeLanguage}
                        >
                            <Languages size={24}/>
                        </button>
                        {langMenuOpen && (
                            <div className="language-dropdown">
                                <button onClick={() => changeLanguage("es")}>Español</button>
                                <button onClick={() => changeLanguage("en")}>English</button>
                            </div>
                        )}
                    </div>

                    {state.isAuthenticated
                        ? <>
                            <Link href="/admin-page" aria-label={t.navbar.adminPanel}>
                                <MonitorCog color={"#ffffff"} size={24}/>
                            </Link>
                            <button onClick={handleLogout} aria-label={t.navbar.signOut} className="logout-btn">
                                <span className="logout-text">{t.navbar.signOut}</span>
                                <LogOut size={24}/>
                            </button>
                        </>
                        : (
                            <Link href="/login" className="login-btn">
                                {t.navbar.signIn}
                            </Link>
                        )
                    }

                    <button
                        onClick={toggleMenu}
                        className="menu-toggle"
                        aria-label={menuOpen ? t.navbar.closeMenu : t.navbar.openMenu}
                    >
                        {menuOpen ? <X size={28}/> : <Menu size={28}/>}
                    </button>
                </div>
            </nav>
        </header>
    );
}
