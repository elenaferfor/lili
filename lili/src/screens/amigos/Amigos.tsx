import {useNavigate} from "react-router-dom";
import SectionAmigosCats from "../../components/section/SectionAmigosCats.tsx";
import {useAmistades} from "../../hooks/useAmistades.tsx";
import {useAuth} from "../../auth/AuthContext.tsx";
import {useCategoriasPublicas} from "../../hooks/useCategoria.tsx";
import "./Amigos.css";
import {Layout} from "../Layout.tsx";

const Amigos = () => {
    
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: amistades, isLoading: amistadesIsLoading } = useAmistades();
    const { data: categorias, isLoading: categoriasPublicasIsLoading } = useCategoriasPublicas();
    
    return <Layout>
        <div className="contenido">
            <div className="migas">Amigos</div>
            <button onClick={() => navigate(-1)} className="volver">Volver</button>
            <div className="secciones">
                <h1>Amigos</h1>
                { (amistadesIsLoading && categoriasPublicasIsLoading) ?
                    <section><h1>Cargando amigos...</h1></section> :
                    amistades?.filter(a => a.estado === "ac").map(a => {
                        const amigoActual = a.usuario_a_nombre.id === user?.id ? a.usuario_b_nombre : a.usuario_a_nombre;
                        const categoriasAmigo = categorias?.filter(c => c.usuario === amigoActual.id);
                        return <SectionAmigosCats key={amigoActual.id} amigoId={amigoActual.id} username={amigoActual.username} categorias={categoriasAmigo} />
                    })
                }
            </div>
        </div>
    </Layout>
}

export default Amigos;