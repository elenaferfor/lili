import Logo from "../../components/logo/Logo.tsx";
import Nav from "../../components/nav/Nav.tsx";
import HeaderFooter from "../../components/header_footer/HeaderFooter.tsx";
import ContenedorPerfilBusqueda from "../../components/contenedor_perfil_busqueda/ContenedorPerfilBusqueda.tsx";
import Footer from "../../components/footer/Footer.tsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import SectionSinGet from "../../components/section/SectionSinGet.tsx";
import {useUsuarioLibrosOtroUsuario} from "../../hooks/useUsuarioLibro.tsx";
import "./Perfil.css";
import {useCategoriasOtroUsuario} from "../../hooks/useCategoria.tsx";
import {useAmistades} from "../../hooks/useAmistades.tsx";
import {useEffect, useState} from "react";
import {type Amistad, type AmistadEstado, ESTADOS_AMISTAD} from "../../types.tsx";
import {useAuth} from "../../auth/AuthContext.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import api from "../../api/Axios.tsx";

const PerfilOtro = () => {
    
    const params = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const { user } = useAuth();

    const amigoId = Number(params.userId);
    const [username, setUsername] = useState("");
  
    const { data: categorias, isLoading: categoriasIsLoading } = useCategoriasOtroUsuario(amigoId);
    const { data: amistades } = useAmistades();
    const { data: libros, isLoading: librosIsLoading } = useUsuarioLibrosOtroUsuario(amigoId);
    
    const leyendo = libros?.filter(l => l.estado === "leyendo");
    const favoritos = libros?.filter(l => l.favorito);

    const [amistadActual, setAmistadActual] = useState<Amistad>();
    
    const categoriasUsuario = categorias?.filter(c => c.usuario === amigoId );

    const [amistadEstado, setAmistadEstado] = useState<AmistadEstado>(ESTADOS_AMISTAD[0]);
    
    const onSuccessAmistad = () => {
        queryClient.invalidateQueries({ queryKey: ["amistades"] });
    };
    
    // Solicitar amistad: crea amistad y notifica
    const { mutate: solicitarAmistad } = useMutation({
        mutationFn: async () => {
            const { data: nuevaAmistad } = await api.post("/amistades/", {
                usuario_a: user?.id,
                usuario_b: amigoId,
            });
            await api.post("/notificaciones/", {
               usuario: amigoId,
                tipo: "Petición de amistad",
                texto: "te ha hecho una solicitud de amistad.",
                leida: false,
                referencia: nuevaAmistad.id,
            });
            return nuevaAmistad;
        },
        onSuccess: onSuccessAmistad,
    });
    
    // Borrar amistad
    const { mutate: borrarAmistad } = useMutation({
        mutationFn: () => api.post(`/amistades/${amistadActual?.id}/ignorar/`),
        onSuccess: onSuccessAmistad,
    });
    
    useEffect(() => {
        const userAmistades = amistades?.filter((a: Amistad) => a.usuario_a_nombre.id === amigoId || a.usuario_b_nombre.id === amigoId);
        if(!userAmistades?.length) return;

        if (userAmistades[0].usuario_a_nombre.id === amigoId) {
            setUsername(userAmistades[0].usuario_a_nombre.username);
        } else {
            setUsername(userAmistades[0].usuario_b_nombre.username);
        }
        
        setAmistadActual(amistades?.find(a => {
            if ((a.usuario_a_nombre.id === amigoId || a.usuario_b_nombre.id === amigoId) && (a.usuario_a_nombre.id === user?.id || a.usuario_b_nombre.id === user?.id)) {
                return a;
            }
        }));
    }, [amistades, amigoId]);

    useEffect(() => {
        if(!amistadActual) return;
        if(amistadActual?.estado === "ac") setAmistadEstado(ESTADOS_AMISTAD[2]);
        if(amistadActual?.estado === "pen") setAmistadEstado(ESTADOS_AMISTAD[1]);
        if(amistadActual?.estado === "blo") setAmistadEstado(ESTADOS_AMISTAD[3]);
        if(amistadActual?.estado === "s_s") setAmistadEstado(ESTADOS_AMISTAD[0]);
    }, [amistadActual]);

    
    const bloqueAmistad = () => {
        if (amistadEstado.estado === "blo") return null;
        if (amistadEstado.estado === "s_s") return (
            <div className="bloqueAmistad">
                <button className={amistadEstado.clase} onClick={() => solicitarAmistad()}>
                    Solicitar amistad
                </button>
            </div>
        );
        if (amistadEstado.estado === "pen") return (
            <div className="bloqueAmistad">
                <button className={amistadEstado.clase} disabled>
                    Amistad solicitada
                </button>
            </div>
        );
        if (amistadEstado.estado === "ac") return (
            <div className="bloqueAmistad">
                <button className={amistadEstado.clase} onClick={() => borrarAmistad()}>
                    Borrar amistad
                </button>
            </div>
        );

        return null;
    };
    
    return <>
        <header id="header">
            <Logo/>
            <Nav/>
            <HeaderFooter/>
        </header>
        <main>
            <ContenedorPerfilBusqueda/>
            <div className="contenido">
                <div className="migas">Perfil</div>
                <button onClick={() => navigate(-1)} className="volver">Volver</button>
                <div className="secciones">
                    <section className="no_shadow_section">
                        <h1>@{username}</h1>
                        <div className="perfilCabecera">
                            <div className="fotoPerfil">
                                <img src="/perfil/te.JPG" alt="Té"/>
                            </div>
                            <div className="perfilColecciones">
                                { bloqueAmistad() }
                                <p className="perfilColeccionesP">Colecciones públicas:</p>
                                <div className="perfilColeccionesTags">
                                    {
                                        categoriasIsLoading ?
                                            'Cargando...' : <>{categoriasUsuario?.map((c, i) => <Link to={`/categorias/${amigoId}/${c.id}`} className="tag" key={i}>{c.nombre}</Link>)}</>
                                    }
                                </div>
                            </div>
                        </div>
                    </section>
                    <SectionSinGet titulo={"Leyendo"} listaLibros={leyendo} isLoading={librosIsLoading} deOtro={true}/>
                    <SectionSinGet titulo={"Últimos añadidos"} listaLibros={libros} isLoading={librosIsLoading} deOtro={true}/>
                    <SectionSinGet titulo={"Favoritos"} listaLibros={favoritos} isLoading={librosIsLoading} deOtro={true}/>
                </div>
            </div>
        </main>
        <Footer/>
    </>
}

export default PerfilOtro;