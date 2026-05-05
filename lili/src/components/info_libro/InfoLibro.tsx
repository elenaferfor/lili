import "../section/Section.css";
import "./InfoLibro.css"
import EstadoLecturaLibro from "./EstadoLecturaLibro.tsx";
import EstadoCategoriasLibro from "./EstadoCategoriasLibro.tsx";
import {useEffect, useState} from "react";
import EstadoPrestamo from "./EstadoPrestamo.tsx";
import {useParams} from "react-router-dom";
import {useUsuarioLibro} from "../../hooks/useUsuarioLibro.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import api from "../../api/Axios.tsx";
import {useAuth} from "../../auth/AuthContext.tsx";
import {type Favorito, FAVORITOS, type UsuarioLibroPostRequest, type SyncEstado} from "../../types.tsx";

const InfoLibro = (props: any) => {
    const { libroId } = useParams();
    const libroIdNum = Number(libroId);
    const queryClient = useQueryClient();
    const [noUsuarioLibro, setNoUsuarioLibro] = useState(true); 
    const [requestBody, setRequestBody] = useState<UsuarioLibroPostRequest>();
    const { user } = useAuth();
    
    const [isFav, setIsFav] = useState<Favorito>(FAVORITOS[1]);
    const [syncFav, setSyncFav] = useState<SyncEstado>("idle");
    const [syncCrear, setSyncCrear] = useState<SyncEstado>("idle");
    
    // Traer favorito
    const {data: usuarioLibro} = useUsuarioLibro(libroIdNum);
    
    useEffect(() => {
        if(!usuarioLibro){
            setNoUsuarioLibro(true);
            setRequestBody({
                "usuario": user?.id,
                "libro": libroIdNum,
                "serie": null,
                "numero_en_serie": null,
                "estado": "s_e",
                "favorito": false,
                "publico": true,
                "categorias": []
            });
            return;
        }
        setNoUsuarioLibro(false);
        const fav = usuarioLibro.favorito ? FAVORITOS[0] : FAVORITOS[1];
        setIsFav(fav);
    }, [usuarioLibro, user]);

    // Mutación crear libroUsuario
    const { mutate: crearLibroUsuario } = useMutation({
        mutationFn: () =>
            api.post(`/libros_usuarios/`, requestBody),
        onMutate: () => setSyncCrear("enviando"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarioLibro", libroIdNum] });
            setSyncCrear("ok");
            setTimeout(() => setSyncCrear("idle"), 1500);
        },
        onError: () => setSyncCrear("idle"),
    });

    // Mutación borrar libroUsuario
    const { mutate: borrarLibroUsuario } = useMutation({
        mutationFn: () =>
            api.delete(`/libros_usuarios/${usuarioLibro?.id}/`),
        onMutate: () => setSyncCrear("enviando"),
        onSuccess: () => {
            console.log("DELETE ok, invalidando query...");
            queryClient.invalidateQueries({ queryKey: ["usuarioLibro", libroIdNum] });
            setSyncCrear("ok");
            setTimeout(() => setSyncCrear("idle"), 1500);
        },
        onError: (error) => {
            console.log("DELETE error: ", error);
            setSyncCrear("idle");
        }
    });
    
    // Mutación nuevo estado favorito
    const { mutate: cambiarFavorito } = useMutation({
        mutationFn: () =>
            api.post(`/libros_usuarios/${usuarioLibro?.id}/cambiar_favorito/`),
        onMutate: () => setSyncFav("enviando"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarioLibro", libroIdNum] });
            setSyncFav("ok");
            setTimeout(() => setSyncFav("idle"), 1500);
        },
        onError: () => setSyncFav("idle"),
    });
    
    const crearBorrarLibroUsuario = () => {
        if(noUsuarioLibro) {
            crearLibroUsuario();
        }else{
            borrarLibroUsuario();
        }
    }
    
    const toggleFav = (fav: Favorito) => {
        setIsFav(fav);
        cambiarFavorito();
    }

    const syncIconoFav = () => {
        if(syncFav === "enviando") return <i className="material-symbols-rounded">sync</i>;
        if(syncFav === "ok") return <i className="material-symbols-rounded">check_circle</i>;
        return null;
    };

    const syncIconoCrear = () => {
        if(syncCrear === "enviando") return <i className="material-symbols-rounded">sync</i>;
        if(syncCrear === "ok") return <i className="material-symbols-rounded">check_circle</i>;
        return null;
    };
    
    return <section>
        <div className="detalleLibro">
            <div className="detalleLibroInfo">
                <div className="detalleLibroPortada">
                    <img src={props.data.portada} alt={props.data.titulo}/>
                </div>
                <div className="detalleLibroTexto">
                    <h1>{props.data.titulo}</h1>
                    <p className="autor">{props.data.autores_detalle.map((autor: any) => autor.nombre).join(", ")}</p>
                    <p><span>ISBN/UID:</span> {props.data.isbn}</p>
                    <p><span>Formato:</span> Tapa dura</p>
                    <p><span>Idioma:</span> Castellano</p>
                    <p><span>Fecha publicación original:</span> {props.data.ano_pub_og}</p>
                    <p><span>Año de la edición:</span> {props.data.ano_pub}</p>
                    <p><span>Editorial:</span> {props.data.editorial_detalle?.nombre}</p>
                    { noUsuarioLibro ?
                        <div className="detalleLibroEstados">
                            <button className="estadoAnadir" onClick={crearBorrarLibroUsuario}>Añadir
                                <i className="material-symbols-rounded">add</i>{syncIconoCrear()}</button>
                        </div>
                        :
                        <div className="detalleLibroEstados">
                            <EstadoCategoriasLibro libroId={libroIdNum}/>
                            <EstadoLecturaLibro/>
                            <button className={isFav.clase} onClick={() => toggleFav(isFav)}>Favorito 
                                <i className={isFav.iconoClase}>favorite</i>{syncIconoFav()}</button>
                            <EstadoPrestamo/>
                            <button onClick={crearBorrarLibroUsuario}>Eliminar
                                <i className="material-symbols-rounded">close</i>{syncIconoCrear()}</button>
                        </div>
                    }
                </div>
            </div>
            <div className="detalleLibroSinopsis">
                <p>Sinopsis:</p>
                <p>{props.data.sinopsis}</p>
            </div>
        </div>
    </section>
}

export default InfoLibro;