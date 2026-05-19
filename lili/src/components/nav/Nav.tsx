import {Link} from "react-router-dom";
import "./Nav.css"
import {useEffect, useState} from "react";

const Nav = () => {
    
    const [url_actual,  setUrl_actual] = useState("");
    
    useEffect(()=>{
        setUrl_actual(window.location.pathname);
    }, []);
    
    return <nav>
        <Link to="/" className={`${url_actual === "/" ? "activo" : ""}`}>Biblioteca</Link>
        <Link to="/categorias" className={`submenu ${url_actual.includes("categorias") ? "activo" : ""}`}>Categorías</Link>
        <Link to="/resultados" className={`submenu ${url_actual.includes("resultados") ? "activo" : ""}`}>Añadir</Link>
        <Link to="#" className="disabled">Recomendaciones</Link>
        <Link to="/amigos" className={`${url_actual.includes("amigos") ? "activo" : ""}`}>Amigos</Link>
        <Link to="#" className="disabled">Configuración</Link>
    </nav>
}

export default Nav;