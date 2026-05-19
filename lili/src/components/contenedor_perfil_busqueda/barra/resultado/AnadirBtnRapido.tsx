import {useUsuarioLibro} from "../../../../hooks/useUsuarioLibro.tsx";
import {useEffect, useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import api from "../../../../api/Axios.tsx";
import {useAuth} from "../../../../auth/AuthContext.tsx";
import type {UsuarioLibroPostRequest, SyncEstado} from "../../../../types.tsx";
import {importarLibroOpenLibrary} from "../../../../api/libroService.tsx";

const AnadirBtnRapido = (props: any) => {
    
    const [tieneLibro, setTieneLibro] = useState<boolean>(false);
    const [sync, setSync] = useState<SyncEstado>("idle");
    const queryClient = useQueryClient();
    const [requestBody, setRequestBody] = useState<UsuarioLibroPostRequest>();
    const { user } = useAuth();

    const [libroId, setLibroId] = useState<number | undefined>(props.item.id);
    
    // Libros usuario
    const { data: usuarioLibro} = useUsuarioLibro(libroId!);
    
    // Mutación crear libroUsuario
    const { mutate: crearLibroUsuario } = useMutation({
        mutationFn: async () => {
            let resolvedId = props.item.id;
            
            // Libro de Openlibrary
            if(props.item.fuente === "openlibrary"){
                const libro = await importarLibroOpenLibrary(props.item.isbn);
                resolvedId = libro?.id;
            }
            
            const response = await api.post(`/libros_usuarios/`, {
                ...requestBody,
                libro: resolvedId,
            });
            
            return { response, resolvedId };
        },
        onMutate: () => setSync("enviando"),
        onSuccess: ({ resolvedId }) => {
            setLibroId(resolvedId);
            queryClient.invalidateQueries({ queryKey: ["usuarioLibro", resolvedId] });
            setSync("ok");
            setTimeout(() => setSync("idle"), 1500);
        },
        onError: () => setSync("idle"),
    });
    
    // Mutación borrar libroUsuario
    const { mutate: borrarLibroUsuario } = useMutation({
        mutationFn: () =>
            api.delete(`/libros_usuarios/${usuarioLibro?.id}/`),
        onMutate: () => setSync("enviando"),
        onSuccess: () => {
            console.log("DELETE ok, invalidando query...");
            queryClient.invalidateQueries({ queryKey: ["usuarioLibro", props.item.id] });
            setSync("ok");
            setTimeout(() => setSync("idle"), 1500);
        },
        onError: (error) => {
            console.log("DELETE error: ", error);
            setSync("idle");
        }
    });
    
    
    useEffect(() => {
        if(!usuarioLibro){
            setTieneLibro(false);
            setRequestBody({
                "usuario": user?.id,
                "libro": props.item.id,
                "serie": null,
                "numero_en_serie": null,
                "estado": "s_e",
                "favorito": false,
                "publico": true,
                "categorias": []
            });
            return;
        }
        
        setTieneLibro(true);
        
    }, [usuarioLibro]);

    const syncIcono = () => {
        if(sync === "enviando") return <i className="material-symbols-rounded">sync</i>;
        if(sync === "ok") return <i className="material-symbols-rounded">check_circle</i>;
        return null;
    };
    
    return <>
        { tieneLibro ?
            <button className="resultadoBorrar" onClick={() => borrarLibroUsuario()}>Borrar {syncIcono()}
            </button> :
            <button className="resultadoAnadir" onClick={() => crearLibroUsuario()}>Añadir rápido {syncIcono()}
            </button>
    }</>
}

export default AnadirBtnRapido;