import {Link, useNavigate} from "react-router-dom";
import AnadirBtn from "../contenedor_perfil_busqueda/barra/resultado/AnadirBtn.tsx";
import {FORMATOS} from "../../types.tsx";

const ResultadoCompleto = (props: any) => {
    
    const navigate = useNavigate();
    
    if(props.item.tipo === 'usuario'){
        // TODO: añadir páginas de usuario y autor y enlazar los resultados
        return <div className="libroResultadosBusqueda">
            <Link to="#" className="detalleUsuarioInfo">
                <h1>{`@${props.item.username}`}</h1>
            </Link>
            <button className="anadirResultadosBusqueda" 
                    onClick={() => navigate(`/perfil/${props.item.id}`)}>
                Ver perfil
            </button>
        </div>
    }else if(props.item.tipo === 'autor'){
        return <div className="libroResultadosBusqueda">
            <Link to="#" className="detalleAutorInfo">
                <h1>{`${props.item.nombre}`}</h1>
            </Link>
            <button className="anadirResultadosBusqueda">
                Ver
            </button>
        </div>
    }else{
        return <div className="libroResultadosBusqueda">
            <div className="libroBusqueda">
                <div className="libro">
                    <div className="portada">
                        <img src={props.item.portada} alt={props.item.titulo}/>
                        <div className="hoverLibro">
                            <Link to={`/libro/${props.item.id}/`}>Ver más</Link>
                        </div>
                    </div>
                </div>
                <div className="textoLibroBusqueda">
                    <p><span>{props.item.titulo}</span></p>
                    <p>{props.item.autores_detalle.map((a: any) => a.nombre).join(", ")}</p>
                    <p><span>ISBN/UID:</span> {props.item.isbn}</p>
                    <p><span>Formato:</span> {FORMATOS[props.item.formato] ?? props.item.formato}</p>
                    <p><span>Idioma:</span> Castellano</p>
                    <p><span>Fecha publicación original:</span> {props.item.ano_pub_og}</p>
                    <p><span>Año de la edición:</span> {props.item.ano_pub}</p>
                    <p><span>Editorial:</span> {props.item.editorial_detalle.nombre}</p>
                </div>
            </div>
            <AnadirBtn item={props.item} clase="anadirResultadosBusqueda"/>
            
        </div>
    }

}

export default ResultadoCompleto;