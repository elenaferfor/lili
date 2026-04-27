import './SectionCategorias.css';

const SectionCategorias = (props: any ) => {

    return <section>
        <div className="h1_herramientas">
            <h1>{props.tituloCat} ({props.numCat})</h1>
            <i className="material-symbols-rounded icon_fill dark_blue">lock</i>
            <i className="material-symbols-rounded icon_fill dark_blue">settings</i>
        </div>
        <div className="filtro_abc">
            <div className="filtro_abc_btn">A</div>
            <div className="filtro_abc_btn">B</div>
            <div className="filtro_abc_btn">C</div>
            <div className="filtro_abc_btn">D</div>
            <div className="filtro_abc_btn">E</div>
            <div className="filtro_abc_btn">F</div>
            <div className="filtro_abc_btn">G</div>
            <div className="filtro_abc_btn">H</div>
            <div className="filtro_abc_btn">I</div>
            <div className="filtro_abc_btn">J</div>
            <div className="filtro_abc_btn">K</div>
            <div className="filtro_abc_btn">L</div>
            <div className="filtro_abc_btn">M</div>
            <div className="filtro_abc_btn">N</div>
            <div className="filtro_abc_btn">O</div>
            <div className="filtro_abc_btn">P</div>
            <div className="filtro_abc_btn">Q</div>
            <div className="filtro_abc_btn">R</div>
            <div className="filtro_abc_btn">S</div>
            <div className="filtro_abc_btn">T</div>
            <div className="filtro_abc_btn">U</div>
            <div className="filtro_abc_btn">V</div>
            <div className="filtro_abc_btn">W</div>
            <div className="filtro_abc_btn">X</div>
            <div className="filtro_abc_btn">Y</div>
            <div className="filtro_abc_btn">Z</div>
            <div className="filtro_abc_btn">#</div>
            <div className="filtro_abc_btn activo">TODOS</div>
        </div>

        <div className="filtro_abc_movil">
            Filtrar:
            <select id="abc" name="abc">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
                <option value="H">H</option>
                <option value="I">I</option>
                <option value="J">J</option>
                <option value="K">K</option>
                <option value="L">L</option>
                <option value="M">M</option>
                <option value="N">N</option>
                <option value="O">O</option>
                <option value="P">P</option>
                <option value="Q">Q</option>
                <option value="R">R</option>
                <option value="S">S</option>
                <option value="T">T</option>
                <option value="U">U</option>
                <option value="V">V</option>
                <option value="W">W</option>
                <option value="X">X</option>
                <option value="Y">Y</option>
                <option value="Z">Z</option>
                <option value="#">#</option>
                <option value="TODOS">TODOS</option>
            </select>
        </div>

        <div className="carruselLibrosCategorias">
            {props.listaLibros}
        </div>
    </section>
}

export default SectionCategorias;