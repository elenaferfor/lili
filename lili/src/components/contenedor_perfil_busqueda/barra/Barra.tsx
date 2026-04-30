import "./Barra.css"
import {Link} from "react-router-dom";
import Resultado from "./resultado/Resultado.tsx";
import "./Barra.css";
import {useEffect, useState} from "react";

const Barra = () => {

    const [isSearching, setIsSearching] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    
    const instaSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    }
    
    useEffect(() => {
        if(searchValue !== ""){
            setIsSearching(true);
        }else{
            setIsSearching(false);
        }
    }, [searchValue]);
    
    
    
    return <div className="barra">
        <form id="search" name="search" action="#" method="post">
            <input type="search" className="f_barra" name="f_barra"
                   placeholder="Buscar libro, autor, ISBN, @usuario..."
                   value={searchValue}
                   onChange={instaSearch}
            />
            <button type="submit" className="lupa">
                <i className="material-symbols-rounded notificaciones">search</i>
            </button>
        </form>
        { isSearching &&
            <div className="resultadosBusqueda">
                <div className="resultadosLista">
                    <Resultado/>
                    <Resultado/>
                    <Resultado/>
                    <Resultado/>
                    <Resultado/>
                </div>
                <div className="verResultados">
                    <Link to="#">Ver todos los resultados o añadir manualmente</Link>
                </div>
            </div>
        }
    </div>
}

export default Barra;