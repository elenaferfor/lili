import Logo from "../../components/logo/Logo.tsx";
import Nav from "../../components/nav/Nav.tsx";
import HeaderFooter from "../../components/header_footer/HeaderFooter.tsx";
import ContenedorPerfilBusqueda from "../../components/contenedor_perfil_busqueda/ContenedorPerfilBusqueda.tsx";
import {useNavigate} from "react-router-dom";
import Footer from "../../components/footer/Footer.tsx";
import SectionAmigosCats from "../../components/section/SectionAmigosCats.tsx";
import {useAmistades} from "../../hooks/useAmistades.tsx";
import {useAuth} from "../../auth/AuthContext.tsx";
import {useCategoriasPublicas} from "../../hooks/useCategoria.tsx";
import "./Amigos.css";

const Amigos = () => {
    
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: amistades, isLoading: amistadesIsLoading } = useAmistades();
    const { data: categorias, isLoading: categoriasPublicasIsLoading } = useCategoriasPublicas();
    
    return <>
        <header id="header">
            <Logo/>
            <Nav/>
            <HeaderFooter/>
        </header>
        <main>
            <ContenedorPerfilBusqueda/>
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
        </main>
        <Footer/>
    </>
}

export default Amigos;