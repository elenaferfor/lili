import {Link, useNavigate, useSearchParams} from "react-router-dom";
import "./Anadir.css";
import {useBusqueda} from "../../hooks/useBusqueda.tsx";
import ResultadoCompleto from "../../components/resultado_completo/ResultadoCompleto.tsx";
import FormularioAnadir from "../../components/formulario_anadir/FormularioAnadir.tsx";
import {Layout} from "../Layout.tsx";

const Anadir = () => {
        
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') ?? '';
    const { resultados } = useBusqueda(query);
    
    return <Layout>
        <div className="contenido">
            <div className="migas">Biblioteca · Añadir</div>
            <button onClick={() => navigate(-1)} className="volver">Volver</button>
            <div className="secciones">
                <section>
                    <div className="tituloAnadir">
                        <h1>Añadir</h1>
                        <a href="#formulario" onClick={(e) => {
                            e.preventDefault();
                            document.getElementById("formulario")?.scrollIntoView({behavior: "smooth"});
                        }}>Añadir manualmente</a>
                        { resultados.length === 0 ?
                            <h2>No hay resultados</h2> :
                            <h2>Mostrando resultados para <span>{query}...</span></h2>
                        }
                    </div>
                    { resultados.length !== 0 &&
                        <div className="resultadosBusqueda_anadir">
                            { resultados.map((r, i) => <ResultadoCompleto item={r} key={i}/>) }
                        </div>
                    }
                </section>

                <FormularioAnadir/>
                
            </div>
        </div>
    </Layout>
}

export default Anadir;