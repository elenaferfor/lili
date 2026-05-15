import ContenedorPerfilBusqueda from "../components/contenedor_perfil_busqueda/ContenedorPerfilBusqueda.tsx";
import {MenuProvider} from "../menu/MenuContext.tsx";
import Header from "../components/header/Header.tsx";
import Footer from "../components/footer/Footer.tsx";

export const Layout = ({ children }: { children: any }) => {
    return <MenuProvider>
        <Header/>
        <main>
            <ContenedorPerfilBusqueda/>
            {children}
        </main>
        <Footer/>
    </MenuProvider>
}