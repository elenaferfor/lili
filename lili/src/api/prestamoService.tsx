import api from "./Axios.tsx";
import type {Prestamo} from "../types.tsx";

export const getPrestamos = async (): Promise<Prestamo[] | undefined> => {
    const { data } = await api.get("/prestamos/");
    return data.results;
}