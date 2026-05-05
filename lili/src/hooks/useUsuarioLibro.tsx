import {useQuery} from "@tanstack/react-query";
import { getUsuarioLibro} from "../api/usuarioLibroService.tsx";

export const useUsuarioLibro = (libroIdNum: number) => {
    return useQuery({
        queryKey: ["usuarioLibro", libroIdNum],
        queryFn: () => getUsuarioLibro(libroIdNum),
    });
};