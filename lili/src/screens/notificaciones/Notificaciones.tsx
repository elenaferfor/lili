import Logo from "../../components/logo/Logo.tsx";
import Nav from "../../components/nav/Nav.tsx";
import HeaderFooter from "../../components/header_footer/HeaderFooter.tsx";
import ContenedorPerfilBusqueda from "../../components/contenedor_perfil_busqueda/ContenedorPerfilBusqueda.tsx";
import {useNavigate} from "react-router-dom";
import Footer from "../../components/footer/Footer.tsx";
import {useNotificaciones} from "../../hooks/useNotificacion.tsx";
import SectionNotificaciones from "../../components/section/SectionNotificaciones.tsx";
import "./Notificaciones.css";
import {useAmistades} from "../../hooks/useAmistades.tsx";
import {useLibros} from "../../hooks/useLibro.tsx";
import {useEffect, useState} from "react";

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
    
    return <>
        <header id="header">
            <Logo/>
            <Nav/>
            <HeaderFooter/>
        </header>
        <main>
            <ContenedorPerfilBusqueda/>
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
        </main>
        <Footer/>
    </>
}

export default Notificaciones;