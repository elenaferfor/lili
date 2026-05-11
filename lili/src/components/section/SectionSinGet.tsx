import "./Section.css"
import Carrusel from "../carrusel/Carrusel.tsx";
import Libro from "../libro/Libro.tsx";

const SectionSinGet = (props: any) => {
    
    const libros = props.listaLibros?.map((jsonLibro: any) => (
        <Libro
            titulo={jsonLibro.libro_detalle.titulo}
            portada={jsonLibro.libro_detalle.portada}
            id={jsonLibro.libro_detalle.id}
        />
    ));

    return <section>
        <h1>{props.titulo}</h1>
        {props.isLoading
            ? <p>Cargando libros...</p>
            : <Carrusel libros={libros} librosVista={5} librosGrupo={4} espaciado={16}/>
        }
    </section>
}

export default SectionSinGet;