import "./Section.css"
import Carrusel from "../carrusel/Carrusel.tsx";
import {Link} from "react-router-dom";

const SectionAmigos = (props: any) => {

    const amigos = props.amigos?.map((json: any) => (
        <div className="amigo">
            <div className="fotoPerfil">
                <img src="/perfil/te.JPG" alt={json.usuario_b_nombre.username}/>
            </div>
            <Link to="#">@{json.usuario_b_nombre.username}</Link>
        </div>
    ));

    return <section>
        <h1>{props.titulo}</h1>
        {props.isLoading
            ? <p>Cargando amigos...</p>
            : <Carrusel libros={amigos} librosVista={5} librosGrupo={4} espaciado={16}/>
        }
    </section>
}

export default SectionAmigos;