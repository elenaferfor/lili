import {useEffect, useRef, useState} from "react";
import "./EstadoPrestamo.css";

const EstadoPrestamo = () => {
    
    const [prestamoIsOpen, setPrestamoIsOpen] = useState(false);

    const prestamoPanelRef = useRef<HTMLDivElement>(null);
    const btnPrestamoRef = useRef<HTMLButtonElement>(null);

    const toggleEstado = () => {
        setPrestamoIsOpen(!prestamoIsOpen);
    }

    useEffect(() => {
        if(prestamoIsOpen){
            document.addEventListener("mousedown", handleClickFueraPrestamo);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickFueraPrestamo);
        }
    }, [prestamoIsOpen]);

    const handleClickFueraPrestamo = (e: any) => {
        if(prestamoPanelRef.current && !prestamoPanelRef.current.contains(e.target) && !btnPrestamoRef.current?.contains(e.target)) {
            toggleEstado();
        }
    }

    const handlePrestamo = () => {
        
    }


    return <div id="estadoPrestamo">
        <button className="estadoPrestar" onClick={toggleEstado} ref={btnPrestamoRef}>Prestar <i
            className="material-symbols-rounded notificaciones">partner_exchange</i></button>
        { prestamoIsOpen &&
            <div className="panelPrestamo" ref={prestamoPanelRef}>
                <div className="closeBtn" onClick={toggleEstado}><i className="material-symbols-rounded">close</i></div>
                las cosas de prestar
            </div>
        }
    </div>
    
}

export default EstadoPrestamo;