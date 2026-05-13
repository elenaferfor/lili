import {useQuery, type UseQueryOptions} from "@tanstack/react-query";
import {getLibrosPorGeneral, getLibroPorISBN, getLibros, getLibroPorID, type LibroGet} from "../api/libroService.tsx";

export const useLibroISBN = (isbn: string, options?: Partial<UseQueryOptions>) => {
    return useQuery({
        queryKey: ["libroISBN", isbn],
        queryFn: () => getLibroPorISBN(isbn),
        ...options,
    });
};

export const useLibroID = (id: number) => {
    return useQuery<LibroGet | undefined>({
        queryKey: ["libroID", id],
        queryFn: () => getLibroPorID(id)
    });
};

export const useLibroGeneral = (busqueda: string) => {
    return useQuery({
        queryKey: ["libroGeneral", busqueda],
        queryFn: () => getLibrosPorGeneral(busqueda),
    });
};

export const useLibros = () => {
    return useQuery({
        queryKey: ["libros"],
        queryFn: () => getLibros(),
    });
};