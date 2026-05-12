import './SectionCategorias.css';
import {useMutation, useQueryClient} from "@tanstack/react-query";
import api from "../../api/Axios.tsx";
import {useEffect, useState} from "react";
import Libro from "../libro/Libro.tsx";

type SyncEstado = "idle" | "pendiente" | "enviando" | "ok";

type Categoria = {
    id: number;
    nombre: string;
    publica: boolean;
}

const SectionCategorias = (props: any ) => {

    const [syncPublica, setSyncPublica] = useState<SyncEstado>("idle");
    const [syncBorrar, setSyncBorrar] = useState<SyncEstado>("idle");
    const queryClient = useQueryClient();
    
    const [filtroLetra, setFiltroLetra] = useState<string>("TODOS");
    const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    const [catActual, setCatActual] = useState<Categoria>();
    
    useEffect(() => {
        setCatActual(
            props.catsUsuario.find((c: any) => c.nombre === props.tituloCat)
        );
        
    }, [props.tituloCat, props.catsUsuario]);

    // Mutación cambiar pública-privada
    const { mutate: cambiarPublica } = useMutation({
        mutationFn: () =>
            api.patch(`/categorias/${catActual?.id}/`, { publica: !catActual?.publica }),
        onMutate: () => setSyncPublica("enviando"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categoriasUsuario"] });
            setSyncPublica("ok");
            setTimeout(() => setSyncPublica("idle"), 1500);
        },
        onError: () => setSyncPublica("idle"),
    });

    // Mutación cambiar pública-privada
    const { mutate: borrar } = useMutation({
        mutationFn: () =>
            api.delete(`/categorias/${catActual?.id}/`),
        onMutate: () => setSyncBorrar("enviando"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categoriasUsuario"] });
            setSyncBorrar("ok");
            setTimeout(() => setSyncBorrar("idle"), 1500);
            props.onBorrarCategoria();
        },
        onError: () => setSyncBorrar("idle"),
    });
    
    
    const togglePublica = () => {
        cambiarPublica();
    }
    
    const borrarCategoria = () => {
        borrar();
        console.log(catActual);
    }

    const syncIconoPublica = () => {
        if(syncPublica === "enviando") return <i className="material-symbols-rounded">sync</i>;
        if(syncPublica === "ok") return <i className="material-symbols-rounded">check_circle</i>;
        return null;
    };

    const syncIconoBorrar = () => {
        if(syncBorrar === "enviando") return <i className="material-symbols-rounded">sync</i>;
        if(syncBorrar === "ok") return <i className="material-symbols-rounded">check_circle</i>;
        return null;
    };
    
    // Filtrar por letras
    const filtrarLetras = (letra: string) => {
        setFiltroLetra(letra);
    }

    const librosFiltrados = filtroLetra === "TODOS" ?
        props.listaLibros :
        props.listaLibros.filter((l: any) => {
            const primeraLetra = l.libro_detalle.titulo[0].toUpperCase();
            if (filtroLetra === "#") {
                return primeraLetra < "A" || primeraLetra > "Z";
            }
            return primeraLetra === filtroLetra;
        });
    
    return <section>
        <div className="h1_herramientas">
            <h1>{props.tituloCat} ({librosFiltrados.length})</h1>
            {!props.isTodos &&
                <div className="iconosCategorias">
                    { catActual?.publica ?
                        <i className="material-symbols-rounded icon_fill dark_blue" onClick={togglePublica}>lock_open</i> :
                        <i className="material-symbols-rounded icon_fill dark_blue" onClick={togglePublica}>lock</i>
                    }
                    <i className="material-symbols-rounded icon_fill dark_blue" onClick={borrarCategoria}>close</i>
                    {syncIconoPublica()}
                    {syncIconoBorrar()}
                </div>
            }
        </div>
        <div className="filtro_abc">
            { ABC.split("").map((l) => <div key={l} className={`filtro_abc_btn ${filtroLetra === l ? "activo" : ""}`} onClick={(e) => filtrarLetras(e.currentTarget.textContent)}>{l}</div>) }
            <div className={`filtro_abc_btn ${filtroLetra === "#" ? "activo" : ""}`} onClick={(e) => filtrarLetras(e.currentTarget.textContent)}>#</div>
            <div className={`filtro_abc_btn ${filtroLetra === "TODOS" ? "activo" : ""}`} onClick={(e) => filtrarLetras(e.currentTarget.textContent)}>TODOS</div>
        </div>

        <div className="filtro_abc_movil">
            Filtrar:
            <select id="abc" name="abc">
                <option onClick={() => filtrarLetras("TODOS")}>TODOS</option>
                { ABC.split("").map((l) => <option key={l} value={l} onClick={() => filtrarLetras(l)}>{l}</option>) }
                <option onClick={() => filtrarLetras("#")}>#</option>
            </select>
        </div>

        <div className="carruselLibrosCategorias">
            {librosFiltrados.map((l: any, index: number) =>
                <Libro
                    libro={l}
                    key={index}
                    prestamos={props.prestamos}
                    catsUsuario={props.catsUsuario}
                />
            )}
        </div>
    </section>
}

export default SectionCategorias;