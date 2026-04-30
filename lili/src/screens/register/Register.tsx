import {type SyntheticEvent, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import '../login/LoginRegistro.css'
import api from "../../api/Axios.tsx";

interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}

const Register = () => {
    
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    
    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        
        if(!formData.username.trim())
            newErrors.username = 'El campo usuario es obligatorio';
        
        if(!formData.email.trim())
            newErrors.email = 'El campo email es obligatorio';
        else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = 'El email no es válido';
        
        if(!formData.password)
            newErrors.password = 'El campo contraseña es obligatorio';
        else{
            const validationErrors: string[] = [];
            
            if (formData.password.length < 8)
                validationErrors.push('La contraseña debe tener al menos 8 caracteres');
            if(/^\d+$/.test(formData.password))
                validationErrors.push('No puede ser sólo números');
            if(validationErrors.length > 0)
                newErrors.password = validationErrors.join('. ');
        }
        
        if(!formData.confirmPassword)
            newErrors.confirmPassword = 'Confirma tu contraseña';
        else if(formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    
    const OnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    const OnSubmitCustom = async (e: SyntheticEvent<HTMLFormElement>)  => {
        e.preventDefault();
        
        if(!validate()) return;
        
        setLoading(true);
        try{
            await api.post('/auth/register/', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
            navigate('/login', {
                state: { message: 'Cuenta creada correctamente. Ya puedes iniciar sesión.'}
            });
        } catch(error: any) {
            const data = error.response?.data;
            const detail = error.response?.data?.detail;
            if(detail?.includes('usuario'))
                setErrors({ username: detail });
            else if(detail?.includes('email'))
                setErrors({ email: detail });
            else if(data?.password)
                setErrors({ password: Array.isArray(data.password) ? data.password.join('. ') : data.password });
            else
                setErrors({ general: detail || 'Error al crear la cuenta de usuario' });
        } finally {
            setLoading(false);
        }
    }
    
    return <div className="register">
        <div className="logo_login">
            <Link to="/" className="logo_link"><img src="./logo_dark.svg" alt="logo"/></Link>
        </div>
        <form id="login" onSubmit={OnSubmitCustom}>
            <div className="username">
                <input type="text" name="username" id="username" onChange={OnChange} value={formData.username} placeholder="Usuario" required/>
            </div>
            {errors.username && <p className="error">{errors.username}</p>}
            <div className="email">
                <input type="email" name="email" id="email" onChange={OnChange} value={formData.email} placeholder="ejemplo@domiino.com" required/>
            </div>
            {errors.email && <p className="error">{errors.email}</p>}
            <div className="pass">
                <input type="password" name="password" id="password" onChange={OnChange} value={formData.password} placeholder="Contraseña" required/>
            </div>
            {errors.password && <p className="error">{errors.password}</p>}
            <div className="pass">
                <input type="password" name="confirmPassword" id="confirmPassword" onChange={OnChange} value={formData.confirmPassword} placeholder="Repetir contraseña" required/>
            </div>
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

            {errors.general && <p className="error">{errors.general}</p>}
            <button className="boton_login" type="submit" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
        </form>
        <p className="p_registrate">¿Ya tienes cuenta?</p>
        <Link to="/login" className="link_registro">Iniciar sesión</Link>
    </div>

}

export default Register;