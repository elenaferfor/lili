import {useNavigate} from "react-router-dom";
import {Layout} from "../Layout.tsx";

const NotFound = () => {
    
    const navigate = useNavigate();
    
    return <Layout>
        <div className="contenido">
            <div className="migas">Página no encontrada</div>
            <button onClick={() => navigate(-1)} className="volver">Volver</button>
            <div className="secciones">
                <h1>Ups...</h1>
                <p>Página no encontrada.</p>
            </div>
        </div>
    </Layout>
}

export default NotFound;