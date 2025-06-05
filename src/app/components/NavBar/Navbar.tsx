'use client';

import { useState, useEffect } from 'react';
import { Languages, LogOut, MonitorCog, Search, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import makeRequest from "@/utils/makeRequest";
import "./index.css"

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { addToast } = useToast();
  const { state, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLangMenuOpen(false);
  };

  const handleLogout = () => {
    makeRequest("delete", `/admins/${state.username}/session`, {
      token: state.token,
      successCallback: (response) => {
        console.log(response.data)
        if (response.data < 400) {
          logout();
          router.push("/");
        }
      },
      errorCallback: (error) => {
        addToast({
          duration: 5000,
          message: error.response?.data?.message || error.message || "Error",
        });
      },
    });
  };

  const toggleMenu = () => {
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
                    <MonitorCog color={"#FFFFFF"} size={24}/>
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

            <button onClick={toggleMenu} className="menu-toggle"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}>
              {menuOpen ? <X size={28}/> : <Menu size={28}/>}
            </button>
          </div>
        </nav>
      </header>
  );
};

export default NavBar;
