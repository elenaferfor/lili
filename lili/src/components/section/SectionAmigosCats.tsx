import {Link, useNavigate} from "react-router-dom";

const SectionAmigosCats = (props: any) => {
    
    const navigate = useNavigate();
    
    return <section className="sectionAmigosCats">
        <h1><Link to={`/perfil/${props.amigoId}`}>@{props.username}</Link></h1>
        <div className="amigo_perfil_tags">
            <div className="amigoFoto">
                <img src="/perfil/profile.png" alt="Foto de perfil"/>
            </div>
            <div className="tags_usuario">
                { props.categorias && 
                    props.categorias.map((c: any) => <button key={c.id} onClick={() => navigate(`/categorias/${props.amigoId}/${c.id}`)}>{c.nombre}</button>)
                }
            </div>
        </div>
    </section>;
}

export default SectionAmigosCats;