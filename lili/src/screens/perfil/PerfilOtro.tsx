import {Link, useNavigate, useParams} from "react-router-dom";
import Section from "../../components/section/Section.tsx";
import {useUsuarioLibrosOtroUsuario} from "../../hooks/useUsuarioLibro.tsx";
import "./Perfil.css";
import {useCategoriasOtroUsuario} from "../../hooks/useCategoria.tsx";
import {useAmistades} from "../../hooks/useAmistades.tsx";
import {useEffect, useState} from "react";
import {type Amistad, type AmistadEstado, ESTADOS_AMISTAD} from "../../types.tsx";
import {useAuth} from "../../auth/AuthContext.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import api from "../../api/Axios.tsx";
import {Layout} from "../Layout.tsx";
import {useUsuarioID} from "../../hooks/useUsers.tsx";

const PerfilOtro = () => {
    
    const params = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const { user } = useAuth();

    const amigoId = Number(params.userId);
  
    const { data: categorias, isLoading: categoriasIsLoading } = useCategoriasOtroUsuario(amigoId);
    const { data: amistades } = useAmistades();
    const { data: libros, isLoading: librosIsLoading } = useUsuarioLibrosOtroUsuario(amigoId);
    const { data: usuario } = useUsuarioID(amigoId);
    
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
        if (!amistades) return;
        const amistad = amistades.find((a: Amistad) =>
            (a.usuario_a_nombre.id === amigoId || a.usuario_b_nombre.id === amigoId) &&
            (a.usuario_a_nombre.id === user?.id || a.usuario_b_nombre.id === user?.id)
        );
        if (amistad) setAmistadActual(amistad);
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
    
    return <Layout>
        <div className="contenido">
            <div className="migas">Perfil</div>
            <button onClick={() => navigate(-1)} className="volver">Volver</button>
            <div className="secciones">
                <section className="no_shadow_section">
                    <h1>@{usuario?.username}</h1>
                    <div className="perfilCabecera">
                        <div className="fotoPerfil">
                            <img src="/perfil/profile.png" alt="Foto de perfil"/>
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
                <Section titulo={"Leyendo"} listaLibros={leyendo?.slice(0, 15)} isLoading={librosIsLoading} deOtro={true}/>
                <Section titulo={"Últimos añadidos"} listaLibros={libros?.slice(0, 15)} isLoading={librosIsLoading} deOtro={true}/>
                <Section titulo={"Favoritos"} listaLibros={favoritos?.slice(0, 15)} isLoading={librosIsLoading} deOtro={true}/>
            </div>
        </div>
    </Layout>
}

export default PerfilOtro;