"use client";

import api from "@/api";
import { createContext, type JSX, type ReactNode, useCallback, useContext, useEffect, useReducer } from "react";

type AuthState = {
    isAuthenticated: boolean;
    /** true cuando ya se consultó la sesión al backend al menos una vez. */
    checked: boolean;
};

type AuthAction = {
    type: "login" | "logout";
};

type AuthContextType = {
    state: AuthState;
    login: () => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "login":
            return {
                ...state,
                isAuthenticated: true,
                checked: true,
            };
        case "logout":
            return {
                ...state,
                isAuthenticated: false,
                checked: true,
            };
        default:
            return state;
    }
}

type AuthProviderProps = {
    children: ReactNode;
};

const SESSION_CHECK_INTERVAL = 5 * 60_000;

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const [state, dispatch] = useReducer(authReducer, { isAuthenticated: false, checked: false });

    // revisa la sesión al cargar y luego cada cierto tiempo (la cookie puede expirar)
    useEffect(() => {
        let cancelled = false;

        const checkStatus = async (): Promise<void> => {
            const response = await api.getSessionInfo().catch(error => ({ error }));
            if (!cancelled) {
                dispatch({ type: response.error ? "logout" : "login" });
            }
        };

        void checkStatus();
        const interval = setInterval(() => void checkStatus(), SESSION_CHECK_INTERVAL);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    const login = useCallback(() => dispatch({ type: "login" }), []);
    const logout = useCallback(() => dispatch({ type: "logout" }), []);

    return (
        <AuthContext.Provider value={{ state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
