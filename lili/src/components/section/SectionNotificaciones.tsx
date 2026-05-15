import {useEffect, useState} from "react";
import type {Amistad, Libro} from "../../types.tsx";
import {Link} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import api from "../../api/Axios.tsx";
import {useAuth} from "../../auth/AuthContext.tsx";

const SectionNotificaciones = (props: any) => {
    
    const { user } = useAuth();
    const [libroInfo, setLibroInfo] = useState<Libro | undefined>(undefined);
    const [amistadInfo, setAmistadInfo] = useState<{ id: number, nombre: string }>({ id: -1, nombre: ""});

    const [amistadGestionada, setAmistadGestionada] = useState<boolean>(false);
    const [textoAmistadGestionada, setTextoAmistadGestionada] = useState<string>("");
    
    const queryClient = useQueryClient();
    
    useEffect(() => {
        if(!props.libros) return;
        setLibroInfo(props.libros.find((l: Libro) => l.id === props.notif.referencia));
    }, [props.libros]);

    useEffect(() => {
        if(!props.amistades) return;
        
        const amistad = props.amistades.find((a: Amistad) => a.id === props.notif.referencia);
        if(!amistad) return;
        
        if (amistad.usuario_a_nombre.id === user?.id) {
            setAmistadInfo({id: amistad.usuario_b_nombre.id, nombre: amistad.usuario_b_nombre.username});
        } else {
            setAmistadInfo({id: amistad.usuario_a_nombre.id, nombre: amistad.usuario_a_nombre.username});
        }
    }, [props.amistades]);
    
    // Marcar notificación como leída al hacer hover
    const { mutate: marcarLeida } = useMutation({
        mutationFn: () => api.patch(`/notificaciones/${props.notif.id}/`, { leida: true }),
        onSuccess: () => {
            props.onLeida(props.notif.id);
        }
    });
    
    const handleMouseEnter = () => {
        if(props.esNueva){
            marcarLeida();
        }
    };
    
    // Borrar notificación de nuevo libro
    const { mutate: borrarNotificacion } = useMutation({
        mutationFn: () =>
            api.delete(`/notificaciones/${props.notif.id}/`),
        onSuccess: () => {
            console.log("DELETE ok, invalidando query...");
            queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
        },
        onError: (error) => {
            console.log("DELETE error: ", error);
        }
    });
    
    // Aceptar amistad
    const { mutate: aceptarAmistad } = useMutation({
        mutationFn: () => api.post(`/amistades/${props.notif.referencia}/aceptar/`),
        onSuccess: () => {
            setAmistadGestionada(true);
            setTextoAmistadGestionada("Amistad aceptada.");
        }
    });
    
    // Rechazar amistad
    const { mutate: ignorarAmistad } = useMutation({
        mutationFn: () => api.post(`/amistades/${props.notif.referencia}/ignorar/`),
        onSuccess: () => {
            setAmistadGestionada(true);
            setTextoAmistadGestionada("Amistad ignorada.");
        }
    });
    
    return <section className={`sectionNotificaciones ${props.esNueva ? "nueva" : ""}`}
    onMouseEnter={handleMouseEnter}>
        {props.tipo === "Nuevo libro" &&
            <div className="closeBtn" onClick={() => borrarNotificacion()}>
                <i className="material-symbols-rounded">close</i>
            </div>
        }
        {props.tipo === "Petición de amistad" &&
            <div className="closeBtn" onClick={() => {
                if(!amistadGestionada) ignorarAmistad();
                borrarNotificacion();
            }}>
                <i className="material-symbols-rounded">close</i>
            </div>
        }
        <h1>{props.tipo}</h1>
        <div className="notificaciones_info">
            {props.tipo === "Nuevo libro" &&
                <>
                    <div className="libroFoto">
                        <Link to={`/libro/${libroInfo?.id}`}>
                            <img src={libroInfo?.portada} alt={libroInfo?.titulo}/>    
                        </Link>
                    </div>
                    <p>{props.notif.texto}</p>
                </>
            }
            {props.tipo === "Petición de amistad" &&
                <>
                    <div className="amigoFoto">
                        <img src="/perfil/te.JPG" alt={amistadInfo.nombre}/>
                    </div>
                    { amistadGestionada ?
                        <p>{textoAmistadGestionada}</p> :
                        <>
                            <p>@{amistadInfo.nombre} {props.notif.texto}</p>
                            <button className="btn_amistad aceptar"
                            onClick={() => aceptarAmistad()}>Aceptar <i className="material-symbols-rounded">check</i></button>
                            <button className="btn_amistad rechazar"
                            onClick={() => ignorarAmistad()}>Ignorar <i className="material-symbols-rounded">close</i></button>
                        </>
                    }
                </>
            }
        </div>
    </section>;
}

export default SectionNotificaciones;