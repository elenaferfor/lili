import {useQuery} from "@tanstack/react-query";
import {getUsuario} from "../api/usuarioService.tsx";

export const useUsuario = (nombre: string) => {
    return useQuery({
        queryKey: ["usuario", nombre],
        queryFn: () => getUsuario(nombre),
    });
};