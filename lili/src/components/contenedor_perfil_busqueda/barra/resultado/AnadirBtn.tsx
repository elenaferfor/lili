import {useRef, useState} from "react";
import {useUsuarioLibro} from "../../../../hooks/useUsuarioLibro.tsx";
import PanelLibro from "../../../panel_libro/PanelLibro.tsx";
import {importarLibroOpenLibrary} from "../../../../api/libroService.tsx";

const AnadirBtn = (props: any) => {
    
    const [anadirIsOpen, setAnadirIsOpen] = useState(false);
    const btnAnadirRef = useRef<HTMLButtonElement>(null);

    const [libroId, setLibroId] = useState<number | undefined>(props.item.id);
    const [importando, setImportando] = useState(false);
    
    // Traer valores del servidor
    const { data: usuarioLibro} = useUsuarioLibro(libroId!);

    const handleAbrir = async () => {
        if (props.item.fuente === "openlibrary" && !libroId) {
            setImportando(true);
            const libro = await importarLibroOpenLibrary(props.item.isbn);
            setLibroId(libro?.id);
            setImportando(false);
        }
        setAnadirIsOpen(true);
    };
    
    return <>
        <button className={props.clase} ref={btnAnadirRef} onClick={handleAbrir} disabled={importando}>
            { importando ?
                <i className="material-symbols-rounded">sync</i> :
                usuarioLibro ?
                    <>Modificar</> :
                    <>Añadir <i className="material-symbols-rounded">add</i></>
            }
        </button>
        {anadirIsOpen &&
            <PanelLibro libroId={libroId!} onClose={() => setAnadirIsOpen(false)}/>
        }
    </>
}

export default AnadirBtn;