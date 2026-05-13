import "./PanelLibro.css";
import ReactDOM from "react-dom";
import {useEffect, useRef, useState} from "react";
import {
    type Amistad,
    type Categoria,
    CATEGORIAS_EXCLUIDAS, type CrearPrestamo,
    type EstadoOpcion,
    ESTADOS,
    type Favorito,
    FAVORITOS, ICONOS_PRESTAMO, type Prestamo, type PrestamoIcono, type Serie,
    type SyncEstado, type UsuarioLibroPostRequest
} from "../../types.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAuth} from "../../auth/AuthContext.tsx";
import api from "../../api/Axios.tsx";
import {useCategorias} from "../../hooks/useCategoria.tsx";
import {useUsuarioLibro} from "../../hooks/useUsuarioLibro.tsx";
import {usePrestamos} from "../../hooks/usePrestamos.tsx";
import {useAmistades} from "../../hooks/useAmistades.tsx";
import {useSeries} from "../../hooks/useSerie.tsx";

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
    const [syncPrestar, setSyncPrestar] = useState<SyncEstado>("idle");
    const [requestBody, setRequestBody] = useState<UsuarioLibroPostRequest>();

    const [prestamoIsOpen, setPrestamoIsOpen] = useState(false);
    const prestamoRef = useRef<HTMLDivElement>(null);
    const btnPrestamoRef = useRef<HTMLButtonElement>(null);
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState<PrestamoIcono>(ICONOS_PRESTAMO[0]);
    const [crearPrestamoBody, setCrearPrestamoBody] = useState<CrearPrestamo>();
    const [prestamoActual, setPrestamoActual] = useState<Prestamo | undefined>(undefined);

    const [amigoIsOpen, setAmigoIsOpen] = useState(false);
    const amigoRef = useRef<HTMLDivElement>(null);
    const btnAmigoRef = useRef<HTMLButtonElement>(null);
    const [amistadSeleccionada, setAmistadSeleccionada] = useState<Amistad | undefined>(undefined);
    const [amigo, setAmigo] = useState({id: -1, username: ""});

    const [seriesIsOpen, setSeriesIsOpen] = useState(false);
    const seriesRef = useRef<HTMLDivElement>(null);
    const btnSeriesRef = useRef<HTMLInputElement>(null);
    const [serieSeleccionada, setSerieSeleccionada] = useState<Serie | undefined>(undefined);
    const [serieTexto, setSerieTexto] = useState<string>("");
    const [serieSelecTotal, setSerieSelecTotal] = useState<number>(0);
    const [serieSelecNum, setSerieSelecNum] = useState<number>(0);
    const [seriesLista, setSeriesLista] = useState<Serie[]>([]);

    // Traer valores del servidor
    const { data: usuarioLibro} = useUsuarioLibro(libroId);
    const { data: categoriasUsuario } = useCategorias();
    const { data: series } = useSeries();
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

    // Set panel de añadir:
    // Set usuarioLibro y categorías (interdependientes)
    useEffect(() => {
        if (!usuarioLibro) {
            setUsuarioLibroExists(false);
            setEstadoSeleccionado(ESTADOS[3]);
            setIsFav(FAVORITOS[1]);
            setCatLista(
                (categoriasUsuario ?? [])
                    .filter((cat: any) => !CATEGORIAS_EXCLUIDAS.includes(cat.nombre))
                    .map((cat: any) => ({ ...cat, activa: false, sync: "idle" as SyncEstado }))
            );
        } else {
            setUsuarioLibroExists(true);
            setEstadoSeleccionado(ESTADOS.find((e: EstadoOpcion) => e.valor === usuarioLibro.estado) ?? ESTADOS[3]);
            setIsFav(usuarioLibro.favorito ? FAVORITOS[0] : FAVORITOS[1]);
            if (categoriasUsuario) {
                const idsActivos = new Set(usuarioLibro.categorias_detalle.map(c => c.id));
                setCatLista(
                    categoriasUsuario
                        .filter((cat: any) => !CATEGORIAS_EXCLUIDAS.includes(cat.nombre))
                        .map((cat: any) => ({ ...cat, activa: idsActivos.has(cat.id), sync: "idle" as SyncEstado }))
                );
            }
        }
        setNoCategorias(!categoriasUsuario);
    }, [usuarioLibro, categoriasUsuario]);
    
    // Set series
    useEffect(() => {
        setSeriesLista(series ?? []);
        if (!usuarioLibro) return;
        if (usuarioLibro.serie_detalle) {
            setSerieSeleccionada(series?.find(s => s.id === usuarioLibro.serie_detalle.id));
            setSerieTexto(usuarioLibro.serie_detalle.nombre);
            setSerieSelecTotal(usuarioLibro.serie_detalle.volumenes);
            setSerieSelecNum(usuarioLibro.numero_en_serie);
        }
    }, [series, usuarioLibro]);
    
    // Set préstamos y amistades (interdependientes)
    useEffect(() => {
        if (!prestamos) return;
        const encontrado = prestamos.find((p: Prestamo) =>
            p.libro_detalle.id === libroId && p.estado === "activo"
        );
        setPrestamoActual(encontrado);
        if (!encontrado) {
            setPrestamoSeleccionado(ICONOS_PRESTAMO[0]);
            setAmistadSeleccionada(undefined);
            return;
        }
        if (encontrado.prestatario_nombre.id === user?.id) {
            setPrestamoSeleccionado(ICONOS_PRESTAMO[2]);
        } else {
            setPrestamoSeleccionado(ICONOS_PRESTAMO[1]);
        }
        const amistadEncontrada = amistades?.find(a =>
            a.usuario_a_nombre.id === encontrado.prestador_id ||
            a.usuario_b_nombre.id === encontrado.prestador_id
        );
        resolverAmigo(amistadEncontrada!);
    }, [prestamos, amistades]);
    
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

    // Abrir y cerrar series
    useEffect(() => {
        if (!seriesIsOpen) return;
        const handler = (e: MouseEvent) => {
            if (estadoRef.current && !estadoRef.current.contains(e.target as Node)
                && !btnSeriesRef.current?.contains(e.target as Node)) {
                setSeriesIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [seriesIsOpen]);
    
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

    const handleSeries = (serie: Serie) => {
        setSerieSeleccionada(serie);
        setSerieTexto(serie.nombre);
        setSerieSelecTotal(serie.volumenes);
        setSeriesIsOpen(false);
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

    // Mutación crear serie
    const { mutate: actualizarSerie } = useMutation({
        mutationFn: (usuarioLibroId: number) =>
            api.post(`/libros_usuarios/${usuarioLibroId}/anadir_serie/`, {
                serie: serieSeleccionada?.id ?? serieTexto,
                num_en_serie: serieSelecNum
            }),
        onError: () => setSync("idle"),
    });

    // Mutación prestar
    const { mutate: prestarLibro } = useMutation({
        mutationFn: () =>
            api.post(`/prestamos/crear_prestamo_prestador/`, crearPrestamoBody),
        onMutate: () => setSyncPrestar("enviando"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prestar", libroId] });
            setSyncPrestar("ok");
            setTimeout(() => setSyncPrestar("idle"), 1500);
        },
        onError: () => setSync("idle"),
    });

    // Mutación devolver
    const { mutate: devolverLibro } = useMutation({
        mutationFn: () =>
            api.post(`/prestamos/${prestamoActual?.id}/devolver/`),
        onMutate: () => setSyncPrestar("enviando"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prestar", libroId] });
            setSyncPrestar("ok");
            setTimeout(() => setSyncPrestar("idle"), 1500);
        },
        onError: () => setSync("idle"),
    });


    // Añadir el libro o modificar si el usuario ya lo tenía
    const handleAnadir = () => {
        const body: UsuarioLibroPostRequest = {
            usuario: user?.id,
            libro: libroId,
            serie: serieSeleccionada?.id ?? null,
            numero_en_serie: serieSelecNum ?? null,
            estado: estadoSeleccionado.valor,
            favorito: isFav.isFav,
            publico: true,
            categorias: catLista.filter(c => c.activa).map(c => c.id),
        };

        const onGuardado = {
            onSuccess: (res: any) => {
                const id = usuarioLibro?.id ?? res.data.id;
                if (serieTexto) actualizarSerie(id);
                queryClient.invalidateQueries({ queryKey: ["usuarioLibro", libroId] });
                setSync("ok");
                setTimeout(() => setSync("idle"), 1500);
            },
            onError: () => setSync("idle"),
        };

        setRequestBody(body);
        if (usuarioLibro) editarUsuarioLibro(undefined, onGuardado);
        else crearUsuarioLibro(undefined, onGuardado);
    };
    
    // Crear un préstamo prestador -> prestatario (se crea como activo)
    const handlePrestar = () => {
        if(prestamoSeleccionado.tipo === "prestado"){
            const body: CrearPrestamo = {
                usuario_libro_id: usuarioLibro?.id,
                prestatario_id: amigo.id
            }
            setCrearPrestamoBody(body);
            prestarLibro();
        }else{
            devolverLibro();
        }
        
    }

    const syncIcono = () => {
        if (sync === "pendiente") return <i className="material-symbols-rounded">schedule</i>;
        if (sync === "enviando") return <i className="material-symbols-rounded">sync</i>;
        if (sync === "ok") return <i className="material-symbols-rounded">check_circle</i>;
        return null;
    };
    const syncIconoPrestar = () => {
        if (syncPrestar === "pendiente") return <i className="material-symbols-rounded">schedule</i>;
        if (syncPrestar === "enviando") return <i className="material-symbols-rounded">sync</i>;
        if (syncPrestar === "ok") return <i className="material-symbols-rounded">check_circle</i>;
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
                    <p>Selecciona una o más categorías y/o serie del libro:</p>
                    <div className="categoriasSeries">
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
                        <div className="serie">
                            <div className="serie_titulo">
                                <input type="text" value={serieSeleccionada?.nombre}
                                       onChange={ (e) => {
                                           setSerieTexto(e.target.value);
                                           setSerieSeleccionada(undefined);
                                       }}
                                       placeholder="Título de la serie"
                                       onClick={() => setSeriesIsOpen(o => !o)}
                                       ref={btnSeriesRef}/>
                                {seriesIsOpen && (
                                    <div className="seriesOpciones" ref={seriesRef}>
                                        {seriesLista.map((serie: any, index: number) => (
                                            <button key={index} onClick={() => handleSeries(serie)}>
                                                {serie.nombre}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="serie_numeros">
                                <div className="serie_num">
                                    <input type="number" value={serieSelecNum}
                                           onChange={(e) => setSerieSelecNum(Number(e.target.value))}
                                           placeholder="0"/>
                                </div>
                                <span>de</span>
                                <div className="serie_num">
                                    <input type="number" value={serieSelecTotal}
                                           onChange={(e) => setSerieSelecTotal(Number(e.target.value))}
                                           placeholder="??"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    
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
                                    <div className="prestamoOpciones" ref={prestamoRef}>
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
                                                <div className="amigoOpciones amigo" ref={amigoRef}>
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
                    <button className="anadirBtnFinal" onClick={handlePrestar} disabled={ prestamoSeleccionado.tipo === "en_prestamo" }>
                        Enviar {syncIconoPrestar()}
                    </button>
                </div>
            </div>
        </>,
    document.body
    );
};

export default PanelLibro;