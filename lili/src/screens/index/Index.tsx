import "./Index.css"
import Section from "../../components/section/Section.tsx";
import {useUsuarioLibrosLista} from "../../hooks/useUsuarioLibro.tsx";
import {Layout} from "../Layout.tsx";
import {usePrestamos} from "../../hooks/usePrestamos.tsx";

const Index = () => {

    const { data: libros, isLoading: librosIsLoading } = useUsuarioLibrosLista();
    const { data: prestamos } = usePrestamos();
    
    const deseos = libros?.filter(l => l.categorias_detalle.some(c => c.nombre === "Deseos"));
    const leyendo = libros?.filter(l => l.estado === "leyendo");
    
    return <Layout>
        <div className="contenido">
            <div className="migas">Biblioteca</div>
            <div className="secciones">
                { !librosIsLoading && libros!.length <= 0 ?
                    <section>
                        <p>¡Bienvenide a Lili! Busca algún libro y añádelo a tu biblioteca para empezar tu colección.</p>
                    </section> :
                    <>
                        <Section titulo={"Últimos añadidos"} listaLibros={libros?.slice(0, 15)} isLoading={librosIsLoading} prestamos={prestamos}/>
                        { !librosIsLoading && leyendo!.length > 0 &&
                            <Section titulo={"Leyendo"} listaLibros={leyendo?.slice(0, 15)} isLoading={librosIsLoading} prestamos={prestamos}/>
                        }
                        { !librosIsLoading && deseos!.length > 0 &&
                            <Section titulo={"Lista de deseos"} listaLibros={deseos?.slice(0, 15)} isLoading={librosIsLoading} prestamos={prestamos}/>
                        }
                    </>
                }
            </div>
        </div>
    </Layout>
}

export default Index;