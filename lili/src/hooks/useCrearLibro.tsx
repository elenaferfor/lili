// Resolver editoriales y autores (si no existe, lo crea; si existe, devuelve ID)
import {useMutation} from "@tanstack/react-query";
import api from "../api/Axios.tsx";

export const useOrCreateEditorial = () => {
    return useMutation({
        mutationFn: (nombre: string) =>
            api.post('/editoriales/', {nombre}).then(res => res.data.id),
    });
}
export const useOrCreateAutor = () => {
    return useMutation({
        mutationFn: (nombre: string) =>
            api.post('/autores/', {nombre}).then(res => res.data.id),
    });
}