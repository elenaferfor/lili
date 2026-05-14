import api from "./Axios.tsx";

type Categoria = {
    id: number;
    usuario: number;
    nombre: string;
    publica: boolean;
}

export const getCategoriasUsuario = async (): Promise<Categoria[] | undefined> => {
    const { data } = await api.get("/categorias?ordering=nombre");
    return data.results;
}

export const getCategoriasPublicas = async (): Promise<Categoria[] | undefined> => {
    const { data } = await api.get("/categorias/publicas/");
    return data;
}

export const getCategoriasOtroUsuario = async (usuario_id: number): Promise<Categoria[] | undefined> => {
    const { data } = await api.get(`/categorias/publicas?usuario=${usuario_id}`);
    return data;
}