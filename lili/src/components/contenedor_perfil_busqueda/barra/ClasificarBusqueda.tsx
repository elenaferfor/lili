export const clasificarBusqueda = (busqueda: string) => {
    if(busqueda.startsWith('@')) return { tipo: 'usuario', valor: busqueda.slice(1) };
    if(isISBN(busqueda)) return { tipo: 'isbn', valor: busqueda };
    return { tipo: 'general', valor: busqueda };
}

const isISBN = (termino: string) => {
    return /^(97[89])?\d{9}[\dX]$/.test(termino.replace(/-/g, ''));
}