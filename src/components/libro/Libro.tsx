import {Link} from "react-router-dom";
import "./Libro.css"

const Libro = (props) => {
    
    
    return <div className="libro embla__slide">
        <div className="portada">
            {/*<img src="/covers/hambre.jpg" alt="Un hambre insaciable"/>*/}
            <img src={props.portada} alt="Un hambre insaciable"/>
            <div className="hoverLibro">
                <div className="iconosHoverLibro">
                    <i className="material-symbols-rounded green">check</i>
                    <i className="material-symbols-rounded pink">favorite</i>
                    <i className="material-symbols-rounded white">close</i>
                </div>
                <Link to="./03_lili_detalleLibro.html">Ver</Link>
            </div>
        </div>
        <Link to="./03_lili_detalleLibro.html">Un hambre insaciable</Link>
    </div>
}

export default Libro;