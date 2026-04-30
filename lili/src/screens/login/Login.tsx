import {type ChangeEvent, type SyntheticEvent, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../../auth/AuthContext.tsx";
import './LoginRegistro.css'

const Login = () => {

    const { login } = useAuth();
    const navigate = useNavigate();
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    const location = useLocation();
    const successMessage = location.state?.message;
    
    const OnChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        setError("");
    }
    
    const OnChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError("");
    }
    
    const OnSubmitCustom = async (e: SyntheticEvent<HTMLFormElement>)  => {
        e.preventDefault();
        
        if(username === "" || password === ""){
            console.log("Hay algún campo vacío.");
            setError("Ninguno de los campos puede estar vacío");
            return;
        }
        
        try{
            await login( username, password );
            navigate("/");
        }catch{
            setError("Usuario o contraseña incorrectos");
        }
        
    }
    
    return <div className="login">
        <div className="logo_login">
            <Link to="/" className="logo_link"><img src="./logo_dark.svg" alt="logo"/></Link>
        </div>
        <form id="login" onSubmit={OnSubmitCustom}>
            {successMessage && <p>{successMessage}</p>}
            <div className="username">
                <input type="text" name="f_username" id="f_username" onChange={OnChangeUsername} value={username} placeholder="Usuario" required/>
            </div>

            <div className="pass">
                <input type="password" name="f_pass" id="f_pass" onChange={OnChangePassword} value={password} placeholder="****" required/>
            </div>
            <p className="error">{error}</p>
            <button className="boton_login" type="submit">Iniciar sesión</button>
        </form>
        <p className="p_registrate">¿No tienes cuenta?</p>
        <Link to="/register" className="link_registro">Regístrate</Link>
    </div>

}

export default Login;