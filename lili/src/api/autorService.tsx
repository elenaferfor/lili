import api from "./Axios.tsx";

type Autor = {
    id: number;
    nombre: string;
    openlibrary_key: string;
    libros: { id: number; titulo: string; portada: string }[];
};

export const getAutor = async (nombre: string): Promise<Autor | undefined> => {
    const { data } = await api.get(`/autores/?search=${nombre}`);
    const nombre_n = nombre.trim().toLowerCase();
    return data.results.find(
        (autor: Autor) => autor.nombre.toLowerCase() === nombre_n) ?? null;
}

export const getAutores = async (): Promise<Autor[] | undefined> => {
    const { data } = await api.get("/autores/");
    return data.results;
}