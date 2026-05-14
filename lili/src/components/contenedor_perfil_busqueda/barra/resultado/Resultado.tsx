import "./Resultado.css";
import {Link} from "react-router-dom";
import AnadirBtnRapido from "./AnadirBtnRapido.tsx";
import AnadirBtn from "./AnadirBtn.tsx";

const Resultado = (props: any) => {
    
    if(props.item.tipo === 'usuario'){
        // TODO: añadir páginas de usuario y autor y enlazar los resultados
        return <div className="resultado">
            <Link to={`/perfil/${props.item.id}`} className="detalleUsuarioInfo">
                <h1>{`@${props.item.username}`}</h1>
            </Link>
        </div>
    }else if(props.item.tipo === 'autor'){
        return <div className="resultado"> 
            <Link to="#" className="detalleAutorInfo">
                <h1>{`${props.item.nombre}`}</h1>
            </Link>
        </div>
    }else{
        return <div className="resultado">
            <div className="detalleLibroInfo">
                <Link to={`/libro/${props.item.id}/`} className="detalleLibroPortada">
                    <img src={props.item.portada} alt={props.item.titulo}/>
                </Link>
                <div className="detalleLibroTexto">
                    <Link to={`/libro/${props.item.id}/`}><h1>{props.item.titulo}</h1></Link>
                    <p className="autor">{props.item.autores_detalle.map((a: any) => a.nombre).join(", ")}</p>
                    <p><span>ISBN/UID:</span> {props.item.isbn}</p>
                    <p><span>Editorial:</span> {props.item.editorial_detalle.nombre}</p>
                    <div className="detalleLibroEstados">
                        <AnadirBtn clase="estadoAnadir" item={props.item}/>
                        <AnadirBtnRapido item={props.item}/>
                    </div>
                </div>
            </div>
        </div>
    }

}

export default Resultado;