import {useQuery} from "@tanstack/react-query";
import {getLibrosPorGeneral, getLibroPorISBN} from "../api/libroService.tsx";

export const useLibroISBN = (isbn: string) => {
    return useQuery({
        queryKey: ["libroISBN", isbn],
        queryFn: () => getLibroPorISBN(isbn),
    });
};

export const useLibroGeneral = (busqueda: string) => {
    return useQuery({
        queryKey: ["libroGeneral", busqueda],
        queryFn: () => getLibrosPorGeneral(busqueda),
    });
};