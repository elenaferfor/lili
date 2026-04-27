import './Etiquetas.css';
import {useEffect, useState} from "react";
import api from "../../api/Axios.tsx";
import BotonEtiqueta from "./BotonEtiqueta.tsx";

const Etiquetas = (props: any) => {
    
    const [catsUsuario, setCatsUsuario] = useState<any[]>([]);
    const categoriasPpales = ["Leyendo", "Lista de deseos", "Prestados", "Préstamos"];
    const [tagActivo, setTagActivo] = useState(0);
    
    
    useEffect(() => {
        api.get("/categorias?ordering=nombre").then(response => {
            setCatsUsuario(response.data.results);
        });
    }, []);
    
    const onClickTag = (pos: number, name: string) =>{
        setTagActivo(pos);
        props.onChangeTag(name);
        console.log(pos + name);
    }
    
    const crearTag = () => {
        /* TODO: Añadir funcionalidad de crear categoría */
        console.log("Por implementar panel para introducir nombre");
    }
    
    return <div className="tags">
        <div className="tags_ppales">

            { /* TODO: Al seleccionar una categoría se queda marcada y hace llamada filtrada */ }
            
            <BotonEtiqueta nombreBoton={`Todos ${catsUsuario.length}`} index={0} className={tagActivo === 0 ? "activo" : ""} onClick={onClickTag}/>
            <BotonEtiqueta nombreBoton="Leyendo" index={1} className={tagActivo === 1 ? "activo" : ""} onClick={onClickTag}/>
            <BotonEtiqueta nombreBoton="Deseos" index={2} className={tagActivo === 2 ? "activo" : ""} onClick={onClickTag}/>
            <BotonEtiqueta nombreBoton="Prestados" index={3} className={tagActivo === 3 ? "activo" : ""} onClick={onClickTag}/>
            <BotonEtiqueta nombreBoton="Préstamos" index={4} className={tagActivo === 4 ? "activo" : ""} onClick={onClickTag}/>
            
        </div>
        <div className="tags_usuario">
            {
                catsUsuario.filter( cat => !categoriasPpales.includes(cat.nombre) )
                    .map( (cat, index) => 
                        <BotonEtiqueta
                            key={index}
                            nombreBoton={cat.nombre}
                            index={index + 5}
                            className={tagActivo === index + 5 ? "activo" : ""}
                            onClick={onClickTag}
                        />)
            }
            
            <button className="crear"><i className="material-symbols-rounded" onClick={crearTag}>add</i> Crear categoría</button>
        </div>
    </div>
}

export default Etiquetas;