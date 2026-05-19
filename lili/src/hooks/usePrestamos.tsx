import {useQuery} from "@tanstack/react-query";
import {getPrestamos, getPrestamosCedidos, getPrestamosRecibidos} from "../api/prestamoService.tsx";

export const usePrestamos = () => {
    return useQuery({
        queryKey: ["prestamos"],
        queryFn: getPrestamos,
    });
}

export const usePrestamosRecibidos = () => {
    return useQuery({
        queryKey: ["prestamos"],
        queryFn: getPrestamosRecibidos,
    });
}

export const usePrestamosCedidos = () => {
    return useQuery({
        queryKey: ["prestamos"],
        queryFn: getPrestamosCedidos,
    });
}