import {useState} from "react";
import type {UsuarioLibro} from "../../types.tsx";
import Libro from "../libro/Libro.tsx";


const Serie = (props: any) => {

    const [serieIsOpen, setSerieIsOpen] = useState<boolean>(false);
    
    const primerLibro: UsuarioLibro = props.librosDeEstaSerie[0];
    const nombreSerie: string = primerLibro?.serie_detalle?.nombre ?? "Serie";
    
    return <>
        <div className="libro serie">
            <div className="portada">
                <img src={primerLibro?.libro_detalle.portada} alt={primerLibro?.libro_detalle.titulo} />
                <div className="hoverSerie">
                    {/* Sin implementar   
                        <div className="iconosHoverSerie">
                            <i className="material-symbols-rounded icon_fill white">settings</i>
                        </div>
                    */}
                    <button id="mostrarSerie" onClick={() => setSerieIsOpen(o => !o)}>{serieIsOpen ? "Ocultar" : "Mostrar"}</button>
                </div>
            </div>
            <p>{nombreSerie} ({props.librosDeEstaSerie.length})</p>
        </div>
        { serieIsOpen &&
            props.librosDeEstaSerie.map((l: any, index: number) =>
                <Libro
                    classSerie={"serie"}
                    libro={l}
                    key={index}
                    prestamos={props.prestamos}
                    catsUsuario={props.catsUsuario}
                />
            )
        }
    </>
}
export default Serie;