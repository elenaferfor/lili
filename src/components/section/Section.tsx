import "./Section.css"
import Carrusel from "../carrusel/Carrusel.tsx";
import {useState} from "react";
import Libro from "../libro/Libro.tsx";

const Section = (props: { titulo: string; }) => {
    
    const [listaLibros, setListaLibros] = useState([<Libro/>, <Libro/>, <Libro/>, <Libro/>, <Libro/>, <Libro/>, <Libro/>]);
    
    // TODO: crear un axios que traiga los últimos libros añadidos
    
    
    
    return <section>
        <h1>{props.titulo}</h1>
        <Carrusel libros={listaLibros} librosVista={5} librosGrupo={4} espaciado={16}/>
    </section>
}

export default Section;