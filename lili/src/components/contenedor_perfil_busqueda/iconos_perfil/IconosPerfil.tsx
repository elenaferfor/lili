import {Link} from "react-router-dom";
import "./IconosPerfil.css"

const IconosPerfil = () => {

    return <div className="iconos_perfil">
        <i className="material-symbols-rounded menu_burger" id="menu_burger">menu</i>
        <Link to="#" className="boton_notificaciones">
            <i className="material-symbols-rounded notificaciones icon_fill">notifications</i>
        </Link>
        <Link to="./05_lili_perfil.html" className="boton_perfil">
            Perfil
            <i className="material-symbols-rounded icon_fill">person</i>
        </Link>
    </div>
}

export default IconosPerfil