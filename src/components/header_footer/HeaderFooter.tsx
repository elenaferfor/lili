import {Link} from "react-router-dom";
import "./HeaderFooter.css"

const HeaderFooter = () => {

    return <div className="header_footer">
        <div className="boton_sesion">
            <Link to="#">Cerrar sesión</Link>
        </div>
        <div className="enlaces_footer">
            <div className="contenedor_enlace_footer">
                <Link to="#">Contacto</Link>
            </div>
            <div className="contenedor_enlace_footer">
                <Link to="#">Legal</Link>
            </div>
        </div>
    </div>
}

export default HeaderFooter;