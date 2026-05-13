import api from "./Axios.tsx";

type Libro = {
    id: number;
    isbn: string;
    titulo: string;
    formato: string;
    ano_pub: string;
    ano_pub_og: string;
    portada: string;
    sinopsis: string;
    openlibrary_key: string;
    fecha_actualizacion: string;
    autores_detalle: { id: number; nombre: string }[];
    editorial_detalle: { id: number; nombre: string }[];
};

export type LibroGet = {
    id: number;
    titulo: string;
    isbn: string;
    formato: string;
    ano_pub: string;
    ano_pub_og: string;
    portada: string;
    sinopsis: string;
    openlibrary_key: string;
    fecha_actualizacion: string;
    autores_detalle: { id:number; nombre: string; }[];
    editorial_detalle: { id: number; nombre: string; };
}

// Por isbn
export const getLibroPorISBN = async (isbn: string): Promise<Libro | undefined> => {
    const { data } = await api.get(`/libros/`);
    return data.results.find((result: any) => result.isbn === isbn) ?? null;
}

// Por ID
export const getLibroPorID = async (id: number): Promise<LibroGet | undefined> => {
    const { data } = await api.get(`/libros/`);
    return data.results.find((result: any) => result.id === id) ?? undefined;
}

// General
export const getLibrosPorGeneral = async (busqueda: string): Promise<LibroGet[] | undefined> => {
    const { data } = await api.get(`/libros/?search=${busqueda}`);
    return data.results ?? [];
}

// Sin términos
export const getLibros = async (): Promise <Libro[] | undefined> => {
    const { data } = await api.get(`/libros?ordering=titulo/`);
    return data.results;
}