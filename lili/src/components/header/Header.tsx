import HeaderFooter from "../header_footer/HeaderFooter.tsx";
import Nav from "../nav/Nav.tsx";
import Logo from "../logo/Logo.tsx";
import {useMenu} from "../../menu/MenuContext.tsx";

const Header = () => {
    
    const { menuOpen, esPequena, closeMenu } = useMenu();
    
    return <header 
        id="header" className={`
            ${esPequena ? "pantalla_pequena" : "pantalla_grande"}
            ${esPequena && menuOpen ? "menu_open" : ""}
        `}
    >
        <Logo onCloseMenu={closeMenu}/>
        <Nav/>
        <HeaderFooter/>
    </header>
}

export default Header;