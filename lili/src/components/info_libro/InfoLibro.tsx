import "../section/Section.css";
import "./InfoLibro.css"

const InfoLibro = (props: any) => {
    
    console.log(props.data);
    
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
                        <button className="">Eliminar de <i className="material-symbols-rounded">close</i></button>
                        <div id="estadoLectura">
                            <button className="estadoVerde">Leído <i className="material-symbols-rounded">check</i>
                            </button>
                            <ul className="estadoLecturaOpciones">
                                <li>
                                    <button className="estadoVerde">Leído <i
                                        className="material-symbols-rounded">check</i></button>
                                </li>
                                <li>
                                    <button className="">Leyendo <i className="material-symbols-rounded">menu_book</i>
                                    </button>
                                </li>
                                <li>
                                    <button className="">Abandonado <i className="material-symbols-rounded">close</i>
                                    </button>
                                </li>
                                <li>
                                    <button className="">Sin empezar</button>
                                </li>
                            </ul>
                        </div>
                        <button className="estadoFavorito">Favorito <i
                            className="material-symbols-rounded notificaciones icon_fill">favorite</i></button>
                        <button className="estadoPrestar">Prestar <i
                            className="material-symbols-rounded notificaciones">partner_exchange</i></button>
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