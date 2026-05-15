import {createContext, useContext, useEffect, useState} from "react";

const MenuContext = createContext({
    menuOpen: false,
    esPequena: false,
    openMenu: () => {},
    closeMenu: () => {},
});

export const MenuProvider = ({ children}: { children: React.ReactNode }) => {
    
    const [menuOpen, setMenuOpen] = useState(false);
    const [esPequena, setEsPequena] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            const pequena = window.innerWidth <= 768;
            setEsPequena(pequena);
            if(!pequena) setMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    return <MenuContext.Provider value={{
        menuOpen,
        esPequena,
        openMenu: () => setMenuOpen(true),
        closeMenu: () => setMenuOpen(false),
    }}>
        {children}
    </MenuContext.Provider>
}

export const useMenu = () => useContext(MenuContext);