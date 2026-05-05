import "./Barra.css"
import {Link} from "react-router-dom";
import Resultado from "./resultado/Resultado.tsx";
import "./Barra.css";
import {useState} from "react";
import {useBusqueda} from "../../../hooks/useBusqueda.tsx";

const Barra = () => {
    
    const [searchValue, setSearchValue] = useState("");
    const { resultados, cargando, pendiente } = useBusqueda(searchValue);
    
    return <div className="barra">
        <form id="search" name="search" action="#" method="post">
            <input type="search" className="f_barra" name="f_barra"
                   placeholder="Buscar libro, autor, ISBN, @usuario..."
                   value={searchValue}
                   onChange={e => setSearchValue(e.target.value)}
            />
            <button type="submit" className="lupa">
                <i className="material-symbols-rounded notificaciones">search</i>
            </button>
        </form>
        { (cargando || resultados.length > 0) &&
            <div className="resultadosBusqueda">
                <div className="resultadosLista">
                    {
                        resultados.map((item, index) => (
                            <Resultado key={index} item={item}/>
                        ))
                    }
                </div>
                { resultados[0]?.tipo === 'usuario' || resultados.length > 0 &&
                    <div className="verResultados">
                        <Link to="#">Ver todos los resultados o añadir manualmente</Link>
                    </div>
                }
            </div>
        }
        { !cargando && !pendiente && resultados.length === 0 && searchValue &&
            <div className="resultadosBusqueda">
                <div className="verResultados">
                    <p>{`No se han encontrado resultados para ${searchValue}`}</p>
                </div>
            </div>
        }
    </div>
}

export default Barra;