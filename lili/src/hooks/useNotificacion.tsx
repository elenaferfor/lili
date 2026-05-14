import {useQuery} from "@tanstack/react-query";
import {getNotificaciones} from "../api/notificacionService.tsx";

export const useNotificaciones = () => {
    return useQuery({
        queryKey: ["notificaciones"],
        queryFn: getNotificaciones,
    });
}