import {Link} from "react-router-dom";
import "./Libro.css"
import {useEffect, useState} from "react";
import {
    type EstadoOpcion,
    ESTADOS,
    type Favorito,
    FAVORITOS,
    ICONOS_PRESTAMO, type Prestamo,
    type PrestamoIcono
} from "../../types.tsx";
import PanelLibro from "../panel_libro/PanelLibro.tsx";
import {useAuth} from "../../auth/AuthContext.tsx";

const Libro = (props: any) => {
    
    const libroData = props.libro;
    const [panelAbierto, setPanelAbierto] = useState(false);
    
    const [isFav, setIsFav] = useState<Favorito>(FAVORITOS[1]);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState<EstadoOpcion>(ESTADOS[3]);
    const [estadoPrestamo, setEstadoPrestamo] = useState<PrestamoIcono>(ICONOS_PRESTAMO[0]);
    
    const { user } = useAuth();
    
    useEffect(() => {
        if(!props.libro) return;
        setIsFav(libroData.favorito ? FAVORITOS[0] : FAVORITOS[1]);
    }, [libroData.favorito]);

    useEffect(() => {
        if(!props.libro) return;
        setEstadoSeleccionado(ESTADOS.find(e => e.valor === libroData.estado) ?? ESTADOS[3]);
    }, [libroData.estado]);
    
    useEffect(() => {
        if(!props.prestamos) return;
        const prestamoActual = props.prestamos.find((p: Prestamo) => p.libro_detalle.id === libroData.libro_detalle.id && p.estado === "activo");
        if(!prestamoActual){
            setEstadoPrestamo(ICONOS_PRESTAMO[0]);
            return;
        }
        if(prestamoActual.prestatario_nombre.id === user?.id) {
            setEstadoPrestamo(ICONOS_PRESTAMO[2]);
        }else{
            setEstadoPrestamo(ICONOS_PRESTAMO[1]);
        }
    }, [props.prestamos]);
    
    return <div className="libro">
        <div className={`portada ${panelAbierto ? "hover-forzado" : ""}`}>
            <img src={libroData.libro_detalle.portada} alt={libroData.libro_detalle.titulo}/>
            <div className="hoverLibro">
                {!props.deOtro &&
                    <>
                        <div className="iconosHoverLibro" onClick={() => setPanelAbierto(true)}>
                            <i className={`material-symbols-rounded ${estadoSeleccionado.clase}`}>{estadoSeleccionado.icono}</i>
                            <i className={`${isFav.iconoClase} pink`}>favorite</i>
                            <i className={`material-symbols-rounded ${estadoPrestamo.clase}`}>{estadoPrestamo.icono}</i>
                        </div>
                        {panelAbierto && (
                            <PanelLibro
                                libroId={libroData.libro_detalle.id}
                                onClose={() => setPanelAbierto(false)}
                            />
                        )}
                    </>
                }
                <Link to={"/libro/" + libroData.libro_detalle.id}>Ver</Link>
            </div>
        </div>
        <Link to={"/libro/" + libroData.libro_detalle.id}>{libroData.libro_detalle.titulo}</Link>
    </div>
}

export default Libro;