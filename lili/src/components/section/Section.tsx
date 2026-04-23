import "./Section.css"
import GetLibros from "../get_libros/GetLibros.tsx";

const Section = (props: { titulo: string; esLibroUsuario: boolean; filtroBusqueda: string; }) => {
    return <section>
        <h1>{props.titulo}</h1>
        <GetLibros esLibroUsuario={props.esLibroUsuario} filtroBusqueda={props.filtroBusqueda}/>
    </section>
}

export default Section;