import {useEffect, useState} from "react";
import {clasificarBusqueda} from "../components/contenedor_perfil_busqueda/barra/ClasificarBusqueda.tsx";
import {getUsuario} from "../api/usuarioService.tsx";
import {getLibroPorISBN, getLibrosPorGeneral} from "../api/libroService.tsx";
import {getAutor} from "../api/autorService.tsx";


export type ResultadoBusqueda = 
    { tipo: 'autor'; id: number; nombre: string } |
    { tipo: 'libro';
            id: number;
            titulo: string;
            isbn: string;
            formato: string;
            ano_pub: string;
            ano_pub_og: string;
            portada: string;
            sinopsis: string;
            openlibrary_key: string;
            fecha_actualizacion: string;
            autores_detalle: { id: number; nombre: string }[];
            editorial_detalle: { id: number; nombre: string }[];
} |
    { tipo: 'usuario'; id: number; username: string };

export const useBusqueda = (query: string) => {

    /*
    * Primero, si empieza por @ es un usuario.
    * Si parece un ISBN, buscar por ISBN.
    * Si el término coincide con el nombre de un autor, mostrar primero el resultado que lleva a la página del autor.
    * Mostrar la lista de libros que aparecen con el término buscado.
    * */
    
    const useDebounce= (value: string, delay: number) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
            const timer = setTimeout(() => setDebouncedValue(value), delay);
            return () => clearTimeout(timer);
        }, [value, delay]);
        return debouncedValue;
    }
    
    const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
    const [cargando, setCargando] = useState(false);
    const debouncedQuery = useDebounce(query, 500);
    const pendiente = debouncedQuery !== query;
    
    useEffect(() => {
        if(!debouncedQuery){
            setResultados([]);
            return;
        }
        
        const { tipo, valor } = clasificarBusqueda(debouncedQuery);
        setCargando(true);
        
        const buscar = async () => {
            if(tipo === 'usuario'){
                const usuario = await getUsuario(valor);
                setResultados(usuario ? [{ tipo: 'usuario', ...usuario }] : []);
            }else if(tipo === 'isbn'){
                const libro = await getLibroPorISBN(valor);
                setResultados(libro ? [{ tipo: 'libro', ...libro }] : []);
            }else{
                const [libros, autor] = await Promise.all([
                    getLibrosPorGeneral(valor),
                    getAutor(valor),
                ]);
                
                const items: ResultadoBusqueda[] = [
                    ...(autor ? [{ tipo: 'autor' as const, id: autor.id, nombre: autor.nombre }] : []),
                    ...libros?.map(libro => ({ tipo: 'libro' as const, ...libro })) ?? [],
                ];
                setResultados(items);
            }
            
            setCargando(false);
        };
        
        buscar();
        
    }, [debouncedQuery]);
    
    return { resultados, cargando, pendiente };
    
}