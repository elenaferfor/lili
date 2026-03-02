import ContenedorPerfilBusqueda from "../../components/contenedor_perfil_busqueda/ContenedorPerfilBusqueda.tsx";
import Section from "../../components/section/Section.tsx";
import {Link} from "react-router-dom";
import Nav from "../../components/nav/Nav.tsx";
import HeaderFooter from "../../components/header_footer/HeaderFooter.tsx";
import Footer from "../../components/footer/Footer.tsx";
import "./Index.css"

const Index = () => {
    
    return <>
        <header id="header">
            <div className="logo">
                <i className="material-symbols-rounded" id="menu_close">close</i>
                <Link to="./01_lili_inicio.html" className="logo_link"><img src="./logo_dark.svg" alt="logo"/></Link>
            </div>
            <Nav/>
            <HeaderFooter/>
        </header>
        <main>
            <ContenedorPerfilBusqueda/>
            <div className="contenido">
                <div className="migas">Biblioteca</div>
                <div className="secciones">
                    <Section titulo={"Últimos añadidos"}/>
                    <Section titulo={"Lista de deseos"}/>
                    <Section titulo={"Recomendados para ti"}/>
                </div>
            </div>
        </main>
        <Footer/>
    </>
}

export default Index;