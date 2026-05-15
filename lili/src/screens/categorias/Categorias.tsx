import {useNavigate} from "react-router-dom";
import Etiquetas from "../../components/etiquetas/Etiquetas.tsx";
import {useEffect, useState} from "react";
import {useCategorias} from "../../hooks/useCategoria.tsx";
import {useUsuarioLibrosListaAbc} from "../../hooks/useUsuarioLibro.tsx";
import type {Prestamo, UsuarioLibro} from "../../types.tsx";
import SectionCategorias from "../../components/section/SectionCategorias.tsx";
import {usePrestamos} from "../../hooks/usePrestamos.tsx";
import {useAuth} from "../../auth/AuthContext.tsx";
import {Layout} from "../Layout.tsx";

const Categorias = () => {
    
    const user = useAuth();
    
    const navigate = useNavigate();
    const [tituloActual, setTituloActual] = useState("Todos los libros");
 

    // Traer categorías y libros
    const { data: categorias, isLoading: categoriasIsLoading } = useCategorias();
    const { data: libros, isLoading: librosIsLoading } = useUsuarioLibrosListaAbc();
    const { data: prestamos } = usePrestamos();
    
    const [listaLibros, setListaLibros] = useState<UsuarioLibro[] | Prestamo[] | undefined>([]);
    
    useEffect(() => {
        if(!libros) return;
        setListaLibros(libros);
    }, [libros]);
    
    const onChangeTag = (tag: string) => {
        // Leyendo, prestados y préstamos no pertenecen a categorías, son llamadas a actions específicos
        if(tag === "Leyendo"){
            setListaLibros(libros?.filter(l => l.estado === "leyendo"));
            setTituloActual("Leyendo");
        }else if(tag === "Prestados"){
            setListaLibros(prestamos?.filter(p => p.prestatario_nombre.id !== user.user?.id ));
            setTituloActual("Prestados");
        }else if(tag === "Préstamos"){
            setListaLibros(prestamos?.filter(p => p.prestatario_nombre.id === user.user?.id ));
            setTituloActual("Préstamos");
            
            // Si la categoría tiene nombre, se llama a un filtro por nombre de categoría
        }else if(tag !== ""){
            setListaLibros(libros?.filter(l => l.categorias_detalle.map(c => c.nombre).includes(tag)))
            setTituloActual(tag);
            
            // La otra opción es "todos", que trae todos los libros del usuario
        }else{
            setListaLibros(libros);
            setTituloActual("Todos los libros");
        }
    }
    
    const onBorrarCategoria = () => {
        onChangeTag("");
    }
    
    return <Layout>
        <div className="contenido">
            <div className="migas">Biblioteca · Categorías</div>
            <button onClick={() => navigate(-1)} className="volver">Volver</button>
            <div className="secciones">
                { categoriasIsLoading ?
                    <>Cargando categorías...</> :
                    <Etiquetas catsUsuario={categorias} onChangeTag={onChangeTag}/>
                }
                { categoriasIsLoading || librosIsLoading ?
                    <>Cargando...</> :
                    <SectionCategorias catsUsuario={categorias}
                                       listaLibros={listaLibros}
                                       prestamos={prestamos}
                                       tituloCat={tituloActual}
                                       isTodos={tituloActual === "Todos los libros"}
                                       onBorrarCategoria={onBorrarCategoria}
                    />
                }
            </div>
        </div>
    </Layout>
}

export default Categorias;