"use client";

import { type Theme, THEME_KEY } from "@/utils/theme";
import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot(): Theme {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerSnapshot(): Theme {
    return "light";
}

function applyTheme(theme: Theme): void {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch {
        // modo privado o almacenamiento bloqueado: el tema solo dura esta visita
    }
    listeners.forEach(listener => listener());
}

/** Tema actual (claro u oscuro) y funciones para cambiarlo. */
export function useTheme(): { theme: Theme; setTheme: (theme: Theme) => void; toggleTheme: () => void } {
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const toggleTheme = useCallback(() => applyTheme(getSnapshot() === "dark" ? "light" : "dark"), []);

    return { theme, setTheme: applyTheme, toggleTheme };
}
