import api from "./Axios.tsx";

type Amistad = {
    id: number;
    usuario_a_nombre: {
        id: number;
        username: string;
    };
    usuario_b_nombre: {
        id: number;
        username: string;
    };
    estado: string;
    fecha_creacion: string;
    fecha_actualizacion: string;
}

export const getAmistades = async (): Promise<Amistad[] | undefined> => {
    const { data } = await api.get("/amistades?ordering=-fecha_actualizacion");
    return data.results;
}