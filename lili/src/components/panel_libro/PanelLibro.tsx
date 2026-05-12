import "./PanelLibro.css";
import ReactDOM from "react-dom";
import {useEffect, useRef, useState} from "react";
import {
    type Amistad,
    type Categoria,
    CATEGORIAS_EXCLUIDAS,
    type EstadoOpcion,
    ESTADOS,
    type Favorito,
    FAVORITOS, ICONOS_PRESTAMO, type Prestamo, type PrestamoIcono,
    type SyncEstado, type UsuarioLibroPostRequest
} from "../../types.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAuth} from "../../auth/AuthContext.tsx";
import api from "../../api/Axios.tsx";
import {useCategorias} from "../../hooks/useCategoria.tsx";
import {useUsuarioLibro} from "../../hooks/useUsuarioLibro.tsx";
import {usePrestamos} from "../../hooks/usePrestamos.tsx";
import {useAmistades} from "../../hooks/useAmistades.tsx";

interface PanelLibroProps{
    libroId: number;
    onClose: () => void;
}

const PanelLibro = ({libroId, onClose}: PanelLibroProps) => {

    const panelRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const { user } = useAuth();

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
    const [requestBody, setRequestBody] = useState<UsuarioLibroPostRequest>();

    const [prestamoIsOpen, setPrestamoIsOpen] = useState(false);
    const prestamoRef = useRef<HTMLDivElement>(null);
    const btnPrestamoRef = useRef<HTMLButtonElement>(null);
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState<PrestamoIcono>(ICONOS_PRESTAMO[0]);

    const [amigoIsOpen, setAmigoIsOpen] = useState(false);
    const amigoRef = useRef<HTMLDivElement>(null);
    const btnAmigoRef = useRef<HTMLButtonElement>(null);
    const [amistadSeleccionada, setAmistadSeleccionada] = useState<Amistad | undefined>(undefined);
    const [amigo, setAmigo] = useState({id: -1, username: ""});

    // Traer valores del servidor
    const { data: usuarioLibro} = useUsuarioLibro(libroId);
    const { data: categoriasUsuario } = useCategorias();
    const { data: prestamos } = usePrestamos();
    const { data: amistades } = useAmistades();

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickFuera = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickFuera);
        return () => document.removeEventListener("mousedown", handleClickFuera);
    }, [onClose]);

    // Set panel de añadir: valores iniciales
    useEffect(() => {
        if (!usuarioLibro && !categoriasUsuario) {
            setIsFav(FAVORITOS[1]);
            setEstadoSeleccionado(ESTADOS[3]);
            setPrestamoSeleccionado(ICONOS_PRESTAMO[0]);
            setNoCategorias(true);
            setUsuarioLibroExists(false);
            setAmistadSeleccionada(undefined);
        } else if (!usuarioLibro && categoriasUsuario) {
            setIsFav(FAVORITOS[1]);
            setEstadoSeleccionado(ESTADOS[3]);
            setPrestamoSeleccionado(ICONOS_PRESTAMO[0]);
            setNoCategorias(false);
            setUsuarioLibroExists(false);
            setAmistadSeleccionada(undefined);
            setCatLista(
                categoriasUsuario
                    .filter((cat: any) => !CATEGORIAS_EXCLUIDAS.includes(cat.nombre))
                    .map((cat: any) => ({ ...cat, activa: false, sync: "idle" as SyncEstado }))
            );
        } else if (usuarioLibro && !categoriasUsuario) {
            setIsFav(usuarioLibro.favorito ? FAVORITOS[0] : FAVORITOS[1]);
            setEstadoSeleccionado(ESTADOS.find((e: EstadoOpcion) => e.valor === usuarioLibro.estado) ?? ESTADOS[3]);
            setNoCategorias(true);
            setUsuarioLibroExists(true);
            if(!prestamos) return;
            const prestamoActual = prestamos.find((p: Prestamo) => p.libro_detalle.id === libroId);
            if(!prestamoActual){
                setPrestamoSeleccionado(ICONOS_PRESTAMO[0]);
                return;
            }
            if(prestamoActual.prestatario_nombre.id === user?.id) {
                setPrestamoSeleccionado(ICONOS_PRESTAMO[2]);
                const amistadEncontrada = amistades?.find(a => a.usuario_a_nombre.id === prestamoActual.prestador_id || a.usuario_b_nombre.id === prestamoActual.prestador_id );
                resolverAmigo(amistadEncontrada!);
            }else{
                setPrestamoSeleccionado(ICONOS_PRESTAMO[1]);
                const amistadEncontrada = amistades?.find(a => a.usuario_a_nombre.id === prestamoActual.prestador_id || a.usuario_b_nombre.id === prestamoActual.prestador_id );
                resolverAmigo(amistadEncontrada!);
            }
        } else if (usuarioLibro && categoriasUsuario) {
            setNoCategorias(false);
            setUsuarioLibroExists(true);
            const idsActivos = new Set(usuarioLibro.categorias_detalle.map(c => c.id));
            setCatLista(
                categoriasUsuario
                    .filter((cat: any) => !CATEGORIAS_EXCLUIDAS.includes(cat.nombre))
                    .map((cat: any) => ({ ...cat, activa: idsActivos.has(cat.id), sync: "idle" as SyncEstado }))
            );
            setEstadoSeleccionado(ESTADOS.find((e: EstadoOpcion) => e.valor === usuarioLibro.estado) ?? ESTADOS[3]);
            setIsFav(usuarioLibro.favorito ? FAVORITOS[0] : FAVORITOS[1]);
            if(!prestamos) return;
            const prestamoActual = prestamos.find((p: Prestamo) => p.libro_detalle.id === libroId);
            if(!prestamoActual){
                setPrestamoSeleccionado(ICONOS_PRESTAMO[0]);
                return;
            }
            if(prestamoActual.prestatario_nombre.id === user?.id) {
                setPrestamoSeleccionado(ICONOS_PRESTAMO[2]);
                const amistadEncontrada = amistades?.find(a => a.usuario_a_nombre.id === prestamoActual.prestador_id || a.usuario_b_nombre.id === prestamoActual.prestador_id );
                resolverAmigo(amistadEncontrada!);
            }else{
                setPrestamoSeleccionado(ICONOS_PRESTAMO[1]);
                const amistadEncontrada = amistades?.find(a => a.usuario_a_nombre.id === prestamoActual.prestador_id || a.usuario_b_nombre.id === prestamoActual.prestador_id );
                resolverAmigo(amistadEncontrada!);
            }
        }
    }, [usuarioLibro, categoriasUsuario, amistades]);
    
    // Settear amigo
    const resolverAmigo = (amistad: Amistad) => {
        if (!amistad) return;
        const amigoData = amistad.usuario_a_nombre.id === user?.id
            ? amistad.usuario_b_nombre
            : amistad.usuario_a_nombre;
        setAmistadSeleccionada(amistad);
        setAmigo({ id: amigoData.id, username: amigoData.username });
    };
    
    // Abrir y cerrar categorías
    useEffect(() => {
        if (!categoriasIsOpen) return;
        const handler = (e: MouseEvent) => {
            if (categoriasRef.current && !categoriasRef.current.contains(e.target as Node)
                && !btnCategoriasRef.current?.contains(e.target as Node)) {
                setCategoriasIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [categoriasIsOpen]);
    
    // Abrir y cerrar estado
    useEffect(() => {
        if (!estadoIsOpen) return;
        const handler = (e: MouseEvent) => {
            if (estadoRef.current && !estadoRef.current.contains(e.target as Node)
                && !btnEstadoRef.current?.contains(e.target as Node)) {
                setEstadoIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [estadoIsOpen]);

    // Abrir y cerrar préstamos
    useEffect(() => {
        if (!prestamoIsOpen) return;
        const handler = (e: MouseEvent) => {
            if (prestamoRef.current && !prestamoRef.current.contains(e.target as Node)
                && !btnPrestamoRef.current?.contains(e.target as Node)) {
                setPrestamoIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [prestamoIsOpen]);

    // Abrir y cerrar amigos
    useEffect(() => {
        if (!amigoIsOpen) return;
        const handler = (e: MouseEvent) => {
            if (amigoRef.current && !amigoRef.current.contains(e.target as Node)
                && !btnAmigoRef.current?.contains(e.target as Node)) {
                setAmigoIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [amigoIsOpen]);

    const handleCategorias = (catId: number) => {
        setCatLista(prev =>
            prev.map(cat => cat.id === catId ? { ...cat, activa: !cat.activa, sync: "idle" } : cat)
        );
    };

    const handleEstado = (opcion: EstadoOpcion) => {
        setEstadoSeleccionado(opcion);
        setEstadoIsOpen(false);
    };

    const toggleFav = () => {
        setIsFav((prev: Favorito) => prev.isFav ? FAVORITOS[1] : FAVORITOS[0]);
    };

    const handlePrestamo = (opcion: PrestamoIcono) => {
        setPrestamoSeleccionado(opcion);
        setPrestamoIsOpen(false);
    };

    const handleAmigo = (amistad: Amistad) => {
        setAmistadSeleccionada(amistad);
        const amigoData = amistad.usuario_a_nombre.id === user?.id
            ? amistad.usuario_b_nombre
            : amistad.usuario_a_nombre;
        setAmigo({ id: amigoData.id, username: amigoData.username });
        setAmigoIsOpen(false);
    };

    // Mutación crear libroUsuario
    const { mutate: crearUsuarioLibro } = useMutation({
        mutationFn: () =>
            api.post(`/libros_usuarios/`, requestBody),
        onMutate: () => setSync("enviando"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarioLibro", libroId] });
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
            queryClient.invalidateQueries({ queryKey: ["usuarioLibro", libroId] });
            setSync("ok");
            setTimeout(() => setSync("idle"), 1500);
        },
        onError: () => setSync("idle"),
    });

    // Añadir el libro o modificar si el usuario ya lo tenía
    const handleAnadir = () => {
        const body: UsuarioLibroPostRequest = {
            usuario: user?.id,
            libro: libroId,
            serie: null,
            numero_en_serie: null,
            estado: estadoSeleccionado.valor,
            favorito: isFav.isFav,
            publico: true,
            categorias: catLista.filter(c => c.activa).map(c => c.id),
        };
        setRequestBody(body);
        if (usuarioLibro) editarUsuarioLibro();
        else crearUsuarioLibro();
    };

    const syncIcono = () => {
        if (sync === "pendiente") return <i className="material-symbols-rounded">schedule</i>;
        if (sync === "enviando") return <i className="material-symbols-rounded">sync</i>;
        if (sync === "ok") return <i className="material-symbols-rounded">check_circle</i>;
        return null;
    };

    return ReactDOM.createPortal(
        <>
            <div className="panelOverlay" onClick={onClose} />
            <div className="panelAnadir" ref={panelRef}>
                <div className="closeBtn" onClick={onClose}>
                    <i className="material-symbols-rounded">close</i>
                </div>
                <div className="panelAnadirLibro">
                    <h1>{usuarioLibroExists ? "Modificar libro" : "Añadir libro"}</h1>
                    <p>Selecciona una o más categorías:</p>
                    {noCategorias
                        ? <p>No hay categorías, puedes crearlas en la página de categorías.</p>
                        : <div id="estadoCategorias">
                            <button onClick={() => setCategoriasIsOpen(o => !o)} ref={btnCategoriasRef}>Categorías</button>
                            {categoriasIsOpen && (
                                <div className="categorias" ref={categoriasRef}>
                                    {catLista.map(cat => (
                                        <button key={cat.id} className={cat.activa ? "catActiva" : ""} onClick={() => handleCategorias(cat.id)}>
                                            {cat.nombre}
                                            {cat.activa && <i className="material-symbols-rounded">check</i>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    }
                    <p>Estado:</p>
                    <div id="estadoLectura">
                        <button className={estadoSeleccionado.clase} onClick={() => setEstadoIsOpen(o => !o)} ref={btnEstadoRef}>
                            {estadoSeleccionado.texto}
                            <i className="material-symbols-rounded">{estadoSeleccionado.icono}</i>
                        </button>
                        {estadoIsOpen && (
                            <div className="estadoLecturaOpciones" ref={estadoRef}>
                                {ESTADOS.map((opcion: any) => (
                                    <button key={opcion.valor} className={opcion.clase} onClick={() => handleEstado(opcion)}>
                                        {opcion.texto}
                                        {opcion.icono && <i className="material-symbols-rounded">{opcion.icono}</i>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <p>Marcar como favorito:</p>
                    <button className={isFav.clase} onClick={toggleFav}>
                        Favorito <i className={isFav.iconoClase}>favorite</i>
                    </button>
                    <button className="anadirBtnFinal" onClick={handleAnadir}>
                        Enviar {syncIcono()}
                    </button>
                </div>
                <div className="panelAnadirPrestamo">
                    <h1>Préstamos</h1>
                    <p>Elige "prestar" o "en préstamo" para añadir seguimiento:</p>
                    <div className="barraPrestar">
                        { prestamoSeleccionado.tipo === "en_prestamo" ?
                            <>
                                <button className={prestamoSeleccionado.clase} ref={btnPrestamoRef} onClick={() => setPrestamoIsOpen(o => !o)}>
                                    { prestamoSeleccionado.texto }
                                    {prestamoSeleccionado.icono && <i className="material-symbols-rounded">{prestamoSeleccionado.icono}</i>}
                                </button>
                                <p>de</p>
                                <button className="amigoSeleccionado" ref={btnAmigoRef} onClick={() => setAmigoIsOpen(o => !o)}>
                                    <div className="amigoSeleccionadoFoto">
                                        <img src="/perfil/te.JPG" alt="Foto de perfil"/>
                                    </div>
                                    { amistadSeleccionada ? <p>{amigo.username}</p> : <p>@usuario...</p>}
                                </button>
                            </> :
                            <>
                                <button className={prestamoSeleccionado.clase} ref={btnPrestamoRef} onClick={() => setPrestamoIsOpen(o => !o)}>
                                    { prestamoSeleccionado.texto }
                                    {prestamoSeleccionado.icono && <i className="material-symbols-rounded">{prestamoSeleccionado.icono}</i>}
                                </button>
                                {prestamoIsOpen && (
                                    <div className="estadoLecturaOpciones" ref={prestamoRef}>
                                        {ICONOS_PRESTAMO.slice(0, 2).map((opcion: any) => (
                                            <button key={opcion.valor} onClick={() => handlePrestamo(opcion)}>
                                                {opcion.texto}
                                                {opcion.icono && <i className="material-symbols-rounded">{opcion.icono}</i>}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                { prestamoSeleccionado.tipo === "prestado" && 
                                    <>
                                        <p>a</p>
                                        <button className="amigoSeleccionado" ref={btnAmigoRef} onClick={() => setAmigoIsOpen(o => !o)}>
                                            <div className="amigoSeleccionadoFoto">
                                                <img src="/perfil/te.JPG" alt="Foto de perfil"/>
                                            </div>
                                            { amistadSeleccionada ? <p>{amigo.username}</p> : <p>@usuario...</p>}
                                        </button>
                                            {amigoIsOpen &&
                                                <div className="estadoLecturaOpciones amigo" ref={amigoRef}>
                                                    {amistades?.map((a: Amistad) => (
                                                        <button key={a.id} onClick={() => handleAmigo(a)}>
                                                            <div className="amigoSeleccionadoFoto">
                                                                <img src="/perfil/te.JPG" alt="Foto de perfil"/>
                                                            </div>
                                                            { a.usuario_a_nombre.id === user?.id ? a.usuario_b_nombre.username : a.usuario_a_nombre.username }
                                                        </button>
                                                    ))}
                                                </div>
                                            }
                                    </>
                                }
                            </>
                        }
                        
                        
                    </div>
                    <button className="anadirBtnFinal" onClick={handleAnadir} disabled={ prestamoSeleccionado.tipo === "en_prestamo" }>
                        Enviar {syncIcono()}
                    </button>
                </div>
            </div>
        </>,
    document.body
    );
};

export default PanelLibro;