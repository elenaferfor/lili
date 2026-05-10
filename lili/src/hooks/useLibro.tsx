import {useQuery, type UseQueryOptions} from "@tanstack/react-query";
import {getLibrosPorGeneral, getLibroPorISBN} from "../api/libroService.tsx";

export const useLibroISBN = (isbn: string, options?: Partial<UseQueryOptions>) => {
    return useQuery({
        queryKey: ["libroISBN", isbn],
        queryFn: () => getLibroPorISBN(isbn),
        ...options,
    });
};

export const useLibroGeneral = (busqueda: string) => {
    return useQuery({
        queryKey: ["libroGeneral", busqueda],
        queryFn: () => getLibrosPorGeneral(busqueda),
    });
};