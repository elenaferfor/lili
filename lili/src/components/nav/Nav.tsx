import {Link} from "react-router-dom";
import "./Nav.css"

const Nav = () => {
    
    return <nav>
        <Link to="/" className="activo">Biblioteca</Link>
        <Link to="/categorias" className="submenu">Categorías</Link>
        <Link to="/resultados" className="submenu">Añadir</Link>
        <Link to="#" className="disabled">Recomendaciones</Link>
        <Link to="/amigos">Amigos</Link>
        <Link to="#" className="disabled">Configuración</Link>
    </nav>
}

export default Nav;