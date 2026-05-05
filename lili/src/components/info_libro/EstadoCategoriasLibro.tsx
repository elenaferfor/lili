import {useEffect, useRef, useState} from "react";
import api from "../../api/Axios.tsx";
import {useMutation} from "@tanstack/react-query";
import {useUsuarioLibro} from "../../hooks/useUsuarioLibro.tsx";
import {useCategorias} from "../../hooks/useCategoria.tsx";
import {type Categoria, CATEGORIAS_EXCLUIDAS, type SyncEstado} from "../../types.tsx";

const EstadoCategoriasLibro = (props: any) => {
    
    const [categoriasIsOpen, setCategoriasIsOpen] = useState(false);

    const categoriasRef = useRef<HTMLDivElement>(null);
    const btnCategoriasRef = useRef<HTMLButtonElement>(null);

    const [catLista, setCatLista] = useState<Categoria[]>([]);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    // Traer categorías de la API
    const { data: categoriasUsuario, isLoading: loadingCategorias } = useCategorias();
    const { data: usuarioLibro, isLoading: loadingLibro } = useUsuarioLibro(props.libroId);

    useEffect(() => {
        if(!categoriasUsuario || !usuarioLibro) return;
        
        const idsActivos = new Set(usuarioLibro.categorias_detalle.map(c => c.id));
        
        setCatLista(
            categoriasUsuario.filter(cat => !CATEGORIAS_EXCLUIDAS.includes(cat.nombre))
                .map(cat => ({
                ...cat,
                activa: idsActivos.has(cat.id),
                sync: "idle" as SyncEstado,
            }))
        );
    }, [categoriasUsuario, usuarioLibro]);
    
    // Mutación para enviar el array de ids activos
    const { mutate: guardarCategorias } = useMutation({
        mutationFn: (idsActivos: number[]) =>
            api.patch(`/libros_usuarios/${usuarioLibro?.id}/`, { categorias: idsActivos }),
        
        onMutate: () => {
            setCatLista(prev =>
                prev.map(cat =>
                    cat.sync === "pendiente" ? { ...cat, sync: "enviando" } : cat
                )
            );
        },
        
        onSuccess: () => {
            setCatLista(prev =>
                prev.map(cat =>
                    cat.sync === "enviando" ? { ...cat, sync: "ok" } : cat
                )
            );
            setTimeout(() => {
                setCatLista(prev =>
                    prev.map(cat =>
                        cat.sync === "ok" ? { ...cat, sync: "idle" } : cat)
                    );
            }, 1500);
        },
        
        onError: () => {
            setCatLista(prev =>
                prev.map(cat =>
                    cat.sync === "enviando" ? { ...cat, sync: "pendiente" } : cat
                )
            );
        },
    });
    
    // Al cambiar las categorías marcadas actualiza el estado y espera
    const handleCategorias = (id: number) => {
        setCatLista(prev =>
            prev.map(cat =>
                cat.id === id ?
                    {...cat, activa: !cat.activa, sync: "pendiente"}
                    : cat
            )
        );
        
        if (debounceRef.current) clearTimeout(debounceRef.current);
        
        debounceRef.current = setTimeout(() => {
            setCatLista(prev => {
                const idsActivos = prev
                    .filter(cat => cat.activa)
                    .map(cat => cat.id);
                guardarCategorias(idsActivos);
                return prev;
            });
        }, 800);
    }

    useEffect(() => {
        if(categoriasIsOpen){
            document.addEventListener("mousedown", handleClickFueraCategorias);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickFueraCategorias);
        }
    }, [categoriasIsOpen]);

    const handleClickFueraCategorias = (e: MouseEvent) => {
        if(categoriasRef.current &&
            !categoriasRef.current.contains(e.target as Node) &&
            !btnCategoriasRef.current?.contains(e.target as Node)) {
            setCategoriasIsOpen(false);
        }
    }
    
    const syncIcono = (sync: SyncEstado) => {
        if(sync === "pendiente") return <i className="material-symbols-rounded">schedule</i>;
        if(sync === "enviando") return <i className="material-symbols-rounded">sync</i>;
        if(sync === "ok") return <i className="material-symbols-rounded">check_circle</i>;
        return null;
    }

    const isLoading = loadingCategorias || loadingLibro;
    
    return <div id="estadoCategorias">
        <button className="" onClick={() => setCategoriasIsOpen(open => !open)} ref={btnCategoriasRef}>Categorías</button>
        { isLoading && <span>Cargando...</span>}
        { categoriasIsOpen &&
            <div className="categorias" ref={categoriasRef}>
                {
                    catLista.map((cat) => (
                        <button key={cat.id} className={cat.activa ? "catActiva" : ""} onClick={() => handleCategorias(cat.id)}>
                            {cat.nombre}
                            {cat.activa && <i className="material-symbols-rounded">check</i>}
                            {syncIcono(cat.sync)}
                        </button>
                    ))  
                    
                }
            </div>
        }
    </div>
    
}

export default EstadoCategoriasLibro;