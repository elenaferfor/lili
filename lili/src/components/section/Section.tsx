import "./Section.css"
import Carrusel from "../carrusel/Carrusel.tsx";
import Libro from "../libro/Libro.tsx";
import LibroDeOtro from "../libro/LibroDeOtro.tsx";

const Section = (props: any) => {
    
    const libros = props.listaLibros?.map((l: any, index: number) => {
        if (props.deOtro) {
            return <LibroDeOtro
                key={index}
                libro={l}
            />
        } else {
            return <Libro
                key={index}
                libro={l}
                prestamos={props.prestamos}
                catsUsuario={props.catsUsuario}
            />
        }

    });

    return <section>
        <h1>{props.titulo}</h1>
        {props.isLoading
            ? <p>Cargando libros...</p>
            : <Carrusel libros={libros}/>
        }
    </section>
}

export default Section;