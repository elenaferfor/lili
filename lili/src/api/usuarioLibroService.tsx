import api from "./Axios.tsx";
import type {UsuarioLibro} from "../types.tsx";

export const getUsuarioLibro = async (libroIdNum: number): Promise<UsuarioLibro | undefined> => {
    const { data } = await api.get(`/libros_usuarios/`);
    return data.results.find((result: any) => result.libro_detalle.id === libroIdNum) ?? null;
}

export const getUsuarioLibrosLista = async (): Promise<UsuarioLibro[] | undefined> => {
    const { data } = await api.get(`/libros_usuarios/?ordering=-fecha_anadido`);
    return data.results ?? null;
}

export const getUsuarioLibrosListaAbc = async (): Promise<UsuarioLibro[] | undefined> => {
    const { data } = await api.get(`/libros_usuarios/?ordering=libro__titulo`);
    return data.results ?? null;
}