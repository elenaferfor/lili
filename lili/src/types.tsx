// Iconos de sincronización con API
export type SyncEstado = "idle" | "pendiente" | "enviando" | "ok";


// Peticiones para crear usuarioLibros
export type UsuarioLibroPostRequest = {
    "usuario": number | undefined;
    "libro": number;
    "serie": number | null;
    "numero_en_serie": number | null;
    "estado": string;
    "favorito": boolean;
    "publico": boolean;
    "categorias": number[];
};

export type UsuarioLibro = {
    id: number;
    usuario: number;
    libro_detalle: { id: number; titulo: string; portada: string; };
    serie_detalle: { id: number; nombre: string; volumenes: number; } | null;
    numero_en_serie: number;
    estado: string;
    favorito: boolean;
    publico: boolean;
    fecha_anadido: string;
    categorias_detalle: { id: number; nombre: string; }[];
}

// Clase Favorito para mostrar el icono de favorito en los libros
export type Favorito = {
    isFav: boolean;
    clase: string;
    iconoClase: string;
}
export const FAVORITOS: Favorito[] = [
    { isFav: true, clase: "estadoFavorito", iconoClase: "material-symbols-rounded notificaciones icon_fill"},
    { isFav: false, clase: "", iconoClase: "material-symbols-rounded notificaciones"}
]

// Clase préstamo
export type PrestamoIcono = {
    tipo: string;
    texto: string
    clase: string;
    icono: string;
}

export const ICONOS_PRESTAMO: PrestamoIcono[] = [
    { tipo: "sin_prestamos", texto: "Sin préstamos", clase: "sin_prestamos", icono: "group" },
    { tipo: "prestado", texto: "Prestado", clase: "prestado", icono: "partner_exchange" },
    { tipo: "en_prestamo", texto: "En préstamo", clase: "en_prestamo", icono: "partner_exchange" }
]

// Clase estado para mostrar el estado de lectura de los libros
export type EstadoOpcion = {
    valor: string;
    texto: string;
    clase: string;
    icono: string;
}
export const ESTADOS: EstadoOpcion[] = [
    { valor: "leido", texto: "Leído", clase:"estadoVerde", icono:"check"},
    { valor: "leyendo", texto: "Leyendo", clase:"estadoNaranja", icono:"menu_book"},
    { valor: "abandonado", texto: "Abandonado", clase:"estadoRojo", icono:"close"},
    { valor: "s_e", texto: "Sin empezar", clase:"", icono:"check_indeterminate_small"}
]


// Tipo categoría para mostrar los desplegables de categorías de los libros
export type Categoria = {
    id: number;
    nombre: string;
    activa: boolean;
    sync: SyncEstado;
}
// Categorías fijas del usuario
export const CATEGORIAS_EXCLUIDAS = ["Leyendo", "Préstamos", "Prestados"];


// Resultados búsqueda
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


export const FORMATOS: Record<string, string> = {
    t_dura: "tapa dura",
    t_blanda: "tapa blanda",
    bolsillo: "bolsillo"
};


// Libro
export type Libro = {
    id: number;
    titulo: string;
    isbn: string;
    formato: string;
    ano_pub: string;
    ano_pub_og: string;
    portada: string;
    sinopsis: string;
    autores: number[];
    editorial: number;
}

export type Autor = {
    nombre: string;
}

export type Editorial = {
    nombre: string;
}

export type Prestamo = {
    id: number;
    libro_detalle: { id: number; titulo: string; portada: string; };
    prestatario_nombre: { id: number; username: string; };
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
    prestador_id: number;
}

export type CrearPrestamo = {
    usuario_libro_id: number | undefined;
    prestatario_id: number;
}

export type Amistad = {
    id: number;
    usuario_a_nombre: { id: number; username: string };
    usuario_b_nombre: { id: number; username: string };
    estado: string;
}

export type Serie = {
    id: number;
    usuario: number;
    nombre: string;
    volumenes: number;
}

export type Notificacion = {
    id: number;
    usuario: number;
    tipo: string;
    texto: string;
    leida: boolean;
    fecha_creacion: string;
    referencia: number;
}