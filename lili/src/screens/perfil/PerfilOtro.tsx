import Logo from "../../components/logo/Logo.tsx";
import Nav from "../../components/nav/Nav.tsx";
import HeaderFooter from "../../components/header_footer/HeaderFooter.tsx";
import ContenedorPerfilBusqueda from "../../components/contenedor_perfil_busqueda/ContenedorPerfilBusqueda.tsx";
import Footer from "../../components/footer/Footer.tsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import SectionSinGet from "../../components/section/SectionSinGet.tsx";
import {useUsuarioLibrosOtroUsuario} from "../../hooks/useUsuarioLibro.tsx";
import "./Perfil.css";
import {useCategoriasOtroUsuario} from "../../hooks/useCategoria.tsx";
import {useAmistades} from "../../hooks/useAmistades.tsx";
import {useEffect, useState} from "react";
import type {Amistad} from "../../types.tsx";

const PerfilOtro = () => {
    
    const params = useParams();
    const navigate = useNavigate();

    const userId = Number(params.userId);
    const [username, setUsername] = useState("");
  
    const { data: categorias, isLoading: categoriasIsLoading } = useCategoriasOtroUsuario(userId);
    const { data: amistades } = useAmistades();
    const { data: libros, isLoading: librosIsLoading } = useUsuarioLibrosOtroUsuario(userId);
    
    const leyendo = libros?.filter(l => l.estado === "leyendo");
    const favoritos = libros?.filter(l => l.favorito);

    
    
    const categoriasUsuario = categorias?.filter(c => c.usuario === userId );

    useEffect(() => {
        const userAmistades = amistades?.filter((a: Amistad) => a.usuario_a_nombre.id === userId || a.usuario_b_nombre.id === userId);
        if(!userAmistades) return;

        if (userAmistades[0].usuario_a_nombre.id === userId) {
            setUsername(userAmistades[0].usuario_a_nombre.username);
        } else {
            setUsername(userAmistades[0].usuario_b_nombre.username);
        }
    }, [amistades]);
    
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
                        <h1>@{username}</h1>
                        <div className="perfilCabecera">
                            <div className="fotoPerfil">
                                <img src="/perfil/te.JPG" alt="Té"/>
                            </div>
                            <div className="perfilColecciones">
                                <p className="perfilColeccionesP">Colecciones públicas:</p>
                                <div className="perfilColeccionesTags">
                                    {
                                        categoriasIsLoading ?
                                            'Cargando...' : <>{categoriasUsuario?.map((c, i) => <Link to="#" className="tag" key={i}>{c.nombre}</Link>)}</>
                                    }
                                </div>
                            </div>
                        </div>
                    </section>
                    <SectionSinGet titulo={"Leyendo"} listaLibros={leyendo} isLoading={librosIsLoading} deOtro={true}/>
                    <SectionSinGet titulo={"Últimos añadidos"} listaLibros={libros} isLoading={librosIsLoading} deOtro={true}/>
                    <SectionSinGet titulo={"Favoritos"} listaLibros={favoritos} isLoading={librosIsLoading} deOtro={true}/>
                </div>
            </div>
        </main>
        <Footer/>
    </>
}

export default PerfilOtro;