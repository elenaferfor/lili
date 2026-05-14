import "./Barra.css"
import {Link, useNavigate} from "react-router-dom";
import Resultado from "./resultado/Resultado.tsx";
import "./Barra.css";
import {useEffect, useRef, useState} from "react";
import {useBusqueda} from "../../../hooks/useBusqueda.tsx";

const Barra = () => {
    
    const [searchValue, setSearchValue] = useState("");
    const { resultados, cargando, pendiente } = useBusqueda(searchValue);
    const barraRef = useRef<HTMLDivElement>(null);
    
    const navigate = useNavigate();
    
    const busquedaCompleta = (e: React.SubmitEvent) => {
        e.preventDefault();
        navigate(`/resultados?q=${encodeURIComponent(searchValue)}`);
        setSearchValue('');
    }

    useEffect(() => {
        const handleClickFuera = (e: MouseEvent) => {
            if (barraRef.current && !barraRef.current.contains(e.target as Node)) {
                setSearchValue('');
            }
        };
        document.addEventListener('mousedown', handleClickFuera);
        return () => document.removeEventListener('mousedown', handleClickFuera);
    }, []);
    
    return <div className="barra" ref={barraRef}>
        <form id="search" name="search" method="post" onSubmit={busquedaCompleta}>
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
                        resultados.slice(0, 5).map((item, index) => (
                            <Resultado key={index} item={item}/>
                        ))
                    }
                </div>
                { resultados[0]?.tipo === 'usuario' || resultados.length > 0 &&
                    <div className="verResultados">
                        <Link to={`/resultados?q=${encodeURIComponent(searchValue)}`}>Ver todos los resultados o añadir manualmente</Link>
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