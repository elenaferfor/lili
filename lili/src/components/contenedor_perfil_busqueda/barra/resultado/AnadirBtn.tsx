import {useEffect, useRef, useState} from "react";
import "./AnadirBtn.css";
import {useUsuarioLibro} from "../../../../hooks/useUsuarioLibro.tsx";
import {useCategorias} from "../../../../hooks/useCategoria.tsx";
import {
    type Categoria,
    CATEGORIAS_EXCLUIDAS,
    type EstadoOpcion,
    ESTADOS,
    type Favorito,
    FAVORITOS,
    type SyncEstado, type UsuarioLibroPostRequest
} from "../../../../types.tsx";
import api from "../../../../api/Axios.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAuth} from "../../../../auth/AuthContext.tsx";

const AnadirBtn = (props: any) => {
    
    const [anadirIsOpen, setAnadirIsOpen] = useState(false);
    const panelAnadirRef = useRef<HTMLDivElement>(null);
    const btnAnadirRef = useRef<HTMLButtonElement>(null);
    
    const [noCategorias, setNoCategorias] = useState<boolean>(true);
    const [categoriasIsOpen, setCategoriasIsOpen] = useState<boolean>(false);
    const categoriasRef = useRef<HTMLDivElement>(null);
    const btnCategoriasRef = useRef<HTMLButtonElement>(null);
    const [catLista, setCatLista] = useState<Categoria[]>([]);
    
    const [estadoIsOpen, setEstadoIsOpen] = useState(false);
    const estadoRef = useRef<HTMLDivElement>(null);
    const btnEstadoRef = useRef<HTMLButtonElement>(null);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState<EstadoOpcion>(ESTADOS[3]);

    const [isFav, setIsFav] = useState<Favorito>(FAVORITOS[1]);
    
    const [usuarioLibroExists, setUsuarioLibroExists] = useState<boolean>(false);

    const [sync, setSync] = useState<SyncEstado>("idle");
    const queryClient = useQueryClient();
    const [requestBody, setRequestBody] = useState<UsuarioLibroPostRequest>();
    const { user } = useAuth();
    
    // Abrir y cerrar panel general
    const togglePanel = () => {
        setAnadirIsOpen(!anadirIsOpen);
    }
    
    useEffect(() => {
        if(anadirIsOpen){
            document.addEventListener("mousedown", handleClickFueraPanel);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickFueraPanel);
        }
    }, [anadirIsOpen]);
    
    const handleClickFueraPanel = (e: MouseEvent) => {
        if(panelAnadirRef.current && !panelAnadirRef.current.contains(e.target as Node) && !btnAnadirRef.current?.contains(e.target as Node)) {
            togglePanel();
        }
    }

    // Abrir y cerrar categorías
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
    
    // Abrir y cerrar estado
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
    
    // Traer valores del servidor
    const { data: usuarioLibro} = useUsuarioLibro(props.item.id);
    const { data: categoriasUsuario } = useCategorias();
    
    // Set panel de añadir: valores iniciales
    useEffect(() => {
        if(!usuarioLibro && !categoriasUsuario){
            setIsFav(FAVORITOS[1]);
            setEstadoSeleccionado(ESTADOS[3]);
            setNoCategorias(true);
            setUsuarioLibroExists(false);
        }
        
        else if(!usuarioLibro && categoriasUsuario){
            setIsFav(FAVORITOS[1]);
            setEstadoSeleccionado(ESTADOS[3]);
            setNoCategorias(false);
            setUsuarioLibroExists(false);
            setCatLista(
                categoriasUsuario.filter(cat => !CATEGORIAS_EXCLUIDAS.includes(cat.nombre))
                    .map(cat => ({
                        ...cat,
                        activa: false,
                        sync: "idle" as SyncEstado
                    }))
            );
        }
        
        else if(usuarioLibro && !categoriasUsuario){
            const fav = usuarioLibro.favorito ? FAVORITOS[0] : FAVORITOS[1];
            setIsFav(fav);
            const opcion = ESTADOS.find(e => e.valor === usuarioLibro.estado) ?? ESTADOS[3];
            setEstadoSeleccionado(opcion);
            setNoCategorias(true);
            setUsuarioLibroExists(true);
        }
        
        else if(usuarioLibro && categoriasUsuario){
            setNoCategorias(false);
            setUsuarioLibroExists(true);
            const idsActivos = new Set(usuarioLibro?.categorias_detalle.map(c => c.id));
            setCatLista(
                categoriasUsuario.filter(cat => !CATEGORIAS_EXCLUIDAS.includes(cat.nombre))
                    .map(cat => ({
                        ...cat,
                        activa: idsActivos.has(cat.id),
                        sync: "idle" as SyncEstado,
                    }))
            );

            const opcion = ESTADOS.find(e => e.valor === usuarioLibro.estado) ?? ESTADOS[3];
            setEstadoSeleccionado(opcion);
            
            const fav = usuarioLibro.favorito ? FAVORITOS[0] : FAVORITOS[1];
            setIsFav(fav);    
        }
        
    }, [usuarioLibro, categoriasUsuario]);
    
    // Seleccionar valores
    const handleCategorias = (catId: number) => {
        setCatLista(prev =>
            prev.map(cat =>
                cat.id === catId ?
                    {...cat, activa: !cat.activa, sync: "idle"}
                    : cat
            )
        );
    }
    
    const handleEstado = (opcion: EstadoOpcion) => {
        setEstadoSeleccionado(opcion);
        setEstadoIsOpen(false);
    }
    
    const toggleFav = (fav: Favorito) => {
        if(fav.isFav) setIsFav(FAVORITOS[1]);
        else setIsFav(FAVORITOS[0]);
    }
    
    // Mutación crear libroUsuario
    const { mutate: crearUsuarioLibro } = useMutation({
        mutationFn: () =>
            api.post(`/libros_usuarios/`, requestBody),
        onMutate: () => setSync("enviando"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarioLibro", props.item.id] });
            setSync("ok");
            setTimeout(() => setSync("idle"), 1500);
        },
        onError: () => setSync("idle"),
    });
    
    // Mutación editar libroUsuario
    const { mutate: editarUsuarioLibro } = useMutation({
        mutationFn: () =>
            api.patch(`/libros_usuarios/${usuarioLibro?.id}/`, requestBody),
        onMutate: () => setSync("enviando"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarioLibro", props.item.id] });
            setSync("ok");
            setTimeout(() => setSync("idle"), 1500);
        },
        onError: () => setSync("idle"),
    });
    
    
    // Crear el request body
    const createRequestBody = () => {
        setRequestBody({
            "usuario": user?.id,
            "libro": props.item.id,
            "serie": null,
            "numero_en_serie": null,
            "estado": estadoSeleccionado.valor,
            "favorito": isFav.isFav,
            "publico": true,
            "categorias": catLista.filter(c => c.activa).map(c => c.id)
        });
    }
    
    // Añadir el libro o modificar si el usuario ya lo tenía
    const handleAnadir = () => {
        createRequestBody();
        if(usuarioLibro) editarUsuarioLibro();
        else crearUsuarioLibro();
    }

    const syncIcono = () => {
        if(sync === "pendiente") return <i className="material-symbols-rounded">schedule</i>;
        if(sync === "enviando") return <i className="material-symbols-rounded">sync</i>;
        if(sync === "ok") return <i className="material-symbols-rounded">check_circle</i>;
        return null;
    }
    
    return <>
        <button className={props.clase} ref={btnAnadirRef} onClick={togglePanel}>
            { usuarioLibroExists ? 
                <>Modificar</> :
                <>Añadir
                    <i className="material-symbols-rounded">add</i>
                </>
            }
        </button>
        {anadirIsOpen &&
            <div className="panelAnadir" ref={panelAnadirRef}>
                <div className="closeBtn" onClick={togglePanel}><i className="material-symbols-rounded">close</i></div>
                <div className="panelAnadirLibro">
                    { usuarioLibroExists ? <h1>Modificar libro</h1> : <h1>Añadir libro</h1>}
                    <p>Selecciona una o más categorías:</p>
                    { noCategorias ? <p>"No hay categorías, puedes crearlas en la página de categorías."</p> :
                        <div id="estadoCategorias">
                            <button className="" onClick={() => setCategoriasIsOpen(open => !open)} ref={btnCategoriasRef}>Categorías</button>
                            { categoriasIsOpen &&
                                <div className="categorias" ref={categoriasRef}>
                                    {
                                        catLista.map((cat) => (
                                            <button key={cat.id} className={cat.activa ? "catActiva" : ""} onClick={() => handleCategorias(cat.id)}>
                                                {cat.nombre}
                                                {cat.activa && <i className="material-symbols-rounded">check</i>}
                                            </button>
                                        ))

                                    }
                                </div>
                            }
                        </div>
                    }
                    <p>Estado:</p>
                    <div id="estadoLectura">
                        <button className={estadoSeleccionado.clase} onClick={toggleEstado} ref={btnEstadoRef}>
                            {estadoSeleccionado.texto}
                            <i className="material-symbols-rounded">{estadoSeleccionado.icono}</i>
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
                    <p>Marcar como favorito:</p>
                    <button className={isFav.clase} onClick={() => toggleFav(isFav)}>Favorito
                        <i className={isFav.iconoClase}>favorite</i>
                    </button>
                    <button className="anadirBtnFinal" onClick={handleAnadir}>Enviar {syncIcono()}</button>
                </div>
                <div className="panelAnadirPrestamo">
                    <h1>Préstamos</h1>
                    <p>Elige "prestar" o "en préstamo" para añadir seguimiento:</p>
                </div>
            </div>
        }
    </>
}

export default AnadirBtn;