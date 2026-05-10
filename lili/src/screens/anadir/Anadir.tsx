import Logo from "../../components/logo/Logo.tsx";
import Nav from "../../components/nav/Nav.tsx";
import HeaderFooter from "../../components/header_footer/HeaderFooter.tsx";
import ContenedorPerfilBusqueda from "../../components/contenedor_perfil_busqueda/ContenedorPerfilBusqueda.tsx";
import Footer from "../../components/footer/Footer.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import "./Anadir.css";
import {useBusqueda} from "../../hooks/useBusqueda.tsx";
import ResultadoCompleto from "../../components/resultado_completo/ResultadoCompleto.tsx";
import FormularioAnadir from "../../components/formulario_anadir/FormularioAnadir.tsx";

const Anadir = () => {
        
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') ?? '';
    const { resultados } = useBusqueda(query);
    
    return <>
        <header id="header">
            <Logo/>
            <Nav/>
            <HeaderFooter/>
        </header>
        <main>
            <ContenedorPerfilBusqueda/>
            <div className="contenido">
                <div className="migas">Biblioteca · Añadir</div>
                <button onClick={() => navigate(-1)} className="volver">Volver</button>
                <div className="secciones">
                    <section>
                        <div className="tituloAnadir">
                            <h1>Añadir</h1>
                            <a href="#formulario">Añadir manualmente</a>
                        </div>
                        { resultados.length === 0 ?
                            <div className="resultadosBusqueda_anadir_vacio">
                                <h2>No hay resultados</h2>
                            </div> : 
                            
                            <div className="resultadosBusqueda_anadir">
                                <h2>Mostrando resultados para <span>{query}...</span></h2>

                                { resultados.map((r, i) => <ResultadoCompleto item={r} index={i}/>) }
                                
                            </div>
                        }
                    </section>

                    <FormularioAnadir/>
                    
                </div>
            </div>
        </main>
        <Footer/>
    </>
}

export default Anadir;