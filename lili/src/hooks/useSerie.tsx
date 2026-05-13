import {useQuery} from "@tanstack/react-query";
import {getSeriesUsuario} from "../api/serieService.tsx";

export const useSeries = () => {
    return useQuery({
        queryKey: ["seriesUsuario"],
        queryFn: getSeriesUsuario,
    });
}