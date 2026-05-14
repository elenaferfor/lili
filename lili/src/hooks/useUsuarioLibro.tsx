import {useQuery} from "@tanstack/react-query";
import {
    getUsuarioLibro,
    getUsuarioLibrosLista,
    getUsuarioLibrosListaAbc,
    getUsuarioLibrosOtroUsuario
} from "../api/usuarioLibroService.tsx";

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

export const useUsuarioLibrosListaAbc = () => {
    return useQuery({
        queryKey: ["usuarioLibrosListaAbc"],
        queryFn: () => getUsuarioLibrosListaAbc(),
    });
};

export const useUsuarioLibrosOtroUsuario = (usuario_id: number) => {
    return useQuery({
        queryKey: ["usuarioLibrosOtroUsuario", usuario_id],
        queryFn: () => getUsuarioLibrosOtroUsuario(usuario_id),
    });
};