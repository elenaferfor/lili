import api from "./Axios.tsx";

type Categoria = {
    id: number;
    nombre: string;
    publica: boolean;
}

export const getCategoriasUsuario = async (): Promise<Categoria[] | undefined> => {
    const { data } = await api.get("/categorias?ordering=nombre");
    return data.results;
}