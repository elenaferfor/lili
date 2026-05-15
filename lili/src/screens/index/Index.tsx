import "./Index.css"
import SectionSinGet from "../../components/section/SectionSinGet.tsx";
import {useUsuarioLibrosLista} from "../../hooks/useUsuarioLibro.tsx";
import {Layout} from "../Layout.tsx";

const Index = () => {

    const { data: libros, isLoading: librosIsLoading } = useUsuarioLibrosLista();
    
    const deseos = libros?.filter(l => l.categorias_detalle.some(c => c.nombre === "Lista de deseos"));
    
    return <Layout>
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
    </Layout>
}

export default Index;