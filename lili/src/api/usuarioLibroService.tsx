import api from "./Axios.tsx";

type UsuarioLibro = {
    id: number;
    estado: string;
    categorias_detalle: { id: number; nombre: string }[];
    favorito: boolean;
};

export const getUsuarioLibro = async (libroIdNum: number): Promise<UsuarioLibro | undefined> => {
    const { data } = await api.get(`/libros_usuarios/`);
    return data.results.find((result: any) => result.libro_detalle.id === libroIdNum) ?? null;
}

export const getUsuarioLibrosLista = async (): Promise<UsuarioLibro[] | undefined> => {
    const { data } = await api.get(`/libros_usuarios/?ordering=-fecha_anadido`);
    return data.results ?? null;
}