import api from "./Axios.tsx";

type Usuario = {
    id: number;
    username: string;
};

export const getUsuario = async (nombre: string): Promise<Usuario | undefined> => {
    const { data } = await api.get(`/usuarios/?search=${nombre}`);
    const nombre_n = nombre.trim().toLowerCase();
    return data.results.find(
        (usuario: Usuario) => usuario.username.toLowerCase() === nombre_n) ?? null;
}

export const getUsuarios = async (): Promise<Usuario[] | undefined> => {
    const { data } = await api.get(`/usuarios/`);
    return data.results;
}