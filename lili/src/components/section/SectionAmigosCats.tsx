import {Link} from "react-router-dom";

const SectionAmigosCats = (props: any) => {
    
    return <section className="sectionAmigosCats">
        <h1><Link to={`/perfil/${props.amigoId}`}>@{props.username}</Link></h1>
        <div className="amigo_perfil_tags">
            <div className="amigoFoto">
                <img src="/perfil/te.JPG" alt="Té"/>
            </div>
            <div className="tags_usuario">
                { props.categorias && 
                    props.categorias.map((c: any) => <button key={c.id}>{c.nombre}</button>)
                }
            </div>
        </div>
    </section>;
}

export default SectionAmigosCats;