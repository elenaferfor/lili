import {useNavigate} from "react-router-dom";
import {useNotificaciones} from "../../hooks/useNotificacion.tsx";
import SectionNotificaciones from "../../components/section/SectionNotificaciones.tsx";
import "./Notificaciones.css";
import {useAmistades} from "../../hooks/useAmistades.tsx";
import {useLibros} from "../../hooks/useLibro.tsx";
import {useEffect, useState} from "react";
import {Layout} from "../Layout.tsx";

const Notificaciones = () => {
    
    const navigate = useNavigate();

    const { data: notificaciones, isLoading: notificacionesIsLoading } = useNotificaciones();
    const { data: amistades, isLoading: amistadesIsLoading } = useAmistades();
    const { data: libros, isLoading: librosIsLoading } = useLibros();

    const [nuevas, setNuevas] = useState<Set<number>>(new Set());

    useEffect(() => {
        if(!notificaciones) return;
        const idsNuevas = notificaciones.filter(n => !n.leida).map(n => n.id);
        setNuevas(new Set(idsNuevas));
    }, []);
    
    return <Layout>
        <div className="contenido">
            <div className="migas">Amigos</div>
            <button onClick={() => navigate(-1)} className="volver">Volver</button>
            <div className="secciones">
                <h1>Notificaciones nuevas ({notificaciones?.filter(n => !n.leida).length})</h1>
                { (notificacionesIsLoading && amistadesIsLoading && librosIsLoading) ?
                    <section><h1>Cargando notificaciones...</h1></section> :
                    notificaciones?.map(n => {
                        return <SectionNotificaciones key={n.id} notif={n} tipo={n.tipo}
                                                      amistades={amistades} libros={libros}
                                                      esNueva={nuevas.has(n.id)}
                                                      onLeida={(id: number) => setNuevas(prev => {
                                                          const reset = new Set(prev);
                                                          reset.delete(id);
                                                          return reset;
                                                      })}
                        />
                    })
                }
            </div>
        </div>
    </Layout>
}

export default Notificaciones;