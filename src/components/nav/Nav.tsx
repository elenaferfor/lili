import {Link} from "react-router-dom";
import "./Nav.css"

const Nav = () => {
    
    return <nav>
        <Link to="./01_lili_inicio.html" className="activo">Biblioteca</Link>
        <Link to="./02_lili_categorias.html" className="submenu">Categorías</Link>
        <Link to="./04_lili_anadir.html" className="submenu">Añadir</Link>
        <Link to="#">Recomendaciones</Link>
        <Link to="#">Amigos</Link>
        <Link to="#">Configuración</Link>
    </nav>
}

export default Nav;