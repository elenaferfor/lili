import {useEffect, useState} from "react";
import api from "../../api/Axios.tsx";
import Libro from "../libro/Libro.tsx";
import SectionCategorias from "../section/SectionCategorias.tsx";

const GetLibrosCategoria = (props:any) => {

    const [listaLibros, setListaLibros] = useState([]);
    
    useEffect(() => {
        api.get(props.filtroBusqueda).then(response => {
            let json = response.data;
            if(props.tipoJson === "estado" || props.tipoJson === "prestamo"){
                json = json.map((jsonLibro: any, index: number) => {
                    return <Libro
                        key={index}
                        titulo={jsonLibro.libro_detalle.titulo}
                        portada={jsonLibro.libro_detalle.portada}
                        id={jsonLibro.libro_detalle.id}
                    />
                })
                setListaLibros(json);
            }else if(props.tipoJson === "categoria"){
                let json = response.data.results;
                json = json.map((jsonLibro: any, index: number) => {
                    return <Libro
                        key={index}
                        titulo={jsonLibro.libro_detalle.titulo}
                        portada={jsonLibro.libro_detalle.portada}
                        id={jsonLibro.libro_detalle.id}
                    />
                })
                setListaLibros(json);
            }
            
        });
    }, [props.filtroBusqueda]);
    
    return <SectionCategorias catsUsuario={props.catsUsuario}
                              listaLibros={listaLibros}
                              tituloCat={props.tituloCat}
                              numCat={listaLibros.length}
                              isTodos={props.isTodos}
                              onBorrarCategoria={props.onBorrarCategoria}
    />
    
}

export default GetLibrosCategoria;