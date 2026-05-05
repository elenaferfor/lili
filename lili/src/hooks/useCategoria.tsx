import {useQuery} from "@tanstack/react-query";
import {getCategoriasUsuario} from "../api/categoriaService.tsx";

export const useCategorias = () => {
    return useQuery({
        queryKey: ["categoriasUsuario"],
        queryFn: getCategoriasUsuario,
    });
}