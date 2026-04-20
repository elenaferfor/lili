import {Link, useNavigate} from "react-router-dom";
import "./HeaderFooter.css"
import {useAuth} from "../../auth/AuthContext.tsx";

const HeaderFooter = () => {

    const { logout } = useAuth();
    const navigate = useNavigate();
    
    const OnBotonLogout = async () => {

        try{
            await logout;
            navigate("/login");
        }catch{
            console.log("Error en el logout");
        }
        
    }
    
    return <div className="header_footer">
        <div className="boton_sesion">
            <button onClick={OnBotonLogout}>Cerrar sesión</button>
        </div>
        <div className="enlaces_footer">
            <div className="contenedor_enlace_footer">
                <Link to="#">Contacto</Link>
            </div>
            <div className="contenedor_enlace_footer">
                <Link to="#">Legal</Link>
            </div>
        </div>
    </div>
}

export default HeaderFooter;