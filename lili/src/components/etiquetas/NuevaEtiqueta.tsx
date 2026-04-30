import {useState} from "react";

const NuevaEtiqueta = (props: any) => {
    
    const [nombre, setNombre] = useState("");
    
    const crear = () => {
        if(nombre !== "") props.crear(nombre);
    }
    
    const cerrar = () => {
        props.cerrarEtiqueta();
    }
    
    return <div className="inputDiv" ref={props.inputRef}>
        <input type="text" 
               className="inputCategoria"
               onChange={(e) => setNombre(e.target.value)}
               value={nombre}
               onKeyDown={(e) => {
                   if(e.key === "Enter") {
                       crear();
                   }
               }}
        />
        <button onClick={cerrar} ref={props.cerrarRef}><i className="material-symbols-rounded">close</i></button>
        <button onClick={crear} ref={props.crearRef}><i className="material-symbols-rounded">check</i></button>
        {props.iconoSync()}
    </div>
}

export default NuevaEtiqueta;