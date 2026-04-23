import {Link} from "react-router-dom";
import "./Libro.css"
import {useEffect, useState} from "react";
import api from "../../api/Axios.tsx";

const Libro = (props: { portada: string | undefined; id: number; titulo: string | undefined; }) => {
    
    const [estadoLectura, setEstadoLectura] = useState<string>("");
    const [favorito, setFavorito] = useState<boolean>(false);
    const [estadoPrestar, setEstadoPrestar] = useState<string>("");
    const [categorias, setCategorias] = useState<string[]>([]);
    
    useEffect(() => {
        api.get("/libros_usuarios").then(response => {
            
        });
    }, []);
    
    return <div className="libro">
        <div className="portada">
            <img src={props.portada} alt="props.titulo"/>
            <div className="hoverLibro">
                <div className="iconosHoverLibro">
                    <i className="material-symbols-rounded green">check</i>
                    <i className="material-symbols-rounded pink">favorite</i>
                    <i className="material-symbols-rounded white">close</i>
                </div>
                <Link to={"/libro/" + props.id}>Ver</Link>
            </div>
        </div>
        <Link to={"/libro/" + props.id}>{props.titulo}</Link>
    </div>
}

export default Libro;