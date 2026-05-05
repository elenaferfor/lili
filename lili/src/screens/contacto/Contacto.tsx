import Logo from "../../components/logo/Logo.tsx";
import Nav from "../../components/nav/Nav.tsx";
import HeaderFooter from "../../components/header_footer/HeaderFooter.tsx";
import ContenedorPerfilBusqueda from "../../components/contenedor_perfil_busqueda/ContenedorPerfilBusqueda.tsx";
import {useNavigate} from "react-router-dom";
import "./Contacto.css";
import React, {useState} from "react";
import api from "../../api/Axios.tsx";

interface FormErrors {
    nombre?: string;
    email?: string;
    mensaje?: string;
}

const Contacto = () => {
    
    const navigate = useNavigate();
    
    const INICIAL = { nombre: '', email: '', mensaje: '' };
    const [form, setForm] = useState(INICIAL);
    const [estado, setEstado] = useState('idle');
    const [errores, setErrores] = useState<FormErrors>({});
    
    const handleChange = (e: any) => {
        setForm(prev => ({...prev, [e.target.name]: e.target.value }));
    }
    
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if(!checkErrores()) return;
        
        setEstado('loading');
        
        try{
            await api.post('contact/', form);
            setEstado('success');
            setForm(INICIAL);
        }catch{
            setEstado('error');
        }
    }
    
    const checkErrores = (): boolean => {
        const nuevosErrores: FormErrors = {};
        
        if(form.nombre.trim() === ''){
            errores.nombre = 'El campo nombre es obligatorio';
        }
        if(form.mensaje.trim() === ''){
            errores.mensaje = 'El campo mensaje es obligatorio';
        }
        if(form.email.trim() === ''){
            errores.email = 'El campo email es obligatorio';
        }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)){
            errores.email = 'El email no es válido';
        }
        
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    }
    
    return <>
        <header id="header">
            <Logo/>
            <Nav/>
            <HeaderFooter/>
        </header>
        <main>
            <ContenedorPerfilBusqueda/>
            <div className="contenido">
                <div className="migas">Contacto</div>
                <button onClick={() => navigate(-1)} className="volver">Volver</button>
                <div className="secciones">
                    <h1>Contacto</h1>
                    <section className="formulario" id="formulario">
                        <form id="formularioContacto" onSubmit={handleSubmit}>
                            <div className="contacto_nombre">
                                <label htmlFor="c_nombre">Nombre:</label>
                                <input type="text" name="nombre" id="c_nombre" required value={form.nombre} onChange={handleChange}/>
                                {errores.nombre && <p className="error">{errores.nombre}</p>}
                            </div>

                            <div className="contacto_email">
                                <label htmlFor="c_email">Email:</label>
                                <input type="email" name="email" id="c_email" required value={form.email} onChange={handleChange}/>
                                {errores.email && <p className="error">{errores.email}</p>}
                            </div>

                            <div className="contacto_mensaje">
                                <label htmlFor="c_mensaje">Mensaje:</label>
                                <textarea name="mensaje" id="c_mensaje" rows={8} required value={form.mensaje} onChange={handleChange}/>
                                {errores.mensaje && <p className="error">{errores.mensaje}</p>}
                            </div>
                            
                            <button className="boton_enviar" type="submit" disabled={estado === 'loading'}>
                                {estado === 'loading' ? 'Enviando...' : 'Enviar'}
                            </button>
                            {estado === 'success' && <p className="exito">Mensaje enviado 👍</p>}
                            {estado === 'error' && <p className="error">Error al enviar. Inténtalo de nuevo.</p>}
                        </form>
                    </section>
                </div>
            </div>
        </main>
    </>
}

export default Contacto;