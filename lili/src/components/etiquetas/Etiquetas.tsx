import './Etiquetas.css';
import {useEffect, useRef, useState} from "react";
import BotonEtiqueta from "./BotonEtiqueta.tsx";
import NuevaEtiqueta from "./NuevaEtiqueta.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import api from "../../api/Axios.tsx";
import {useAuth} from "../../auth/AuthContext.tsx";

type SyncEstado = "idle" | "pendiente" | "enviando" | "ok";

type CatPost = {
    "usuario": number | undefined;
    "nombre": string;
    "publica": boolean;
}

const Etiquetas = (props: any) => {
    
    const categoriasPpales = ["Leyendo", "Lista de deseos", "Prestados", "Préstamos"];
    const [tagActivo, setTagActivo] = useState(0);
    
    const queryClient = useQueryClient();
    const [sync, setSync] = useState<SyncEstado>("idle");
    const [nuevaCategoria, setNuevaCategoria] = useState<CatPost>();
    const { user } = useAuth();
    
    const [inputIsOpen, setInputIsOpen] = useState<boolean>(false);
    const inputRef = useRef<HTMLDivElement>(null);
    const btnCrearRef = useRef<HTMLButtonElement>(null);
    const btnCerrarRef = useRef<HTMLButtonElement>(null);
    const btnGuardarRef = useRef<HTMLButtonElement>(null);
    
    const onClickTag = (pos: number, name: string) =>{
        setTagActivo(pos);
        props.onChangeTag(name);
    }
    
    // Mutación crear categoría
    const { mutate: crearCategoria } = useMutation({
        mutationFn: () =>
            api.post(`/categorias/`, nuevaCategoria),
        onMutate: () => setSync("enviando"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categoriasUsuario"] });
            setSync("ok");
            setTimeout(() => setSync("idle"), 1500);
        },
        onError: () => setSync("idle"),
    });
    
    
    // Manejar abrir y cerrar input de crear
    useEffect(() => {
        if(inputIsOpen){
            document.addEventListener("mousedown", cerrarInput);
        }
        return () => {
            document.removeEventListener("mousedown", cerrarInput);
        }
    }, [inputIsOpen]);
    
    const abrirInput = () => {
        if(btnCrearRef.current) {
            setInputIsOpen(true);
        }
    }
    
    const cerrarInput = (e: MouseEvent) => {
        const clickEnCerrar = btnCerrarRef.current?.contains(e.target as Node);
        const clickEnInput = inputRef.current?.contains(e.target as Node);
        const clickEnAbrir = btnCrearRef.current?.contains(e.target as Node);
            
        if(clickEnCerrar || (!clickEnInput && !clickEnAbrir)){
            setInputIsOpen(false);
        }
    }
    
    const crearTag = (nombre: string) => {
        setNuevaCategoria({
            "usuario": user?.id,
            "nombre": nombre,
            "publica": true,
        })
        crearCategoria();
        setInputIsOpen(false);
    }

    const syncIcono = () => {
        if(sync === "enviando") return <i className="material-symbols-rounded sync-enviando">sync</i>;
        if(sync === "ok") return <i className="material-symbols-rounded sync-ok">check_circle</i>;
        return null;
    };
    
    return <div className="tags">
        <div className="tags_ppales">
            <BotonEtiqueta nombreBoton="Todos" index={0} className={tagActivo === 0 ? "activo" : ""} onClick={onClickTag}/>
            <BotonEtiqueta nombreBoton="Leyendo" index={1} className={tagActivo === 1 ? "activo" : ""} onClick={onClickTag}/>
            <BotonEtiqueta nombreBoton="Deseos" index={2} className={tagActivo === 2 ? "activo" : ""} onClick={onClickTag}/>
            <BotonEtiqueta nombreBoton="Prestados" index={3} className={tagActivo === 3 ? "activo" : ""} onClick={onClickTag}/>
            <BotonEtiqueta nombreBoton="Préstamos" index={4} className={tagActivo === 4 ? "activo" : ""} onClick={onClickTag}/>
        </div>
        <div className="tags_usuario">
            {
                props.catsUsuario.filter((c: any) => !categoriasPpales.includes(c.nombre) )
                    .map( (cat: { nombre: any; }, index: number) => 
                        <BotonEtiqueta
                            key={index}
                            nombreBoton={cat.nombre}
                            index={index + 5}
                            className={tagActivo === index + 5 ? "activo" : ""}
                            onClick={onClickTag}
                        />)
            }
            {inputIsOpen &&
                <NuevaEtiqueta crear={crearTag} inputRef={inputRef} cerrarRef={btnCerrarRef} crearRef={btnGuardarRef} cerrarEtiqueta={cerrarInput} iconoSync={syncIcono}/>}
            {!inputIsOpen &&
                <button className="crear" ref={btnCrearRef} onClick={abrirInput}><i className="material-symbols-rounded">add</i> Crear categoría</button>}
        </div>
    </div>
}

export default Etiquetas;