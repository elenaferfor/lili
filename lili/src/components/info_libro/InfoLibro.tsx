import "../section/Section.css";
import "./InfoLibro.css"
import EstadoLecturaLibro from "./EstadoLecturaLibro.tsx";
import EstadoCategoriasLibro from "./EstadoCategoriasLibro.tsx";
import {useState} from "react";
import EstadoPrestamo from "./EstadoPrestamo.tsx";

const InfoLibro = (props: any) => {
    
    const [isFav, setIsFav] = useState(false);
    const [favClase, setFavClase] = useState("");
    const [favIconoClase, setFavIconoClase] = useState("material-symbols-rounded notificaciones");
    
    const toggleFav = () => {
        setIsFav(!isFav);
        setFavClase(isFav ? "estadoFavorito" : "");
        setFavIconoClase(isFav ? "material-symbols-rounded notificaciones icon_fill" : "material-symbols-rounded notificaciones");
    }
    
    return <section>
        <div className="detalleLibro">
            <div className="detalleLibroInfo">
                <div className="detalleLibroPortada">
                    <img src={props.data.portada} alt={props.data.titulo}/>
                </div>
                <div className="detalleLibroTexto">
                    <h1>{props.data.titulo}</h1>
                    <p className="autor">{props.data.autores_detalle.map((autor: any) => autor.nombre).join(", ")}</p>
                    <p><span>ISBN/UID:</span> {props.data.isbn}</p>
                    <p><span>Formato:</span> Tapa dura</p>
                    <p><span>Idioma:</span> Castellano</p>
                    <p><span>Fecha publicación original:</span> {props.data.ano_pub_og}</p>
                    <p><span>Año de la edición:</span> {props.data.ano_pub}</p>
                    <p><span>Editorial:</span> {props.data.editorial_detalle?.nombre}</p>
                    <div className="detalleLibroEstados">
                        <EstadoCategoriasLibro/>
                        <EstadoLecturaLibro/>
                        <button className={favClase} onClick={toggleFav}>Favorito <i
                            className={favIconoClase}>favorite</i></button>
                        <EstadoPrestamo/>
                    </div>
                </div>
            </div>
            <div className="detalleLibroSinopsis">
                <p>Sinopsis:</p>
                <p>{props.data.sinopsis}</p>
            </div>
        </div>
    </section>
}

export default InfoLibro;