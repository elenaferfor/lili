import Logo from "../../components/logo/Logo.tsx";
import Nav from "../../components/nav/Nav.tsx";
import HeaderFooter from "../../components/header_footer/HeaderFooter.tsx";
import ContenedorPerfilBusqueda from "../../components/contenedor_perfil_busqueda/ContenedorPerfilBusqueda.tsx";
import Footer from "../../components/footer/Footer.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useCategoriasOtroUsuario} from "../../hooks/useCategoria.tsx";
import {useUsuarioLibrosOtroUsuario} from "../../hooks/useUsuarioLibro.tsx";
import type {Categoria, UsuarioLibro} from "../../types.tsx";
import {useAuth} from "../../auth/AuthContext.tsx";
import SectionCategoriasOtro from "../../components/section/SectionCategoriasOtro.tsx";
import {useAmistades} from "../../hooks/useAmistades.tsx";

const CategoriasOtro = () => {
    
    const params = useParams();
    const { user } = useAuth();
    const amigoId = Number(params.userId);
    const catId = Number(params.catId);
    
    const navigate = useNavigate();
    const [tituloActual, setTituloActual] = useState("Categoría");
 

    // Traer categorías del amigo y libros del amigo
    const { data: categorias, isLoading: categoriasIsLoading } = useCategoriasOtroUsuario(amigoId);
    const { data: libros, isLoading: librosIsLoading } = useUsuarioLibrosOtroUsuario(amigoId);
    const { data: amistades } = useAmistades();
    
    const [listaLibros, setListaLibros] = useState<UsuarioLibro[] | undefined>([]);
    const [categoriaActual, setCategoriaActual] = useState<Categoria | undefined>(undefined);
    const [nombreAmigo, setNombreAmigo] = useState<string | undefined>(undefined);
    
    useEffect(() => {
        if(!categorias) return;
        setCategoriaActual(categorias.find(c => c.id === catId) ?? undefined);
    }, [libros, categorias]);

    useEffect(() => {
        if(!libros) return;
        setListaLibros(libros.filter(l => l.categorias_detalle.some(c => c.id === catId)));
    }, [categorias]);
    
    useEffect(() => {
        if(!amistades) return;
        const amistad = amistades.find(a => (a.usuario_a_nombre.id === user?.id || a.usuario_b_nombre.id === user?.id) && (a.usuario_a_nombre.id === amigoId || a.usuario_b_nombre.id === amigoId))
        if(!amistad) return;
        if (amistad.usuario_a_nombre.id === amigoId) {
            setNombreAmigo(amistad.usuario_a_nombre.username);
        } else {
            setNombreAmigo(amistad.usuario_b_nombre.username);
        }
    }, [amistades]);
    
    useEffect(() => {
        setTituloActual(`${categoriaActual?.nombre} de ${nombreAmigo}`)
    }, [categoriaActual, nombreAmigo]);
    
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
                    { categoriasIsLoading || librosIsLoading ?
                        <>Cargando...</> :
                        <SectionCategoriasOtro listaLibros={listaLibros}
                                           tituloCat={tituloActual}
                        />
                    }
                </div>
            </div>
        </main>
        <Footer/>
    </>
}

export default CategoriasOtro;