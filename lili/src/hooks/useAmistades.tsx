import {useQuery} from "@tanstack/react-query";
import {getAmistades} from "../api/amistadService.tsx";

export const useAmistades = () => {
    return useQuery({
        queryKey: ["amistades"],
        queryFn: getAmistades,
    });
}