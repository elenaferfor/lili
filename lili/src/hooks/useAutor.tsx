import {useQuery} from "@tanstack/react-query";
import {getAutor} from "../api/autorService.tsx";


export const useAutor = (nombre: string) => {
    return useQuery({
        queryKey: ["autor", nombre],
        queryFn: () => getAutor(nombre),
    });
};