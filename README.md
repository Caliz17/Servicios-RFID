# Gestión de Servicios Financieros

Este proyecto es una aplicación de gestión de servicios (Agua,energia,etc.) que permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) en varias tablas relacionadas con la gestión de cuentas, usuarios, pagos de servicios y transferencias. Además, permite realizar pagos de servicios, transferencias de saldo, depósitos y la gestión de tarjetas RFID.

## Tecnologías Utilizadas

- **Backend:**

  - **Node.js**: Entorno de ejecución para JavaScript en el servidor.
  - **Express**: Framework web para Node.js, utilizado para crear APIs RESTful.
  - **Prisma ORM**: ORM para Node.js y TypeScript, facilita la interacción con la base de datos.
  - **Nodemon**: Herramienta que reinicia automáticamente el servidor cuando detecta cambios en los archivos.
  - **CORS**: Middleware para habilitar solicitudes de recursos entre diferentes dominios.
  - **JSON Web Token (JWT)**: Mecanismo para la autenticación y autorización basada en tokens.
  - **Swagger (Swagger-JSDoc y Swagger-UI-Express)**: Herramienta con la que se encuentra documentada la API.

- **Frontend:**

  - **React**: Biblioteca de JavaScript para construir la interfaz de usuario.
  - **Vite**: Herramienta de desarrollo que proporciona un entorno de desarrollo rápido para proyectos de frontend.
  - **FontAwesome**: Biblioteca de íconos que se utiliza para agregar íconos y gráficos vectoriales a la interfaz.
  - **Axios**: Cliente HTTP basado en promesas para realizar solicitudes HTTP desde el navegador.
  - **React Router**: Librería para la navegación y enrutamiento en aplicaciones React.
  - **SweetAlert2**: Biblioteca para mostrar alertas y diálogos personalizados.
  - **Tailwind CSS**: Framework de CSS para construir la interfaz del usuario .

- **Base de Datos:**
  - **PostgreSQL**: Sistema de gestión de bases de datos relacional.

## Configuración del Entorno de Desarrollo

### Prerrequisitos

Asegúrate de tener instalados los siguientes componentes:

- Node.js (v14 o superior)
- npm (v6 o superior)
- PostgreSQL

### Variables de Entorno

#### Backend

Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables de entorno:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gestion_servicios?schema=public"
```

### Comandos para la ejecucion de los proyectos

#### backend

```bash
npm run dev
```

_se ejecuta en el puerto 3001_

#### frontend

```bash
npm start
```

_se ejecuta en el puerto 3000_

### Notas

El backend tiene la documentacion de la api en http://localhost:3001/docs


## test
