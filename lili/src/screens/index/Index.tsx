import ContenedorPerfilBusqueda from "../../components/contenedor_perfil_busqueda/ContenedorPerfilBusqueda.tsx";
import Section from "../../components/section/Section.tsx";
import Nav from "../../components/nav/Nav.tsx";
import HeaderFooter from "../../components/header_footer/HeaderFooter.tsx";
import Footer from "../../components/footer/Footer.tsx";
import "./Index.css"
import Logo from "../../components/logo/Logo.tsx";

const Index = () => {
    
    return <>
        <header id="header">
            <Logo/>
            <Nav/>
            <HeaderFooter/>
        </header>
        <main>
            <ContenedorPerfilBusqueda/>
            <div className="contenido">
                <div className="migas">Biblioteca</div>
                <div className="secciones">
                    <Section titulo={"Últimos añadidos"} esLibroUsuario={true} filtroBusqueda={"/libros_usuarios/?ordering=-fecha_anadido"}/>
                    <Section titulo={"Lista de deseos"} esLibroUsuario={true} filtroBusqueda={"/libros_usuarios/?serie=&estado=&favorito=unknown&categoria_nombre=lista+de+deseos"}/>
                    {/*
                    Añadir cuando funcione con Open Library
                    <Section titulo={"Recomendados para ti"} filtroBusqueda={""}/>
                    */}
                </div>
            </div>
        </main>
        <Footer/>
    </>
}

export default Index;