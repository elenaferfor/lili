import Logo from "../../components/logo/Logo.tsx";
import Nav from "../../components/nav/Nav.tsx";
import HeaderFooter from "../../components/header_footer/HeaderFooter.tsx";
import ContenedorPerfilBusqueda from "../../components/contenedor_perfil_busqueda/ContenedorPerfilBusqueda.tsx";
import Footer from "../../components/footer/Footer.tsx";
import {useNavigate} from "react-router-dom";
import Etiquetas from "../../components/etiquetas/Etiquetas.tsx";
import {useEffect, useState} from "react";
import GetLibrosCategoria from "../../components/get_libros/GetLibrosCategoria.tsx";

const Categorias = () => {
    
    const navigate = useNavigate();
    const [filtroActual, setFiltroActual] = useState("/libros_usuarios/?ordering=libro__titulo");
    const [tituloActual, setTituloActual] = useState("Todos los libros");
    const [tipoJson, setTipoJson] = useState("categoria");
    
    useEffect(() => {
        
    }, []);
    
    const onChangeTag = (tag: string) => {
        if(tag === "Leyendo"){
            setFiltroActual("/libros_usuarios/leyendo");
            setTipoJson("estado");
        }else if(tag === "Prestados"){
            setFiltroActual("/prestamos/cedidos");
            setTipoJson("prestamo");
        }else if(tag === "Préstamos"){
            setFiltroActual("/prestamos/recibidos");
            setTipoJson("prestamo");
        }else{
            setFiltroActual("/libros_usuarios/?ordering=libro__titulo&categoria_nombre=" + tag);
            setTipoJson("categoria");
        }
    } 
    
    
    return <>
        <header id="header">
            <Logo/>
            <Nav/>
            <HeaderFooter/>
        </header>
        <main>
            <ContenedorPerfilBusqueda/>
            <div className="contenido">
                <div className="migas">Biblioteca · Categorías</div>
                <button onClick={() => navigate(-1)} className="volver">Volver</button>
                <div className="secciones">
                    <Etiquetas onChangeTag={onChangeTag}/>
                    { /* TODO: enviar la llamada según la categoría marcada. También mandarle el título
                     */ }
                    <GetLibrosCategoria tipoJson={tipoJson} tituloCat={tituloActual} filtroBusqueda={filtroActual}/>
                </div>
            </div>
        </main>
        <Footer/>
    </>
}

export default Categorias;