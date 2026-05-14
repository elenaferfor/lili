import "./Section.css"
import Carrusel from "../carrusel/Carrusel.tsx";
import {Link} from "react-router-dom";
import type {Amistad} from "../../types.tsx";
import {useAuth} from "../../auth/AuthContext.tsx";

const SectionAmigos = (props: any) => {

    const {user} = useAuth();
    
    const amigos = props.amigos?.filter((a: Amistad) => a.estado === "ac")
        .map((a: any) => {
            const otroUsuario = a.usuario_a_nombre.id === user?.id ? a.usuario_b_nombre : a.usuario_a_nombre;
            
            return (
                <div className="amigo">
                    <div className="fotoPerfil">
                        <Link to={`/perfil/${otroUsuario.id}`}>
                            <img src="/perfil/te.JPG" alt={otroUsuario.username}/>
                        </Link>
                    </div>
                    <Link to={`/perfil/${otroUsuario.id}`}>@{otroUsuario.username}</Link>
                </div>
            );
        });

    return <section>
        <h1>{props.titulo}</h1>
        {props.isLoading
            ? <p>Cargando amigos...</p>
            : <Carrusel libros={amigos} librosVista={5} librosGrupo={4} espaciado={16}/>
        }
    </section>
}

export default SectionAmigos;