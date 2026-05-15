import {Link, useLocation} from "react-router-dom";
import "./IconosPerfil.css"
import {useNotificaciones} from "../../../hooks/useNotificacion.tsx";
import {useEffect, useState} from "react";
import {useMenu} from "../../../menu/MenuContext.tsx";

const IconosPerfil = () => {

    const { pathname } = useLocation();
    const { openMenu } = useMenu();
    const { data: notificaciones } = useNotificaciones();
    const [notificacionesSinLeer, setNotificacionesSinLeer] = useState<boolean>(false);

    useEffect(() => {
        if(!notificaciones) return;
        setNotificacionesSinLeer(notificaciones?.filter(n => !n.leida).length > 0)
    }, [notificaciones]);

    return <div className="iconos_perfil">
        <button id="menu_burger" onClick={openMenu} onTouchEnd={openMenu}><i className="material-symbols-rounded">menu</i></button>
        <Link to="/notificaciones" className="boton_notificaciones">
            {notificacionesSinLeer ?
                <i className={`material-symbols-rounded notificaciones icon_fill orange ${pathname === "/notificaciones" ? "green" : ""}`}>notifications_unread</i> :
                <i className={`material-symbols-rounded notificaciones icon_fill ${pathname === "/notificaciones" ? "green" : ""}`}>notifications</i>
            }
        </Link>
        <Link to="/perfil" className={`boton_perfil ${pathname === "/perfil" ? "green" : ""}`}>
            Perfil
            <i className="material-symbols-rounded icon_fill">person</i>
        </Link>
    </div>
}

export default IconosPerfil