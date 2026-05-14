import {Link} from "react-router-dom";
import "./IconosPerfil.css"
import {useNotificaciones} from "../../../hooks/useNotificacion.tsx";
import {useEffect, useState} from "react";

const IconosPerfil = () => {
    
    const { data: notificaciones } = useNotificaciones();
    const [notificacionesSinLeer, setNotificacionesSinLeer] = useState<boolean>(false);

    useEffect(() => {
        if(!notificaciones) return;
        setNotificacionesSinLeer(notificaciones?.filter(n => !n.leida).length > 0)
    }, [notificaciones]);

    return <div className="iconos_perfil">
        <i className="material-symbols-rounded menu_burger" id="menu_burger">menu</i>
        <Link to="/notificaciones" className="boton_notificaciones">
            {notificacionesSinLeer ?
                <i className="material-symbols-rounded notificaciones icon_fill orange">notifications_unread</i> :
                <i className="material-symbols-rounded notificaciones icon_fill">notifications</i>
            }
        </Link>
        <Link to="/perfil" className="boton_perfil">
            Perfil
            <i className="material-symbols-rounded icon_fill">person</i>
        </Link>
    </div>
}

export default IconosPerfil