"use client";

import api from "@/api";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useReducer, useRef } from "react";

type AuthState = {
    isAuthenticated: boolean;
};

type AuthAction = {
    type: "login" | "logout";
};

interface AuthContextType {
    state: AuthState;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "login":
            return {
                ...state,
                isAuthenticated: true,
            };
        case "logout":
            return {
                ...state,
                isAuthenticated: false,
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
    const [state, dispatch] = useReducer(authReducer, { isAuthenticated: false });
    const intervalRef = useRef<number>(0);

    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        checkStatus();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
        // eslint-disable-next-line
    }, []);

    const checkStatus = async (): Promise<void> => {
        const response = await api.getSessionInfo().catch(error => ({ error }));

        if (response.error) {
            if (state.isAuthenticated) {
                logout();
            }
        } else {
            if (!state.isAuthenticated) {
                login();
            }
        }
    };

    // noinspection com.intellij.reactbuddy.ExhaustiveDepsInspection
    const login = useCallback(() => {
        dispatch({ type: "login" });

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(checkStatus, SESSION_CHECK_INTERVAL) as unknown as number;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // noinspection com.intellij.reactbuddy.ExhaustiveDepsInspection
    const logout = useCallback(() => {
        dispatch({ type: "logout" });

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = 0;
        }
    }, []);

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
