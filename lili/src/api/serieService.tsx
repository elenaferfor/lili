import api from "./Axios.tsx";
import type {Serie} from "../types.tsx";

export const getSeriesUsuario = async (): Promise<Serie[] | undefined> => {
    const { data } = await api.get("/series/");
    return data.results;
}