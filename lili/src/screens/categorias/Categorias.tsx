import Logo from "../../components/logo/Logo.tsx";
import Nav from "../../components/nav/Nav.tsx";
import HeaderFooter from "../../components/header_footer/HeaderFooter.tsx";
import ContenedorPerfilBusqueda from "../../components/contenedor_perfil_busqueda/ContenedorPerfilBusqueda.tsx";
import Footer from "../../components/footer/Footer.tsx";
import {useNavigate} from "react-router-dom";
import Etiquetas from "../../components/etiquetas/Etiquetas.tsx";
import {useEffect, useState} from "react";
import GetLibrosCategoria from "../../components/get_libros/GetLibrosCategoria.tsx";
import {useCategorias} from "../../hooks/useUsuarioLibro.tsx";

const Categorias = () => {

    const [catsUsuario, setCatsUsuario] = useState<any[]>([]);
    
    const navigate = useNavigate();
    const [filtroActual, setFiltroActual] = useState("/libros_usuarios/?ordering=libro__titulo");
    const [tituloActual, setTituloActual] = useState("Todos los libros");
    const [tipoJson, setTipoJson] = useState("categoria");
    const [tagActivo, setTagActivo] = useState<number>(0);

    // Traer categorías
    const { data: categorias } = useCategorias();

    useEffect(() => {
        if(!categorias) return;
        setCatsUsuario(categorias);
    }, [categorias]);
    
    const onChangeTag = (tag: string, pos: number) => {
        // Leyendo, prestados y préstamos no pertenecen a categorías, son llamadas a actions específicos
        if(tag === "Leyendo"){
            setFiltroActual("/libros_usuarios/leyendo");
            setTipoJson("estado");
            setTituloActual("Leyendo");
            setTagActivo(pos);
        }else if(tag === "Prestados"){
            setFiltroActual("/prestamos/cedidos");
            setTipoJson("prestamo");
            setTituloActual("Prestados");
            setTagActivo(pos);
        }else if(tag === "Préstamos"){
            setFiltroActual("/prestamos/recibidos");
            setTipoJson("prestamo");
            setTituloActual("Préstamos");
            setTagActivo(pos);
            
            // Si la categoría tiene nombre, se llama a un filtro por nombre de categoría
        }else if(tag !== ""){
            setFiltroActual("/libros_usuarios/?ordering=libro__titulo&categoria_nombre=" + tag);
            setTipoJson("categoria");
            setTituloActual(tag);
            setTagActivo(pos);
            
            // La otra opción es "todos", que trae todos los libros del usuario
        }else{
            setFiltroActual("/libros_usuarios/?ordering=libro__titulo");
            setTipoJson("categoria");
            setTituloActual("Todos los libros");
            setTagActivo(pos);
        }
    }
    
    const onBorrarCategoria = () => {
        onChangeTag("", 0);
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
                    <Etiquetas catsUsuario={catsUsuario} onChangeTag={onChangeTag}/>
                    <GetLibrosCategoria catsUsuario={catsUsuario}
                                        tipoJson={tipoJson}
                                        tituloCat={tituloActual}
                                        filtroBusqueda={filtroActual}
                                        isTodos={tagActivo < 5}
                                        onBorrarCategoria={onBorrarCategoria}
                    />
                </div>
            </div>
        </main>
        <Footer/>
    </>
}

export default Categorias;