import {useQuery} from "@tanstack/react-query";
import {getCategoriasOtroUsuario, getCategoriasPublicas, getCategoriasUsuario} from "../api/categoriaService.tsx";

export const useCategorias = () => {
    return useQuery({
        queryKey: ["categoriasUsuario"],
        queryFn: getCategoriasUsuario,
    });
}

export const useCategoriasPublicas = () => {
    return useQuery({
        queryKey: ["categoriasPublicas"],
        queryFn: getCategoriasPublicas,
    });
}

export const useCategoriasOtroUsuario = (usuario_id: number) => {
    return useQuery({
        queryKey: ["categoriasOtroUsuario"],
        queryFn: () => getCategoriasOtroUsuario(usuario_id),
    });
}