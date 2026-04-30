import {useQuery} from "@tanstack/react-query";
import { getUsuarioLibro, getCategoriasUsuario} from "../api/ilbroService.tsx";

export const useUsuarioLibro = (libroIdNum: number) => {
    return useQuery({
        queryKey: ["usuarioLibro", libroIdNum],
        queryFn: () => getUsuarioLibro(libroIdNum),
    });
};

export const useCategorias = () => {
    return useQuery({
        queryKey: ["categoriasUsuario"],
        queryFn: getCategoriasUsuario,
    });
}