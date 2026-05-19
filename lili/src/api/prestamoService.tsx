import api from "./Axios.tsx";
import type {Prestamo} from "../types.tsx";

export const getPrestamos = async (): Promise<Prestamo[] | undefined> => {
    const { data } = await api.get("/prestamos/");
    return data.results;
}

export const getPrestamosRecibidos = async (): Promise<Prestamo[] | undefined> => {
    const { data } = await api.get("/prestamos/recibidos/");
    return data.results;
}

export const getPrestamosCedidos = async (): Promise<Prestamo[] | undefined> => {
    const { data } = await api.get("/prestamos/cedidos/");
    return data.results;
}