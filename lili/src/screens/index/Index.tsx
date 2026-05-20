import "./Index.css"
import SectionSinGet from "../../components/section/SectionSinGet.tsx";
import {useUsuarioLibrosLista} from "../../hooks/useUsuarioLibro.tsx";
import {Layout} from "../Layout.tsx";
import {usePrestamos} from "../../hooks/usePrestamos.tsx";

const Index = () => {

    const { data: libros, isLoading: librosIsLoading } = useUsuarioLibrosLista();
    const { data: prestamos } = usePrestamos();
    
    const deseos = libros?.filter(l => l.categorias_detalle.some(c => c.nombre === "Deseos"));
    
    return <Layout>
        <div className="contenido">
            <div className="migas">Biblioteca</div>
            <div className="secciones">
                <SectionSinGet titulo={"Últimos añadidos"} listaLibros={libros?.slice(0, 15)} isLoading={librosIsLoading} prestamos={prestamos}/>
                <SectionSinGet titulo={"Lista de deseos"} listaLibros={deseos?.slice(0, 15)} isLoading={librosIsLoading} prestamos={prestamos}/>
                {/*
                Añadir cuando funcione con Open Library
                <Section titulo={"Recomendados para ti"} filtroBusqueda={""}/>
                */}
            </div>
        </div>
    </Layout>
}

export default Index;