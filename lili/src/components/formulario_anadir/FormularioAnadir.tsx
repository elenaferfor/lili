import {useState} from "react";
import type {Libro} from "../../types.tsx";
import {useLibroISBN} from "../../hooks/useLibro.tsx";
import {useMutation} from "@tanstack/react-query";
import api from "../../api/Axios.tsx";
import {useOrCreateAutor, useOrCreateEditorial} from "../../hooks/useCrearLibro.tsx";

interface AnadirErrors {
    titulo?: string;
    isbn?: string;
}

const FormularioAnadir = () => {
    
    const [libro, setLibro] = useState<Libro>({
        titulo: '',
        isbn: '',
        formato: 't_blanda',
        ano_pub: '',
        ano_pub_og: '',
        portada: '',
        sinopsis: '',
        autores: [],
        editorial: 0
    });
    
    const [autores, setAutores] = useState<string>('');
    const [editorial, setEditorial] = useState<string>('');
    
    const [errors, setErrors] = useState<AnadirErrors>({});
    const [successMsg, setSuccessMsg] = useState<string>('');

    const { data: libroExistente } = useLibroISBN(libro.isbn, {
        enabled: libro.isbn.trim().length === 13,
    });
    const editorialMutation = useOrCreateEditorial();
    const autorMutation = useOrCreateAutor();
    const crearLibroMutation = useMutation({
        mutationFn: (data: Libro) => api.post('/libros/', data),
        onSuccess: () => {
            setSuccessMsg('Libro añadido correctamente. Ahora puedes añadirlo a tu biblioteca desde el buscador.');
            setLibro({
                titulo: '',
                isbn: '',
                formato: 't_blanda',
                ano_pub: '',
                ano_pub_og: '',
                portada: '',
                sinopsis: '',
                autores: [],
                editorial: 0
            });
            setEditorial('');
            setAutores('');
        },
    });

    // Coger valores del formulario
    const OnChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setLibro(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    const OnChangeAutores = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAutores(value);
    }
    
    const OnChangeEditorial = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEditorial(value);
    }

    // Validar formulario
    const validate = (): boolean => {
        const newErrors: AnadirErrors = {};

        if(!libro.titulo.trim())
            newErrors.titulo = 'El campo título es obligatorio';

        if(!libro.isbn.trim())
            newErrors.isbn = 'El campo ISBN es obligatorio';
        
        if(libroExistente)
            newErrors.isbn = 'El libro con ese ISBN ya está registrado';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    
    const OnSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if(!validate()) return;
        await handleSubmit(libro);
    }
    
    const handleSubmit = async (libro: Libro) => {
        try{
            const editorialId: number = await editorialMutation.mutateAsync(editorial);
            const autoresIds = await Promise.all(
                autores.split(",").map(nombre => autorMutation.mutateAsync(nombre.trim()))
            );
            
            await crearLibroMutation.mutateAsync({
                ...libro,
                editorial: editorialId,
                autores: autoresIds,
            });
        }catch (error){
            console.error('Error al guardar el libro: ', error);
        }
    }
    
    const isLoading = 
        editorialMutation.isPending ||
        autorMutation.isPending ||
        crearLibroMutation.isPending;
    
    return <section className="formulario" id="formulario">
        <h1>Añadir manualmente</h1>
        <form id="formularioAnadir" onSubmit={OnSubmit}>
            <div className="grid_formulario">
                <div className="isbn">
                    <label htmlFor="f_ISBN">ISBN</label>
                    <input type="text" name="isbn" id="f_ISBN" required maxLength={13}
                        value={libro.isbn} onChange={OnChange}    
                    />
                    {errors.isbn && <p className="error">{errors.isbn}</p>}
                </div>

                <div className="titulo">
                    <label htmlFor="f_titulo">Título</label>
                    <input type="text" name="titulo" id="f_titulo" required
                           value={libro.titulo} onChange={OnChange}
                    />
                    {errors.titulo && <p className="error">{errors.titulo}</p>}
                </div>

                <div className="autor">
                    <label htmlFor="f_autor">Autor</label>
                    <input type="text" name="autores" id="f_autor"
                           placeholder="Autor 1, Autor 2..."
                           value={autores} onChange={OnChangeAutores}/>
                </div>

                <div className="editorial">
                    <label htmlFor="f_editorial">Editorial</label>
                    <input type="text" name="editorial" id="f_editorial"
                        value={editorial} onChange={OnChangeEditorial}/>
                </div>

                <div className="formato">
                    <label htmlFor="f_formato">Formato</label>
                    <select name="formato" id="f_formato" value={libro.formato} onChange={OnChange}>
                        <option value="t_blanda">Tapa blanda</option>
                        <option value="t_dura">Tapa dura</option>
                        <option value="bolsillo">Bolsillo</option>
                    </select>
                    <span><i className="material-symbols-rounded">arrow_drop_down</i></span>
                </div>

                <div className="pub_original">
                    <label htmlFor="f_pub_original">Fecha de publicación original</label>
                    <input type="date" name="ano_pub_og" id="f_pub_original"
                           value={libro.ano_pub_og} onChange={OnChange}/>
                </div>

                <div className="pub_edicion">
                    <label htmlFor="f_pub_edicion">Año de edición</label>
                    <input type="date" name="ano_pub" id="f_pub_edicion"
                           value={libro.ano_pub} onChange={OnChange}/>
                </div>

                <div className="portada">
                    <label htmlFor="f_portada">Portada</label>
                    <input type="text" name="portada" id="f_portada" placeholder="URL de imagen..."
                           value={libro.portada} onChange={OnChange}
                    />
                </div>

                <div className="sinopsis">
                    <label htmlFor="f_sinopsis">Sinopsis</label>
                    <textarea name="sinopsis" id="f_sinopsis" rows={6}
                              value={libro.sinopsis} onChange={OnChange}></textarea>
                </div>
            </div>
            <button className="boton_enviar" type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Añadir a Lili'}
            </button>
            <p className="success">{successMsg}</p>
        </form>
    </section>
}

export default FormularioAnadir;