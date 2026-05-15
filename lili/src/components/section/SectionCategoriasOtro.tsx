import './SectionCategorias.css';
import {useState} from "react";
import LibroDeOtro from "../libro/LibroDeOtro.tsx";

const SectionCategoriasOtro = (props: any ) => {
    
    const [filtroLetra, setFiltroLetra] = useState<string>("TODOS");
    const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    // Filtrar por letras
    const filtrarLetras = (letra: string) => {
        setFiltroLetra(letra);
    }

    const librosFiltrados = filtroLetra === "TODOS" ?
        props.listaLibros :
        props.listaLibros.filter((l: any) => {
            const primeraLetra = l.libro_detalle.titulo[0].toUpperCase();
            if (filtroLetra === "#") {
                return primeraLetra < "A" || primeraLetra > "Z";
            }
            return primeraLetra === filtroLetra;
        });
    
    return <section>
        <div className="h1_herramientas">
            <h1>{props.tituloCat} ({librosFiltrados.length})</h1>
        </div>
        <div className="filtro_abc">
            { ABC.split("").map((l) => <div key={l} className={`filtro_abc_btn ${filtroLetra === l ? "activo" : ""}`} onClick={(e) => filtrarLetras(e.currentTarget.textContent)}>{l}</div>) }
            <div className={`filtro_abc_btn ${filtroLetra === "#" ? "activo" : ""}`} onClick={(e) => filtrarLetras(e.currentTarget.textContent)}>#</div>
            <div className={`filtro_abc_btn ${filtroLetra === "TODOS" ? "activo" : ""}`} onClick={(e) => filtrarLetras(e.currentTarget.textContent)}>TODOS</div>
        </div>

        <div className="filtro_abc_movil">
            Filtrar:
            <select id="abc" name="abc" value={filtroLetra} onChange={(e) => filtrarLetras(e.target.value)}>
                <option value={"TODOS"}>TODOS</option>
                { ABC.split("").map((l) => <option key={l} value={l}>{l}</option>) }
                <option value={"#"}>#</option>
            </select>
        </div>

        <div className="carruselLibrosCategorias">
            {librosFiltrados.map((item: any) =>
                <LibroDeOtro
                        key={`libro-${item.libro_detalle.id}`}
                        libro={item}
                        prestamos={props.prestamos}
                        catsUsuario={props.catsUsuario}
                />
            )}
        </div>
    </section>
}

export default SectionCategoriasOtro;