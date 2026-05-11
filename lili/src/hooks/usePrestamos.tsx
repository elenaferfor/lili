import {useQuery} from "@tanstack/react-query";
import {getPrestamos} from "../api/prestamoService.tsx";

export const usePrestamos = () => {
    return useQuery({
        queryKey: ["prestamos"],
        queryFn: getPrestamos,
    });
}