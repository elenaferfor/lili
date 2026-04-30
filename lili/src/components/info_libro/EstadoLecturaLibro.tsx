import {useEffect, useRef, useState} from "react";
import api from "../../api/Axios.tsx";
import {useParams} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import { useUsuarioLibro } from "../../hooks/useUsuarioLibro.tsx";

type SyncEstado = "idle" | "pendiente" | "enviando" | "ok";

type EstadoOpcion = {
    valor: string;
    texto: string;
    clase: string;
    icono: string;
}

const ESTADOS: EstadoOpcion[] = [
    { valor: "leido", texto: "Leído", clase:"estadoVerde", icono:"check"},
    { valor: "leyendo", texto: "Leyendo", clase:"estadoNaranja", icono:"menu_book"},
    { valor: "abandonado", texto: "Abandonado", clase:"estadoRojo", icono:"close"},
    { valor: "s_e", texto: "Sin empezar", clase:"", icono:""}
]

const EstadoLecturaLibro = () => {
    const { libroId } = useParams<{ libroId: string }>();
    const libroIdNum = Number(libroId);
    const queryClient = useQueryClient();
    
    const [estadoSeleccionado, setEstadoSeleccionado] = useState<EstadoOpcion>(ESTADOS[3]);
    const [sync, setSync] = useState<SyncEstado>("idle");
    const [estadoIsOpen, setEstadoIsOpen] = useState(false);

    const estadoRef = useRef<HTMLDivElement>(null);
    const btnEstadoRef = useRef<HTMLButtonElement>(null);

    // Traer estado actual
    const { data: usuarioLibro } = useUsuarioLibro(libroIdNum);

    useEffect(() => {
        if(!usuarioLibro) return;
        const opcion = ESTADOS.find(e => e.valor === usuarioLibro.estado) ?? ESTADOS[3];
        setEstadoSeleccionado(opcion);
    }, [usuarioLibro]);
    
    // Mutación para nuevo estado
    const { mutate: guardarEstado } = useMutation({
        mutationFn: (nuevoEstado: string) =>
            api.post(`/libros_usuarios/${usuarioLibro?.id}/cambiar_estado/`, { estado: nuevoEstado }),
        
        onMutate: () => setSync("enviando"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["estadoLibro", libroIdNum] });
            setSync("ok");
            setTimeout(() => setSync("idle"), 1500);
        },
        onError: () => setSync("idle"),
    });
    
    
    const toggleEstado = () => {
        setEstadoIsOpen(!estadoIsOpen);
    }

    useEffect(() => {
        if(estadoIsOpen){
            document.addEventListener("mousedown", handleClickFueraEstado);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickFueraEstado);
        }
    }, [estadoIsOpen]);

    const handleClickFueraEstado = (e: MouseEvent) => {
        if(estadoRef.current && !estadoRef.current.contains(e.target as Node) && !btnEstadoRef.current?.contains(e.target as Node)) {
            toggleEstado();
        }
    }

    const handleEstado = (opcion: EstadoOpcion) => {
        setEstadoSeleccionado(opcion);
        setEstadoIsOpen(false);
        guardarEstado(opcion.valor);
    }
    
    const syncIcono = () => {
        if(sync === "enviando") return <i className="material-symbols-rounded sync-enviando">sync</i>;
        if(sync === "ok") return <i className="material-symbols-rounded sync-ok">check_circle</i>;
        return null;
    };


    return <div id="estadoLectura">
        <button className={estadoSeleccionado.clase} onClick={toggleEstado} ref={btnEstadoRef}>
            {estadoSeleccionado.texto} 
            <i className="material-symbols-rounded">{estadoSeleccionado.icono}</i>
            {syncIcono()}
        </button>
        { estadoIsOpen && (
            <div className="estadoLecturaOpciones" ref={estadoRef}>
                {ESTADOS.map(opcion => (
                    <button
                        key={opcion.valor}
                        className={opcion.clase}
                        onClick={() => handleEstado(opcion)}
                    >
                        {opcion.texto}
                        {opcion.icono && <i className="material-symbols-rounded">{opcion.icono}</i>}
                    </button>
                ))}
            </div>
            )
        }
    </div>
}

export default EstadoLecturaLibro;