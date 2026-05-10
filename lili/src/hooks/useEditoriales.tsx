import {useQuery} from "@tanstack/react-query";
import {getEditoriales} from "../api/editorialService.tsx";

export const useEditoriales = () => {
    return useQuery({
        queryKey: ["editoriales"],
        queryFn: getEditoriales,
    });
}