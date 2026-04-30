import EstadoCategoriasLibro from "../../../info_libro/EstadoCategoriasLibro.tsx";

const Resultado = () => {
    
    return <div className="resultado">
        <div className="detalleLibroInfo">
            <div className="detalleLibroPortada">
                <img src="/covers/7maridos.webp" alt=""/>
            </div>
            <div className="detalleLibroTexto">
                <h1>Título</h1>
                <p className="autor">Autor</p>
                <p><span>ISBN/UID:</span> 1234567890123</p>
                <p><span>Editorial:</span> Editorial</p>
                <div className="detalleLibroEstados">
                    <button className="estadoAnadir">Añadir
                        <i className="material-symbols-rounded">add</i></button>
                    <EstadoCategoriasLibro/>
                </div>
            </div>
        </div>
    </div>

}

export default Resultado;