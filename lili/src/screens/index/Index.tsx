import ContenedorPerfilBusqueda from "../../components/contenedor_perfil_busqueda/ContenedorPerfilBusqueda.tsx";
import Nav from "../../components/nav/Nav.tsx";
import HeaderFooter from "../../components/header_footer/HeaderFooter.tsx";
import Footer from "../../components/footer/Footer.tsx";
import "./Index.css"
import Logo from "../../components/logo/Logo.tsx";
import SectionSinGet from "../../components/section/SectionSinGet.tsx";
import {useUsuarioLibrosLista} from "../../hooks/useUsuarioLibro.tsx";

const Index = () => {

    const { data: libros, isLoading: librosIsLoading } = useUsuarioLibrosLista();
    
    const deseos = libros?.filter(l => l.categorias_detalle.some(c => c.nombre === "Lista de deseos"));
    
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
                    <SectionSinGet titulo={"Últimos añadidos"} listaLibros={libros?.slice(0, 14)} isLoading={librosIsLoading}/>
                    <SectionSinGet titulo={"Lista de deseos"} listaLibros={deseos?.slice(0, 14)} isLoading={librosIsLoading}/>
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