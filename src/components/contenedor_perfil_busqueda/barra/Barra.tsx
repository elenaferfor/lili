import "./Barra.css"

const Barra = () => {

    return <div className="barra">
        <form id="search" name="search" action="#" method="post">
            <input type="search" className="f_barra" name="f_barra"
                   placeholder="Buscar libro, autor, ISBN, @usuario..."/>
            <button type="submit" className="lupa">
                <i className="material-symbols-rounded notificaciones">search</i>
            </button>
        </form>
    </div>
}

export default Barra;