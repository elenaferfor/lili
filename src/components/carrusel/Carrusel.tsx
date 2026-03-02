import Libro from "../libro/Libro.tsx";
import "./Carrusel.css"
import {useEffect, useRef, useState} from "react";
const Carrusel = (props) => {
    
    const [librosVista, setLibrosVista] = useState(props.librosVista);
    const [librosGrupo, setLibrosGrupo] = useState(props.librosGrupo);
    const [espaciado, setEspaciado] = useState(props.espaciado);
    
    const [anchoLibro, setAnchoLibro] = useState(0);
    const contenedor = useRef(null);
    
    useEffect( () => {
        if(contenedor.current){
            const anchoContenedor = contenedor.current.offsetWidth;
            
            const elementos = props.libros;
            
            elementos.forEach(e => {
                setAnchoLibro(Math.ceil(anchoContenedor / librosVista) - espaciado);
            })
        }
    }, [librosVista, espaciado])
        
    
    
    const btnCarruselHandler = (direccion) => {
        if(direccion === "siguiente"){
            // TODO: añadir lógica
        }else if(direccion === "anterior"){
            // TODO: añadir lógica
        }
    }
    
    return <>
        <div className="carruselLibros" ref={contenedor}>
            {props.libros}
        </div>
        <div className="botonesCarruselLibros">
            <button onClick={() => btnCarruselHandler("anterior")}>
                <i className="material-symbols-rounded arrow inactive">arrow_left</i>
            </button>
    
            <i className="material-symbols-rounded icon_fill dot activo">circle</i>
            <i className="material-symbols-rounded icon_fill dot">circle</i>
            <i className="material-symbols-rounded icon_fill dot">circle</i>
    
            <button onClick={() => btnCarruselHandler("siguiente")}>
                <i className="material-symbols-rounded arrow activo">arrow_right</i>
            </button>
        </div>
    </>
}

export default Carrusel;