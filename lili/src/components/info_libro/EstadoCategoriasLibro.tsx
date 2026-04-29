import {useEffect, useRef, useState} from "react";

const EstadoCategoriasLibro = () => {


    const [categoriasIsOpen, setCategoriasIsOpen] = useState(false);

    const categoriasRef = useRef<HTMLDivElement>(null);
    const btnCategoriasRef = useRef<HTMLButtonElement>(null);

    const [catLista, setCatLista] = useState([
        {id: "0", nombre: "Sci-fi", activa: true},
        {id: "1", nombre: "Romance", activa: false},
        {id: "2", nombre: "Fantasía", activa: false},
    ]);
    
    const toggleCategorias = () => {
        setCategoriasIsOpen(!categoriasIsOpen);
    }

    useEffect(() => {
        if(categoriasIsOpen){
            document.addEventListener("mousedown", handleClickFueraCategorias);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickFueraCategorias);
        }
    }, [categoriasIsOpen]);

    const handleClickFueraCategorias = (e: any) => {
        if(categoriasRef.current && !categoriasRef.current.contains(e.target) && !btnCategoriasRef.current?.contains(e.target)) {
            toggleCategorias();
        }
    }

    const handleCategorias = (id: string) => {
        setCatLista(prev => 
            prev.map(cat => 
                cat.id === id ?
                    {...cat, activa: !cat.activa}
                    : cat
            )
        );
    }


    return <div id="estadoCategorias">
        <button className="" onClick={toggleCategorias} ref={btnCategoriasRef}>Eliminar de <i className="material-symbols-rounded">close</i></button>
        { categoriasIsOpen &&
            <div className="categorias" ref={categoriasRef}>
                {
                    catLista.map((cat, index) => (
                        <button key={index} className={cat.activa ? "catActiva" : ""} onClick={() => handleCategorias(cat.id)}>
                            {cat.nombre} <i className="material-symbols-rounded">{cat.activa ? "check" : ""}</i>
                        </button>
                    ))
                    
                }
            </div>
        }
    </div>
    
}

export default EstadoCategoriasLibro;