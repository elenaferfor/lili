import {useAuth} from "../../auth/AuthContext.tsx";
import {Navigate} from "react-router-dom";
import type {ReactNode} from "react";

interface Props {
    children: ReactNode;
}

const RutaProtegida = ({children}: Props) => {
    const { user, loading } = useAuth();
    
    if(loading) return <p>Cargando...</p>;
    if(!user) return <Navigate to="/login" replace/>;
    
    return children;
}

export default RutaProtegida;