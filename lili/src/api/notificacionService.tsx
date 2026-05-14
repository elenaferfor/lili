import api from "./Axios.tsx";
import type {Notificacion} from "../types.tsx";

export const getNotificaciones = async (): Promise<Notificacion[] | undefined> => {
    const { data } = await api.get("/notificaciones?ordering=-fecha_creacion");
    return data.results;
}