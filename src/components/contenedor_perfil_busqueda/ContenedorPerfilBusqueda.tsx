import IconosPerfil from "./iconos_perfil/IconosPerfil.tsx";
import Barra from "./barra/Barra.tsx";
import "./ContenedorPerfilBusqueda.css"

const ContenedorPerfilBusqueda = () => {

    return <div className="contenedor_perfil_busqueda">
        <IconosPerfil/>
        <Barra/>
    </div>
}

        export default ContenedorPerfilBusqueda;