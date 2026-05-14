import {Link} from "react-router-dom";
import "./Libro.css"

const LibroDeOtro = (props: any) => {
    
    const libroData = props.libro;
    
    return <div className="libro">
        <div className={`portada`}>
            <img src={libroData.libro_detalle.portada} alt={libroData.libro_detalle.titulo}/>
            <div className="hoverLibro">
                <Link to={"/libro/" + libroData.libro_detalle.id}>Ver</Link>
            </div>
        </div>
        <Link to={"/libro/" + libroData.libro_detalle.id}>{libroData.libro_detalle.titulo}</Link>
    </div>
}

export default LibroDeOtro;