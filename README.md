![Lili](/lili/public/logo_dark.svg)

![MIT License](https://img.shields.io/badge/license-MIT-green)
![Django](https://img.shields.io/badge/backend-Django-092E20?logo=django)
![React](https://img.shields.io/badge/frontend-React-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6?logo=typescript)
![Python](https://img.shields.io/badge/language-Python-3776AB?logo=python)

Aplicación web para la gestión de una biblioteca personal.

---

## Índice
1. [Descripción](#descripción)
2. [Características](#características)
3. [Capturas](#capturas)
4. [Instalación](#instalación)
5. [Uso](#uso)
6. [Estructura del proyecto](#estructura-del-proyecto)
7. [Tecnologías](#tecnologías)
8. [Autores](#autores)
9. [Licencia](#licencia)

## Descripción
Lili es una aplicación web para la gestión de una biblioteca personal. Permite a sus usuarios guardar libros, organizarlos y hacer seguimiento de su estado de lectura.

---

## Características
- Registro y autenticación de usuarios
- Gestión de biblioteca personal
- Estados de lectura (leyendo, leído, favorito, etc.)
- Organización por categorías y series
- Sistema de amistades
- Préstamo de libros entre usuarios
- Registro manual de nuevos libros
- Formulario de contacto (con Resend)

---

## Capturas
### Biblioteca
![Biblioteca](/docs/screenshots/biblioteca.png)

### Categorías
![Categorías](/docs/screenshots/categorias.png)

### Detalle de libro
![Detalle](/docs/screenshots/detalle.png)

### Perfil
![Perfil](/docs/screenshots/perfil.png)

### Préstamos
![Préstamos](/docs/screenshots/prestamos.png)

---

## Instalación
El proyecto está dividido en:
- Back-end: Django (`lili_API`)
- Front-end: React (`lili`)

### Back-end (Django)
```bash
# Clonar repositorio
git clone https://github.com/elenaferfor/lili.git

cd lili/lili_API

# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows)
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Migraciones
python manage.py makemigrations
python manage.py migrate

# Ejecutar servidor
python manage.py runserver
```
#### Variables de entorno (.env)
Opcionales (para el formulario de contacto):
```
RESEND_API_KEY=tu_api_key
CONTACT_RECIPIENT_EMAIL=correo_destino
```

### Front-end (React)
```bash
cd ../lili

npm install
npm run dev
```

---

## Uso
1. Registrarse en la aplicación.
2. Añadir libros a la biblioteca personal.
3. Clasificar y actualizar estados de lectura.
4. Conectar con otros usuarios.
5. Compartir y prestar libros.

---

## Estructura del proyecto
```
lili/
├── src/
│   ├── api/
│   ├── auth/
│   ├── components/
│   ├── hooks/
│   ├── menu/
│   └── screens/
│
lili_API/
├── config/
├── lili_api/
│   ├── authentication/
│   ├── models/
│   ├── serializers/
│   └── views/
```

---

## Tecnologías
- Back-end: Django (Python)
- Front-end: React (Typescript)
- Base de datos: SQLite (por defecto)
- Email: Resend API
- Otros: HTML, CSS

  ---

## Personas Desarrolladoras del Proyecto
- [Elena](https://github.com/eferfor/) - Desarrolladora principal

---

## Licencia
Este proyecto está bajo la licencia **MIT**.  
Puedes consultar el archivo [LICENSE](./LICENSE) para más detalles.
