import "./Section.css"
import Carrusel from "../carrusel/Carrusel.tsx";
import {useState} from "react";
import Libro from "../libro/Libro.tsx";

const Section = (props: { titulo: string; }) => {
    
    const [listaLibros, setListaLibros] = useState([
        <Libro portada={"covers/carrie.webp"}/>, 
        <Libro portada={"covers/bunny.webp"}/>, 
        <Libro portada={"covers/conjuros.webp"}/>, 
        <Libro portada={"covers/eternidad.webp"}/>, 
        <Libro portada={"covers/gideon.webp"}/>, 
        <Libro portada={"covers/hambre.jpg"}/>, 
        <Libro portada={"covers/dracula.webp"}/>]);
    
    // TODO: crear un axios que traiga los últimos libros añadidos
    
    
    
    return <section>
        <h1>{props.titulo}</h1>
        <Carrusel libros={listaLibros} librosVista={5} librosGrupo={4} espaciado={16}/>
    </section>
}

export default Section;