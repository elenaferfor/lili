import Carrusel from "../carrusel/Carrusel.tsx";
import {useEffect, useState} from "react";
import api from "../../api/Axios.tsx";
import Libro from "../libro/Libro.tsx";

const GetLibros = (props: {esLibroUsuario: boolean; filtroBusqueda: string;}) => {

    const [listaLibros, setListaLibros] = useState([]);
    
    useEffect(() => {
        api.get(props.filtroBusqueda).then(response => {
            let json = response.data.results;
            json = json.map((jsonLibro: any) => {
                if(props.esLibroUsuario){
                    return <Libro
                        titulo={jsonLibro.libro_detalle.titulo}
                        portada={jsonLibro.libro_detalle.portada}
                        id={jsonLibro.libro_detalle.id}
                    />
                }else{
                    return <Libro
                        titulo={jsonLibro.titulo}
                        portada={jsonLibro.portada}
                        id={jsonLibro.id}
                    />
                }
                
            })
            setListaLibros(json);
        });
    }, []);
    
    return <Carrusel libros={listaLibros} librosVista={5} librosGrupo={4} espaciado={16} />
}

export default GetLibros;