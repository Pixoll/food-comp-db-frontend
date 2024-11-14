import React, {
    createContext,
    useReducer,
    useEffect,
    useCallback,
    ReactNode,
    Dispatch,
    useContext,
  } from 'react';
  
  interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
  }
  
  type AuthAction = { type: 'LOGIN'; payload: { token: string } } | { type: 'LOGOUT' };
  
  interface AuthContextType {
    state: AuthState;
    dispatch: Dispatch<AuthAction>;
    logout: () => void;
  }
  
  const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
  };
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
      case 'LOGIN':
        return {
          ...state,
          isAuthenticated: true,
          token: action.payload.token,
        };
      case 'LOGOUT':
        return {
          ...state,
          isAuthenticated: false,
          token: null,
        };
      default:
        return state;
    }
  };
  
  interface AuthProviderProps {
    children: ReactNode;
  }
  
  const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        dispatch({
          type: 'LOGIN',
          payload: { token },
        });
      }
    }, []);
  
    useEffect(() => {
      if (state.isAuthenticated) {
        localStorage.setItem('token', state.token!);
      } else {
        localStorage.removeItem('token');
      }
    }, [state.isAuthenticated, state.token]);
  
    const logout = useCallback(() => {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
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
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };
  
  export { AuthProvider, useAuth };
  