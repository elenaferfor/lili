import {useNavigate, useParams} from "react-router-dom";
import Nav from "../../components/nav/Nav.tsx";
import HeaderFooter from "../../components/header_footer/HeaderFooter.tsx";
import ContenedorPerfilBusqueda from "../../components/contenedor_perfil_busqueda/ContenedorPerfilBusqueda.tsx";
import Section from "../../components/section/Section.tsx";
import Footer from "../../components/footer/Footer.tsx";
import InfoLibro from "../../components/info_libro/InfoLibro.tsx";
import {useEffect, useState} from "react";
import api from "../../api/Axios.tsx";
import Logo from "../../components/logo/Logo.tsx";

interface Autor {
    id: number;
    nombre: string;
}

interface Editorial {
    id: number;
    nombre: string;
}

interface InfoLibroData {
    id: number;
    isbn: string;
    titulo: string;
    formato: string;
    ano_pub: string;
    ano_pub_og: string;
    portada: string;
    sinopsis: string;
    openlibrary_key: string;
    fecha_actualizacion: string;
    autores_detalle: Autor[] | null;
    editorial_detalle: Editorial | null;
}

const Index = () => {
    
    let navigate = useNavigate();
    const params = useParams();
    const [libroExiste, setLibroExiste] = useState(false);
    const [infoLibroData, setInfoLibroData] = useState<InfoLibroData | null>(null);
    
    useEffect(() => {
        api.get("/libros/" + params.libroId + "/").then(response => {
            setInfoLibroData(response.data);
            setLibroExiste(true);
            console.log(infoLibroData?.autores_detalle);
        }).catch(() => {

        });
    }, []);
    
    useEffect(() => {
        
    }, [infoLibroData]);
    

    return <>
        <header id="header">
            <Logo/>
            <Nav/>
            <HeaderFooter/>
        </header>
        <main>
            <ContenedorPerfilBusqueda/>
            <div className="contenido">
                <div className="migas">Biblioteca · {infoLibroData?.titulo}</div>
                <button onClick={() => navigate(-1)} className="volver">Volver</button>
                <div className="secciones">
                    {!libroExiste ? <section><p>EL libro no existe en la base de datos.</p></section> :
                        <>
                            <InfoLibro data={infoLibroData}/>
                            {infoLibroData?.autores_detalle?.map((autor, index) => {
                                if((infoLibroData?.autores_detalle?.length ?? 0) > 1){
                                    return <Section key={index} titulo={"Otros libros de " + autor.nombre} esLibroUsuario={false} filtroBusqueda={`/libros/?autores=${autor.id}&autor_nombre=`}/>
                                }
                            })}
                            <Section titulo={"Libros similares"} esLibroUsuario={false} filtroBusqueda={"/libros/?autores=31&autor_nombre="}/>
                        </>
                    }
                </div>
            </div>
        </main>
        <Footer/>
    </>
}

export default Index;