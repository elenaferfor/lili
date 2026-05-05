import {Link} from "react-router-dom";
import "./Nav.css"

const Nav = () => {
    
    return <nav>
        <Link to="/" className="activo">Biblioteca</Link>
        <Link to="/categorias" className="submenu">Categorías</Link>
        <Link to="./04_lili_anadir.html" className="submenu">Añadir</Link>
        <Link to="#" className="disabled">Recomendaciones</Link>
        <Link to="#">Amigos</Link>
        <Link to="#" className="disabled">Configuración</Link>
    </nav>
}

export default Nav;