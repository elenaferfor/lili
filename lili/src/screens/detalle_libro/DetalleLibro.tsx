import {useNavigate, useParams} from "react-router-dom";
import Nav from "../../components/nav/Nav.tsx";
import HeaderFooter from "../../components/header_footer/HeaderFooter.tsx";
import ContenedorPerfilBusqueda from "../../components/contenedor_perfil_busqueda/ContenedorPerfilBusqueda.tsx";
import Footer from "../../components/footer/Footer.tsx";
import InfoLibro from "../../components/info_libro/InfoLibro.tsx";
import {useMemo} from "react";
import Logo from "../../components/logo/Logo.tsx";
import SectionSinGet from "../../components/section/SectionSinGet.tsx";
import {useLibroID, useLibros} from "../../hooks/useLibro.tsx";
import {useUsuarioLibrosLista} from "../../hooks/useUsuarioLibro.tsx";

const Index = () => {
    
    let navigate = useNavigate();
    const params = useParams();

    const { data: libroActual, isLoading: libroActualIsLoading } = useLibroID(Number(params.libroId));
    const { data: libros, isLoading: librosIsLoading } = useLibros();
    const { data: usuarioLibros } = useUsuarioLibrosLista();
    
    const librosPorAutor = useMemo(() => {
        if (!libros || !libroActual?.autores_detalle) return {};
        return libroActual.autores_detalle.reduce((acc, autor) => {
            acc[autor.id] = libros.filter(l => l.autores_detalle?.some(a => a.id === autor.id))
                .map(l => {
                    const usuarioLibro = usuarioLibros?.find(ul => ul.libro_detalle.id === l.id );
                    return usuarioLibro ?? {
                        libro_detalle: l,
                        favorito: false,
                        estado: null,
                    };
                });
            return acc;
        }, {} as Record<number, any[]>);
    }, [libros, libroActual, usuarioLibros]);
    
    return <>
        <header id="header">
            <Logo/>
            <Nav/>
            <HeaderFooter/>
        </header>
        <main>
            <ContenedorPerfilBusqueda/>
            <div className="contenido">
                <div className="migas">Biblioteca · {libroActual?.titulo}</div>
                <button onClick={() => navigate(-1)} className="volver">Volver</button>
                <div className="secciones">
                    {libroActualIsLoading ? <p>Cargando...</p> :
                        !libroActual ?
                                <section><p>No se encuentra el libro.</p></section> :
                                <>
                                    <InfoLibro data={libroActual}/>
                                    {libroActual.autores_detalle?.map((autor, index) => (
                                        <SectionSinGet key={index} titulo={`Otros libros de ${autor.nombre}`} listaLibros={librosPorAutor[autor.id]?.slice(0, 14)} isLoading={librosIsLoading}/>   
                                    ))}
                                </>
                    }
                </div>
            </div>
        </main>
        <Footer/>
    </>
}

export default Index;