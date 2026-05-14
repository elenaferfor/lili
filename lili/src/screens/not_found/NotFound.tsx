import Logo from "../../components/logo/Logo.tsx";
import Nav from "../../components/nav/Nav.tsx";
import HeaderFooter from "../../components/header_footer/HeaderFooter.tsx";
import ContenedorPerfilBusqueda from "../../components/contenedor_perfil_busqueda/ContenedorPerfilBusqueda.tsx";
import {useNavigate} from "react-router-dom";
import Footer from "../../components/footer/Footer.tsx";

const NotFound = () => {
    
    const navigate = useNavigate();
    
    return <>
        <header id="header">
            <Logo/>
            <Nav/>
            <HeaderFooter/>
        </header>
        <main>
            <ContenedorPerfilBusqueda/>
            <div className="contenido">
                <div className="migas">Página no encontrada</div>
                <button onClick={() => navigate(-1)} className="volver">Volver</button>
                <div className="secciones">
                    <h1>Ups...</h1>
                    <p>Página no encontrada.</p>
                </div>
            </div>
        </main>
        <Footer/>
    </>
}

export default NotFound;