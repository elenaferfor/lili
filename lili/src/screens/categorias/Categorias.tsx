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
            setTituloActual("Leyendo");
        }else if(tag === "Prestados"){
            setFiltroActual("/prestamos/cedidos");
            setTipoJson("prestamo");
            setTituloActual("Prestados");
        }else if(tag === "Préstamos"){
            setFiltroActual("/prestamos/recibidos");
            setTipoJson("prestamo");
            setTituloActual("Préstamos");
        }else if(tag !== ""){
            setFiltroActual("/libros_usuarios/?ordering=libro__titulo&categoria_nombre=" + tag);
            setTipoJson("categoria");
            setTituloActual(tag);
        }else{
            setFiltroActual("/libros_usuarios/?ordering=libro__titulo");
            setTipoJson("categoria");
            setTituloActual("Todos los libros");
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
                    <GetLibrosCategoria tipoJson={tipoJson} tituloCat={tituloActual} filtroBusqueda={filtroActual}/>
                </div>
            </div>
        </main>
        <Footer/>
    </>
}

export default Categorias;