import React, {
    createContext,
    useReducer,
    useEffect,
    useCallback,
    ReactNode,
    Dispatch,
} from 'react';

interface AuthState {
    isAuthenticated: boolean;
    userType: string | null;
    token: string | null;
}

type AuthAction =
    | { type: 'LOGIN'; payload: { userType: string; token: string } }
    | { type: 'LOGOUT' };

interface AuthContextType {
    state: AuthState;
    dispatch: Dispatch<AuthAction>;
    logout: () => void;
}

const initialState: AuthState = {
    isAuthenticated: false,
    userType: null,
    token: null,
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isAuthenticated: true,
                userType: action.payload.userType,
                token: action.payload.token,
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                userType: null,
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
        const userType = localStorage.getItem('userType');
        if (token && userType) {
            dispatch({
                type: 'LOGIN',
                payload: { token, userType },
            });
        }
    }, []);
    
    useEffect(() => {
        if (state.isAuthenticated) {
            localStorage.setItem('token', state.token!);
            localStorage.setItem('userType', state.userType!);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
        }
    }, [state.isAuthenticated]);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        dispatch({ type: 'LOGOUT' });
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
