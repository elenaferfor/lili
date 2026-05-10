import {useQuery} from "@tanstack/react-query";
import {getAutor, getAutores} from "../api/autorService.tsx";


export const useAutor = (nombre: string) => {
    return useQuery({
        queryKey: ["autor", nombre],
        queryFn: () => getAutor(nombre),
    });
};

export const useAutores = () => {
    return useQuery({
        queryKey: ["autor"],
        queryFn: () => getAutores(),
    })
}