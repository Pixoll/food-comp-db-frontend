"use client";

import api from "@/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Languages, LogOut, Menu, MonitorCog, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./index.css";

export default function NavBar(): JSX.Element {
    const [menuOpen, setMenuOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const { t, i18n } = useTranslation();
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

    const changeLanguage = (lng: string): void => {
        // noinspection JSIgnoredPromiseFromCall
        i18n.changeLanguage(lng);
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
                    <Link href="/" className="navbar-link">
                        {t("navbar.home")}
                    </Link>
                </div>

                <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
                    <ul className="navbar-menu-list">
                        <li>
                            <Link href="/search" className="navbar-link" onClick={() => setMenuOpen(false)}>
                                Buscar
                                <Search className="ml-[8px]" size={24}/>
                            </Link>
                        </li>
                        <li>
                            <Link href="/compare" className="navbar-link" onClick={() => setMenuOpen(false)}>
                                Comparar
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="navbar-actions">
                    <div className="language-selector">
                        <button onClick={() => setLangMenuOpen(!langMenuOpen)} aria-label="Change language">
                            <Languages size={24}/>
                        </button>
                        {langMenuOpen && (
                            <div className="language-dropdown">
                                <button onClick={() => changeLanguage("es")}>{t("navbar.spanish")}</button>
                                <button onClick={() => changeLanguage("en")}>{t("navbar.english")}</button>
                            </div>
                        )}
                    </div>

                    {state.isAuthenticated ? (
                        <>
                            <Link href="/admin-page" aria-label="Admin panel">
                                <MonitorCog color={"#ffffff"} size={24}/>
                            </Link>
                            <button onClick={handleLogout} aria-label="Log out" className="logout-btn">
                                <span className="logout-text">{t("navbar.close")}</span>
                                <LogOut size={24}/>
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="login-btn">
                            Iniciar sesión
                        </Link>
                    )}

                    <button
                        onClick={toggleMenu} className="menu-toggle"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                    >
                        {menuOpen ? <X size={28}/> : <Menu size={28}/>}
                    </button>
                </div>
            </nav>
        </header>
    );
}
