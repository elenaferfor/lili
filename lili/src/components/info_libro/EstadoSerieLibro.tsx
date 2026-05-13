import {useEffect, useRef, useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import api from "../../api/Axios.tsx";
import {type SyncEstado, type Serie} from "../../types.tsx";
import {useSeries} from "../../hooks/useSerie.tsx";

interface EstadoSerieLibroProps {
    usuarioLibro: any;
    libroIdNum: number;
}

const EstadoSerieLibro = ({ usuarioLibro, libroIdNum }: EstadoSerieLibroProps) => {
    const queryClient = useQueryClient();
    const { data: series } = useSeries();

    const [serieActual, setSerieActual] = useState<Serie | undefined>(undefined);
    const [serieNueva, setSerieNueva] = useState<Serie | undefined>(undefined);
    const [serieTexto, setSerieTexto] = useState<string>("");
    const [numSerieNuevo, setNumSerieNuevo] = useState<number | undefined>(0);
    const [editandoSerie, setEditandoSerie] = useState<boolean>(false);
    const [syncSerie, setSyncSerie] = useState<SyncEstado>("idle");

    const btnSerieRef = useRef<HTMLButtonElement>(null);
    const serieRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!series) return;
        if (!usuarioLibro) return;
        if (!usuarioLibro.serie_detalle) return;

        const serie = series.find((s: Serie) => s.id === usuarioLibro.serie_detalle.id);
        setSerieActual(serie);
        setSerieNueva(serie);
        setSerieTexto(serie?.nombre ?? "");
        setNumSerieNuevo(usuarioLibro.numero_en_serie ?? 0);
    }, [series, usuarioLibro]);

    useEffect(() => {
        if (!editandoSerie) return;
        const handler = (e: MouseEvent) => {
            if (serieRef.current && !serieRef.current.contains(e.target as Node)
                && !btnSerieRef.current?.contains(e.target as Node)) {
                setEditandoSerie(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [editandoSerie]);

    const { mutate: guardarSerie } = useMutation({
        mutationFn: () =>
            api.post(`/libros_usuarios/${usuarioLibro?.id}/anadir_serie/`, {
                serie: serieNueva?.nombre !== serieTexto ? serieTexto : (serieNueva?.id ?? serieTexto),
                num_en_serie: numSerieNuevo,
            }),
        onMutate: () => setSyncSerie("enviando"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarioLibro", libroIdNum] });
            setSyncSerie("ok");
            setTimeout(() => {
                setSyncSerie("idle");
                setEditandoSerie(false);
            }, 1500);
        },
        onError: () => {
            setSyncSerie("idle");
            setEditandoSerie(false);
        }
    });

    const labelSerie = usuarioLibro?.serie_detalle
        ? `${usuarioLibro.serie_detalle.nombre} ${usuarioLibro.numero_en_serie} de ${
            (serieActual?.volumenes === undefined || serieActual?.volumenes === 0) ? "??" : serieActual.volumenes
        }`
        : "Sin serie";

    return (
        <div className="detalleLibroSerie">
            {editandoSerie ? (
                <div className="editandoSerie" ref={serieRef}>
                    <div className="serieTitulo">
                        <input type="text" id="serie_nueva_titulo" placeholder="Título de la serie"
                               value={serieTexto}
                               onChange={(e) => setSerieTexto(e.target.value)}/>
                        <div className="seriesOpciones">
                            {series?.map((serie: Serie, index: number) => (
                                <button key={index} onClick={() => {
                                    setSerieNueva(serie);
                                    setSerieTexto(serie.nombre);
                                }}>
                                    {serie.nombre}
                                </button>
                            ))}
                        </div>
                    </div>
                    <input type="number" id="serie_nueva_num" placeholder="0"
                           value={numSerieNuevo}
                           onChange={(e) => setNumSerieNuevo(Number(e.target.value))}/>
                    <span>de</span>
                    <input type="number" id="serie_nueva_num_total" placeholder="??"
                           value={serieNueva?.volumenes}
                           onChange={(e) =>
                               setSerieNueva(prev => prev ? {...prev, volumenes: Number(e.target.value)} : undefined)}/>
                    <button className="editandoSerieBtn" onClick={() => setEditandoSerie(o => !o)}>
                        <i className="material-symbols-rounded">close</i>
                    </button>
                    <button className="editandoSerieBtn"
                            onClick={() => guardarSerie()}
                            disabled={syncSerie === "enviando"}>
                        <i className="material-symbols-rounded">
                            {syncSerie === "enviando" ? "sync" : syncSerie === "ok" ? "check_circle" : "check"}
                        </i>
                    </button>
                </div>
            ) : (
                <button ref={btnSerieRef} onClick={() => setEditandoSerie(o => !o)}>
                    {labelSerie}
                </button>
            )}
        </div>
    );
}

export default EstadoSerieLibro;