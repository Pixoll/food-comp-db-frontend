import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
  Dispatch,
  useContext,
  useState,
} from "react";

type AuthState =
  | {
      isAuthenticated: true;
      token: string;
      username: string;
    }
  | {
      isAuthenticated: false;
      token: null;
      username: null;
    };

type AuthAction =
  | {
      type: "LOGIN";
      payload: {
        token: string;
        username: string;
      };
    }
  | {
      type: "LOGOUT";
    };

interface AuthContextType {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
  logout: () => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  username: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        ...action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        username: null,
      };
    default:
      return state;
  }
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [storedToken, setStoredToken] = useState(() =>
    localStorage.getItem("token")
  );
  const [storedUsername, setStoredUsername] = useState(() =>
    localStorage.getItem("username")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      if (storedToken !== token || storedUsername !== username) {
        if (token && username) {
          setStoredToken(token);
          setStoredUsername(username);
          localStorage.setItem("token", token ?? "");
          localStorage.setItem("username", username ?? "");
          dispatch({
            type: "LOGIN",
            payload: { token, username },
          });
        } else {
          setStoredToken("");
          setStoredUsername("");
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          dispatch({ type: "LOGOUT" });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
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

  const logout = useCallback(() => {
    setStoredToken("");
    setStoredUsername("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    dispatch({ type: "LOGOUT" });
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing AuthContext easily
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
