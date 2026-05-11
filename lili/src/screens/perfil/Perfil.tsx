import Logo from "../../components/logo/Logo.tsx";
import Nav from "../../components/nav/Nav.tsx";
import HeaderFooter from "../../components/header_footer/HeaderFooter.tsx";
import ContenedorPerfilBusqueda from "../../components/contenedor_perfil_busqueda/ContenedorPerfilBusqueda.tsx";
import Footer from "../../components/footer/Footer.tsx";
import {Link, useNavigate} from "react-router-dom";
import SectionSinGet from "../../components/section/SectionSinGet.tsx";
import {useUsuarioLibrosLista} from "../../hooks/useUsuarioLibro.tsx";
import "./Perfil.css";
import {useAuth} from "../../auth/AuthContext.tsx";
import {useCategorias} from "../../hooks/useCategoria.tsx";
import {useAmistades} from "../../hooks/useAmistades.tsx";
import SectionAmigos from "../../components/section/SectionAmigos.tsx";

const Perfil = () => {
    
    const navigate = useNavigate();
    const { data: libros, isLoading: librosIsLoading } = useUsuarioLibrosLista();
    const { data: categorias, isLoading: categoriasIsLoading } = useCategorias();
    const { data: amistades, isLoading: amistadesIsLoading } = useAmistades();
    
    
    const leyendo = libros?.filter(l => l.estado === "leyendo");
    const favoritos = libros?.filter(l => l.favorito);
    
    const categoriasPublicas = categorias?.filter(c => c.publica);
    
    const user = useAuth();
    
    return <>
        <header id="header">
            <Logo/>
            <Nav/>
            <HeaderFooter/>
        </header>
        <main>
            <ContenedorPerfilBusqueda/>
            <div className="contenido">
                <div className="migas">Perfil</div>
                <button onClick={() => navigate(-1)} className="volver">Volver</button>
                <div className="secciones">
                    <section className="no_shadow_section">
                        <h1>@{user.user?.username}</h1>
                        <div className="perfilCabecera">
                            <div className="fotoPerfil">
                                <img src="/perfil/te.JPG" alt="Té"/>
                            </div>
                            <div className="perfilColecciones">
                                <p className="perfilColeccionesP">Colecciones públicas:</p>
                                <div className="perfilColeccionesTags">
                                    {
                                        categoriasIsLoading ?
                                            'Cargando...' : <>{categoriasPublicas?.map((c, i) => <Link to="#" className="tag" key={i}>{c.nombre}</Link>)}</>
                                    }
                                </div>
                            </div>
                        </div>
                    </section>
                    <SectionSinGet titulo={"Leyendo"} listaLibros={leyendo} isLoading={librosIsLoading}/>
                    <SectionSinGet titulo={"Últimos añadidos"} listaLibros={libros} isLoading={librosIsLoading}/>
                    <SectionSinGet titulo={"Favoritos"} listaLibros={favoritos} isLoading={librosIsLoading}/>
                    <SectionAmigos titulo={"Amistades"} amigos={amistades} isLoading={amistadesIsLoading}/>
                </div>
            </div>
        </main>
        <Footer/>
    </>
}

export default Perfil;