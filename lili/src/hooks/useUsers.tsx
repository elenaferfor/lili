import {useQuery} from "@tanstack/react-query";
import {getUsuario, getUsuarioPorID} from "../api/usuarioService.tsx";

export const useUsuario = (nombre: string) => {
    return useQuery({
        queryKey: ["usuario", nombre],
        queryFn: () => getUsuario(nombre),
    });
};

export const useUsuarioID = (id: number) => {
    return useQuery({
        queryKey: ["usuario", id],
        queryFn: () => getUsuarioPorID(id),
    });
};