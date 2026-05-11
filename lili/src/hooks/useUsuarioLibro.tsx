import {useQuery} from "@tanstack/react-query";
import {getUsuarioLibro, getUsuarioLibrosLista} from "../api/usuarioLibroService.tsx";

export const useUsuarioLibro = (libroIdNum: number) => {
    return useQuery({
        queryKey: ["usuarioLibro", libroIdNum],
        queryFn: () => getUsuarioLibro(libroIdNum),
    });
};

export const useUsuarioLibrosLista = () => {
    return useQuery({
        queryKey: ["usuarioLibrosLista"],
        queryFn: () => getUsuarioLibrosLista(),
    });
};