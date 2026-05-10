import api from "./Axios.tsx";

type Editorial = {
    id: number;
    nombre: string;
}

export const getEditoriales = async (): Promise<Editorial[] | undefined> => {
    const { data } = await api.get("/editoriales/");
    return data.results;
}