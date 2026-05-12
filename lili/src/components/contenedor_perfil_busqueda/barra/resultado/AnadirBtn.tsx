import {useRef, useState} from "react";
import "./AnadirBtn.css";
import {useUsuarioLibro} from "../../../../hooks/useUsuarioLibro.tsx";
import PanelLibro from "../../../panel_libro/PanelLibro.tsx";

const AnadirBtn = (props: any) => {
    
    const [anadirIsOpen, setAnadirIsOpen] = useState(false);
    const btnAnadirRef = useRef<HTMLButtonElement>(null);
    
    // Traer valores del servidor
    const { data: usuarioLibro} = useUsuarioLibro(props.item.id);
    
    return <>
        <button className={props.clase} ref={btnAnadirRef} onClick={() => setAnadirIsOpen(true)}>
            { usuarioLibro ? 
                <>Modificar</> :
                <>Añadir
                    <i className="material-symbols-rounded">add</i>
                </>
            }
        </button>
        {anadirIsOpen &&
            <PanelLibro libroId={props.item.id} onClose={() => setAnadirIsOpen(false)}/>
        }
    </>
}

export default AnadirBtn;