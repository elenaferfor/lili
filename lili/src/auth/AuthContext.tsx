import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import api from "../api/Axios.tsx";

interface User {
    id: number;
    username: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
    
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Al cargar la página comprueba si la cookie de sesión es válida
    useEffect(() => {
        api.get("/auth/login/")
            .then(response => setUser(response.data))
            .catch( () => setUser(null))
            .finally(() => setLoading(false));
    }, []);
    
    const login = async (username: string, password: string) => {
        const { data } = await api.post("/auth/login/", { username, password });
        setUser(data.user);
    };
    
    const logout = async () => {
        await api.post("/auth/logout/");
        setUser(null);
    };
    
    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
    
}

export default AuthProvider;
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return context;
}