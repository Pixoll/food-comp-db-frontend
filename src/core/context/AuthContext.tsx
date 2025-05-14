'use client'
import { createContext, ReactNode, useCallback, useContext, useEffect, useReducer, useState, } from "react";

type AuthState = {
  isAuthenticated: true;
  token: string;
  username: string;
} | {
  isAuthenticated: false;
  token: null;
  username: null;
};

type AuthAction = {
  type: "login";
  payload: {
    token: string;
    username: string;
  };
} | {
  type: "logout";
};

interface AuthContextType {
  state: AuthState;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "login":
      return {
        ...state,
        isAuthenticated: true,
        ...action.payload,
      };
    case "logout":
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        username: null,
      };
    default:
      return state;
  }
}

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [storedToken, setStoredToken] = useState(() => localStorage.getItem("token"));
  const [storedUsername, setStoredUsername] = useState(() => localStorage.getItem("username"));

  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: !!(storedToken && storedUsername),
    token: storedToken,
    username: storedUsername,
  } as AuthState);

  const login = useCallback((token: string, username: string) => {
    setStoredToken(token);
    setStoredUsername(username);
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    dispatch({
      type: "login",
      payload: { token, username },
    });
  }, []);

  const logout = useCallback(() => {
    setStoredToken("");
    setStoredUsername("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    dispatch({ type: "logout" });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      if (storedToken !== token || storedUsername !== username) {
        if (token && username) {
          login(token, username);
        } else if (storedToken || storedUsername) {
          logout();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [storedToken, storedUsername]);

  useEffect(() => {
    if (state.isAuthenticated) {
      setStoredToken(state.token);
      setStoredUsername(state.username);
      localStorage.setItem("token", state.token);
      localStorage.setItem("username", state.username);
    } else {
      setStoredToken("");
      setStoredUsername("");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    }
  }, [state.isAuthenticated, state.token, state.username]);

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for accessing AuthContext easily
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
