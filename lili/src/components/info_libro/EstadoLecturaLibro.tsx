import {useEffect, useRef, useState} from "react";

const EstadoLecturaLibro = () => {

    const [estadoClase, setEstadoClase] = useState("");
    const [estadoTexto, setEstadoTexto] = useState("Sin empezar");
    const [estadoIcono, setEstadoIcono] = useState("");
    const [estadoIsOpen, setEstadoIsOpen] = useState(false);

    const estadoRef = useRef<HTMLDivElement>(null);
    const btnEstadoRef = useRef<HTMLButtonElement>(null);

    const toggleEstado = () => {
        setEstadoIsOpen(!estadoIsOpen);
    }

    useEffect(() => {
        if(estadoIsOpen){
            document.addEventListener("mousedown", handleClickFueraEstado);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickFueraEstado);
        }
    }, [estadoIsOpen]);

    const handleClickFueraEstado = (e: any) => {
        if(estadoRef.current && !estadoRef.current.contains(e.target) && !btnEstadoRef.current?.contains(e.target)) {
            toggleEstado();
        }
    }

    const handleEstado = (estado: string) => {
        switch (estado){
            case "leido":
                setEstadoClase("estadoVerde");
                setEstadoIcono("check");
                setEstadoTexto("Leído");
                toggleEstado();
                break;
            case "leyendo":
                setEstadoClase("estadoNaranja");
                setEstadoIcono("menu_book");
                setEstadoTexto("Leyendo");
                toggleEstado();
                break;
            case "abandonado":
                setEstadoClase("estadoRojo");
                setEstadoIcono("close");
                setEstadoTexto("Abandonado");
                toggleEstado();
                break;
            case "s_e":
                setEstadoClase("");
                setEstadoIcono("");
                setEstadoTexto("Sin empezar");
                toggleEstado();
                break;
            default:
                setEstadoClase("");
                setEstadoIcono("");
                setEstadoTexto("Sin empezar");
                toggleEstado();
        }
    }


    return <div id="estadoLectura">
        <button className={estadoClase} onClick={toggleEstado} ref={btnEstadoRef}>{estadoTexto} <i className="material-symbols-rounded">{estadoIcono}</i>
        </button>
        { estadoIsOpen &&
            <div className="estadoLecturaOpciones" ref={estadoRef}>
                <button className="" onClick={() => handleEstado("leido")}>
                    Leído <i className="material-symbols-rounded">check</i>
                </button>
                <button className="" onClick={() => handleEstado("leyendo")}>
                    Leyendo <i className="material-symbols-rounded">menu_book</i>
                </button>
                <button className="" onClick={() => handleEstado("abandonado")}>
                    Abandonado <i className="material-symbols-rounded">close</i>
                </button>
                <button className="" onClick={() => handleEstado("s_e")}>Sin empezar</button>
            </div>
        }
    </div>
    
}

export default EstadoLecturaLibro;