
# API E-commerce Backend con Node.js y Express

# E-comerce
Simulador de E-comerce, 'node.js &amp; espress'.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite3](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## Propósito del Proyecto

Esta API proporciona la funcionalidad backend para una plataforma de comercio electrónico. Permite la gestión de usuarios, productos, categorías, carritos de compra y órdenes, facilitando la creación de una experiencia de compra online completa.

## Características

Esta API de E-commerce está diseñada para ser un backend robusto y completo, ofreciendo las siguientes funcionalidades clave:

* **Gestión de Usuarios:**
    * **Registro de Usuarios:** Permite a nuevos usuarios crear cuentas en la plataforma.
    * **Autenticación y Autorización (JWT):** Implementa JSON Web Tokens (JWT) para un acceso seguro y para verificar la identidad y permisos de los usuarios en las rutas protegidas.
    * **Login de Usuarios:** Facilita el inicio de sesión para usuarios existentes, emitiendo un nuevo token JWT válido.
    * **Perfiles de Usuario:** Posibilidad de acceder y, potencialmente, actualizar información del perfil de usuario.

* **Gestión de Productos:**
    * **Creación de Productos:** Permite añadir nuevos productos al catálogo con detalles como nombre, descripción, precio, URL de imagen, categoría y stock.
    * **Listado de Productos:** Recupera todos los productos disponibles, con opciones de filtrado, paginación o búsqueda (si se implementan).
    * **Detalle de Producto:** Obtiene la información específica de un producto por su identificación.
    * **Actualización de Productos:** Permite modificar la información de productos existentes.
    * **Eliminación de Productos:** Posibilita la baja de productos del catálogo.

* **Gestión de Categorías:**
    * **Creación de Categorías:** Permite definir categorías para organizar los productos (ej. "Electrónica", "Ropa", "Libros").
    * **Listado de Categorías:** Recupera todas las categorías disponibles.
    * **Actualización de Categorías:** Permite modificar los nombres u otros atributos de las categorías.
    * **Eliminación de Categorías:** Posibilita la baja de categorías.

* **Gestión de Carritos de Compra:**
    * **Creación/Recuperación de Carrito:** Un carrito único asociado a cada usuario autenticado.
    * **Añadir/Actualizar Ítems en Carrito:** Permite añadir productos al carrito o ajustar la cantidad de un producto existente.
    * **Ver Contenido del Carrito:** Muestra los productos y cantidades actuales en el carrito del usuario.
    * **Eliminar Ítems del Carrito:** Posibilita la eliminación de productos específicos del carrito.
    * **Vaciar Carrito:** Permite eliminar todos los artículos del carrito de un usuario.

* **Gestión de Órdenes:**
    * **Creación de Órdenes:** Permite convertir el contenido de un carrito en una orden de compra, calculando el total y registrando el estado.
    * **Listado de Órdenes por Usuario:** Recupera el historial de órdenes de un usuario.
    * **Detalle de Orden:** Obtiene la información específica de una orden y sus artículos.
    * **Actualización de Estado de Orden (para administradores):** Permite cambiar el estado de una orden (ej. 'pendiente' a 'enviado', 'completado').

## Tecnologías Usadas

Este proyecto está construido sobre una pila moderna y eficiente, utilizando las siguientes tecnologías y librerías principales:

* **Node.js**: Entorno de ejecución de JavaScript del lado del servidor.
* **Express.js**: Un framework web rápido, no opinado y minimalista para Node.js, utilizado para construir la API RESTful.
* **better-sqlite3**: Una librería de SQLite3 para Node.js, elegida por su rendimiento robusto y su confiabilidad en la gestión de bases de datos SQLite, especialmente en entornos como Windows donde otras opciones de `sqlite3` pueden presentar desafíos de compilación.
* **bcryptjs**: Librería para el hash seguro de contraseñas, garantizando la protección de la información sensible de los usuarios.
* **jsonwebtoken (JWT)**: Implementación de JSON Web Tokens para la autenticación de usuarios y la gestión de sesiones seguras.
* **dotenv**: Módulo para cargar variables de entorno desde un archivo `.env`, manteniendo la configuración sensible separada del código fuente y facilitando la gestión de diferentes entornos (desarrollo, producción).
* **ES Modules (ESM)**: El proyecto utiliza la sintaxis moderna de módulos de JavaScript (`import`/`export`), lo que mejora la modularidad y la organización del código.

## Guía de Instalación/Configuración

Para poner en marcha esta API en tu entorno local, sigue los siguientes pasos:

1.  **Clonar el Repositorio:**
    Abre tu terminal (PowerShell en Windows, o la terminal de tu preferencia en Linux/macOS) y ejecuta el siguiente comando para clonar el repositorio en tu máquina local:

    ```bash
    git clone git@github.com:jorge232708/E-comerce.git
    ```
    *Si experimentas problemas con la autenticación SSH, puedes intentar clonar usando HTTPS:*
    ```bash
    git clone [https://github.com/jorge232708/E-comerce.git](https://github.com/jorge232708/E-comerce.git)
    ```

2.  **Navegar al Directorio del Proyecto:**
    Una vez clonado el repositorio, accede al directorio del proyecto desde tu terminal:
    ```bash
    cd E-comerce
    ```

3.  **Instalar Dependencias:**
    Ahora, instala todas las dependencias del proyecto utilizando `npm`. Este comando descargará e instalará todas las librerías necesarias definidas en el `package.json`.
    ```bash
    npm install
    ```
    * **Nota importante para usuarios de Windows (experiencia del desarrollador):**
        Durante la instalación de dependencias, el paquete `better-sqlite3` (o cualquier librería con componentes nativos) puede requerir herramientas de compilación de C++ para Windows. Si encuentras errores relacionados con "bindings" o compilación (`code: 'EPERM'`, `syscall: 'rmdir'`), asegúrate de tener las **Build Tools de Visual Studio** instaladas. Puedes descargarlas desde el sitio oficial de Visual Studio (busca "Build Tools para Visual Studio 2019" o "2022") y seleccionar la carga de trabajo "Desarrollo de escritorio con C++". Esta fue una solución clave para la correcta operación de `better-sqlite3` en Node.js `v22.16.0` en este proyecto.

4.  **Configurar Variables de Entorno:**
    El proyecto utiliza variables de entorno para manejar configuraciones sensibles o que varían entre diferentes entornos (desarrollo, producción). Deberás crear un archivo `.env` en la raíz del proyecto.

    * Crea un archivo llamado `.env` en la misma carpeta donde se encuentran `package.json` y `src`.
    * Copia y pega el siguiente contenido en tu archivo `.env`, reemplazando los valores de ejemplo con los tuyos:

        ```dotenv
        PORT=3000
        JWT_SECRET=tu_secreto_super_seguro_y_largo_aqui
        ```

    * **Explicación de las variables:**
        * `PORT`: El puerto en el que la API escuchará las solicitudes (por defecto, 3000).
        * `JWT_SECRET`: Una cadena de texto larga y compleja utilizada para firmar y verificar los JSON Web Tokens. **¡Es crucial que esta clave sea segura y no sea compartida públicamente!** Genera una cadena aleatoria y robusta para producción.

    * **Importante:** El archivo `.env` está configurado para ser ignorado por Git (`.gitignore`), lo que evita que tus credenciales sensibles se suban al repositorio público.

5.  **Inicializar la Base de Datos:**
    El proyecto incluye un script (`src/db/init-db.js`) que se encarga de crear las tablas necesarias en la base de datos SQLite si no existen. Este proceso se ejecuta automáticamente al iniciar el servidor por primera vez, o si el archivo `database.db` es eliminado.

    * No necesitas ejecutar un comando de migración separado; la estructura de la base de datos se verifica y se crea (o actualiza) automáticamente al arrancar la aplicación.
    * Puedes verificar la creación de la base de datos buscando el archivo `database.db` dentro de la carpeta `src/db/` después de levantar el servidor.

6.  **Levantar el Servidor:**
    Una vez que todas las dependencias están instaladas y las variables de entorno configuradas, puedes iniciar el servidor de desarrollo.

    ```bash
    npm dev
    ```

    * Este comando iniciará el servidor Express, y deberías ver mensajes en tu consola indicando que la base de datos se ha conectado y que el servidor está escuchando en el puerto configurado (ej. `🚀 Servidor escuchando en http://localhost:3000`).
    * Puedes verificar que el servidor está en funcionamiento abriendo tu navegador web y yendo a `http://localhost:3000`. Deberías ver un mensaje como: "Servidor de E-commerce de Zayana en funcionamiento."

## Desafío y Solución con `sqlite3` en Entornos Windows (Node.js v22.16.0)

Durante el desarrollo de este proyecto, se presentó un desafío significativo al intentar instalar y ejecutar la librería `sqlite3` en un entorno Windows con Node.js `v22.16.0` y utilizando `pnpm` como gestor de paquetes. Este problema es común con librerías de Node.js que tienen **componentes nativos (escritos en C++),** como `sqlite3`.

### El Problema:

El error recurrente era `Error: Could not locate the bindings file. Tried: ...\node_sqlite3.node`, que indicaba que el gestor de paquetes no podía encontrar el archivo binario (`.node`) precompilado o compilado localmente, necesario para que `sqlite3` interactúe con la base de datos.

Las causas raíz identificadas fueron:

1.  **Fallas en la compilación de componentes nativos:** `sqlite3` requiere que ciertas herramientas de compilación de C++ (como las "Build Tools de Visual Studio") estén presentes en el sistema para compilar sus componentes nativos durante la instalación. A menudo, estas herramientas no están configuradas correctamente o faltan en el entorno de desarrollo, especialmente en Windows.
2.  **Incompatibilidad o manejo de `windows-build-tools` con `pnpm` y Node.js v22.16.0:** Intentos iniciales de instalar `windows-build-tools` (una herramienta popular para automatizar la instalación de estas herramientas de C++) con `pnpm` a nivel global resultaron en advertencias como `windows-build-tools has no binaries` e `Ignored build scripts: windows-build-tools.`. Esto sugirió que `pnpm` no estaba ejecutando correctamente los scripts de post-instalación de `windows-build-tools` que se encargan de instalar las herramientas de compilación. Además, con Node.js `v22.16.0`, hubo un `TypeError: 'process.env' only accepts a configurable, writable, and enumerable data descriptor` al intentar usar `windows-build-tools` con `npm`, indicando una incompatibilidad con las versiones más recientes de Node.js en cómo se manejan las variables de entorno internas.
3.  **Conflictos con el caché o `node_modules` previos:** A pesar de intentar limpiar cachés y eliminar `node_modules` con `pnpm`, el problema persistía, lo que reforzaba la idea de una dificultad subyacente en la compilación de `sqlite3` en este entorno específico.

### La Solución Implementada:

Para superar estos obstáculos y asegurar la funcionalidad de la base de datos, se adoptó una estrategia multifacética y robusta:

1.  **Instalación Manual y Directa de Build Tools de Visual Studio:**
    El problema principal radicaba en la ausencia o configuración incorrecta de las herramientas de compilación de C++ requeridas por `sqlite3` en el entorno Windows. Se procedió con la instalación de las **"Build Tools para Visual Studio" (versión 2019 o 2022)** directamente desde el sitio web de Microsoft. Durante la instalación, se seleccionó específicamente la carga de trabajo de **"Desarrollo de escritorio con C++"**. Este paso fue fundamental, ya que garantizó que todas las dependencias de compilación nativas necesarias estuvieran presentes y correctamente configuradas en el sistema, lo cual es imprescindible para compilar módulos de Node.js escritos en C++.

2.  **Transición a `better-sqlite3`:**
    Ante la persistencia de los problemas de compilación con el paquete `sqlite3` tradicional (que busca binarios precompilados o intenta compilarlos de forma que no funcionaba en este entorno específico), se decidió migrar a **`better-sqlite3`**. Este paquete es altamente valorado en la comunidad por varias razones clave que resolvieron el problema:
    * **Fiabilidad en la Compilación:** `better-sqlite3` tiene un proceso de instalación y compilación de sus componentes nativos generalmente más robusto y exitoso en diferentes plataformas, incluyendo Windows.
    * **Binarios Precompilados (en algunos casos):** A menudo, `better-sqlite3` ofrece binarios precompilados para combinaciones comunes de Node.js y sistemas operativos, lo que evita la necesidad de una compilación local en absoluto, eliminando la causa raíz del error "bindings file not found".
    * **Rendimiento y API Síncrona:** Además de la compatibilidad, `better-sqlite3` es conocido por su excelente rendimiento y una API más directa y síncrona, lo que simplifica la interacción con la base de datos (aunque en este proyecto se envolvió en Promesas para mantener el estilo asíncrono del backend).

3.  **Adaptación del Código en `src/db/DataBase.js`:**
    El archivo `src/db/DataBase.js` fue completamente reescrito para integrar la API de `better-sqlite3`. Esto incluyó cambiar la importación (`import Database from 'better-sqlite3';`) y adaptar los métodos de consulta (`.run()`, `.get()`, `.all()`, `.exec()`) para que funcionaran con la nueva librería, manteniendo la interfaz basada en Promesas para el resto de la aplicación.

4.  **Uso Exclusivo de `npm` para Gestión de Dependencias:**
    Aunque `pnpm` es un gestor de paquetes eficiente, las dificultades encontradas con la instalación de paquetes nativos y la integración de `windows-build-tools` llevaron a la decisión de utilizar `npm` como el gestor de paquetes principal para este proyecto (`npm install` y `npm dev`). Esto proporcionó una experiencia más consistente y fiable para la instalación y compilación de dependencias en el entorno de desarrollo.

Esta combinación de la provisión explícita de las herramientas de compilación correctas y la elección de una librería de base de datos (`better-sqlite3`) con una instalación más fiable, permitió la correcta inicialización de la base de datos SQLite y el funcionamiento estable del servidor Express en el entorno Windows con Node.js `v22.16.0`.

## Ejemplos de Solicitudes HTTP (con Thunder Client o Postman):

Para interactuar con la API y probar sus funcionalidades, puedes utilizar herramientas como [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) (una extensión para VS Code) o [Postman](https://www.postman.com/downloads/).

**Base URL:** `http://localhost:3000/api`

---

### 1. Registro de Usuario

* **Endpoint:** `/auth/register`
* **Método:** `POST`
* **Descripción:** Crea una nueva cuenta de usuario.
* **Body (raw, JSON):**
    ```json
    {
        "email": "nuevo.usuario@example.com",
        "password": "miContraseñaSegura123"
    }
    ```
* **Respuesta Exitosa (201 Created):**
    ```json
    {
        "message": "Usuario registrado exitosamente",
        "userId": 1,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
* **Notas:** Guarda el `token` devuelto. Lo necesitarás para las rutas protegidas.

---

### 2. Inicio de Sesión (Obtención del Token JWT)

* **Endpoint:** `/auth/login`
* **Método:** `POST`
* **Descripción:** Autentica un usuario existente y devuelve un token JWT.
* **Body (raw, JSON):**
    ```json
    {
        "email": "nuevo.usuario@example.com",
        "password": "miContraseñaSegura123"
    }
    ```
* **Respuesta Exitosa (200 OK):**
    ```json
    {
        "message": "Inicio de sesión exitoso",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
* **Notas:** Siempre usa este token para las solicitudes subsiguientes a rutas protegidas.

---

### 3. Creación de Categorías (Ruta Protegida)

* **Endpoint:** `/categories`
* **Método:** `POST`
* **Descripción:** Crea una nueva categoría de producto. Requiere autenticación.
* **Headers:**
    * `Authorization: Bearer <TU_TOKEN_JWT>` (Reemplaza `<TU_TOKEN_JWT>` con el token obtenido en el login/registro)
    * `Content-Type: application/json`
* **Body (raw, JSON):**
    ```json
    {
        "name": "Electrónica"
    }
    ```
* **Respuesta Exitosa (201 Created):**
    ```json
    {
        "message": "Categoría creada exitosamente",
        "category": {
            "id": 1,
            "name": "Electrónica",
            "createdAt": "2025-06-18T20:00:00Z",
            "updatedAt": "2025-06-18T20:00:00Z"
        }
    }
    ```

---

### 4. Creación de Productos (Ruta Protegida)

* **Endpoint:** `/products`
* **Método:** `POST`
* **Descripción:** Agregue un nuevo producto al catálogo. Requiere autenticación.
* **Headers:**
    * `Authorization: Bearer <TU_TOKEN_JWT>`
    * `Content-Type: application/json`
* **Body (raw, JSON):**
    ```json
    {
        "name": "Smartphone X",
        "description": "El último smartphone con cámara de alta resolución.",
        "price": 799.99,
        "imageUrl": "[http://example.com/images/smartphone-x.jpg](http://example.com/images/smartphone-x.jpg)",
        "categoryId": 1,
        "stock": 50
    }
    ```
* **Respuesta Exitosa (201 Created):**
    ```json
    {
        "message": "Producto creado exitosamente",
        "product": {
            "id": 1,
            "name": "Smartphone X",
            "description": "El último smartphone con cámara de alta resolución.",
            "price": 799.99,
            "imageUrl": "[http://example.com/images/smartphone-x.jpg](http://example.com/images/smartphone-x.jpg)",
            "categoryId": 1,
            "stock": 50,
            "createdAt": "2025-06-18T20:05:00Z",
            "updatedAt": "2025-06-18T20:05:00Z"
        }
    }
    ```
* **Notas:** Asegúrate de que `categoryId` exista.

---

### 5. Añadir Productos al Carrito (Ruta Protegida)

* **Endpoint:** `/cart/add`
* **Método:** `POST`
* **Descripción:** Agregue un producto al carrito del usuario autenticado o actualice su cantidad.
* **Headers:**
    * `Authorization: Bearer <TU_TOKEN_JWT>`
    * `Content-Type: application/json`
* **Body (raw, JSON):**
    ```json
    {
        "productId": 1,
        "quantity": 2
    }
    ```
* **Respuesta Exitosa (200 OK):**
    ```json
    {
        "message": "Producto(s) añadido(s) al carrito exitosamente",
        "cartItem": {
            "id": 1,
            "cartId": 1,
            "productId": 1,
            "quantity": 2,
            "createdAt": "2025-06-18T20:10:00Z",
            "updatedAt": "2025-06-18T20:10:00Z"
        }
    }
    ```

---

### 6. Realizar una Orden (Ruta Protegida)

* **Endpoint:** `/orders/checkout`
* **Método:** `POST`
* **Descripción:** Convierte el contenido del carrito del usuario autenticado en una nueva orden. El carrito se vacía después de la orden.
* **Headers:**
    * `Authorization: Bearer <TU_TOKEN_JWT>`
    * `Content-Type: application/json`
* **Body:** `{}` (No se requiere cuerpo, la orden se crea a partir del carrito del usuario autenticado)
* **Respuesta Exitosa (201 Created):**
    ```json
    {
        "message": "Orden creada exitosamente",
        "order": {
            "id": 1,
            "userId": 1,
            "total": 1599.98,
            "status": "pending",
            "createdAt": "2025-06-18T20:15:00Z",
            "updatedAt": "2025-06-18T20:15:00Z"
        },
        "orderItems": [
            {
                "id": 1,
                "orderId": 1,
                "productId": 1,
                "quantity": 2,
                "priceAtOrder": 799.99,
                "createdAt": "2025-06-18T20:15:00Z",
                "updatedAt": "2025-06-18T20:15:00Z"
            }
        ]
    }
    ```

## Estructura del Proyecto:

El proyecto sigue una estructura modular y organizada para facilitar la comprensión y el mantenimiento del código. La lógica principal de la API reside en el directorio `src/`, que se divide en las siguientes carpetas:

* **`src/controllers`**: Contiene la lógica de negocio principal para cada endpoint de la API. Aquí se manejan las solicitudes HTTP, se interactúa con los modelos y se preparan las respuestas. Es el "cerebro" que coordina las operaciones.
* **`src/models`**: Define los esquemas de la base de datos y encapsula la lógica de interacción directa con las tablas. Cada archivo de modelo (`user.model.js`, `product.model.js`, etc.) representa una entidad de la base de datos y sus métodos para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar).
* **`src/routes`**: Define las rutas de la API, mapeando las URL a las funciones de los controladores. Es el "mapa" que guía las solicitudes entrantes a la lógica adecuada. Aquí también se aplican los middlewares de autenticación y autorización a las rutas protegidas.
* **`src/db`**: Contiene la configuración y la lógica de conexión a la base de datos. Incluye el archivo `DataBase.js` (para la conexión con `better-sqlite3`) y `init-db.js` (para la inicialización y creación de tablas de la base de datos).
* **`src/middleware`**: Almacena funciones middleware que se ejecutan antes de que las solicitudes lleguen a los controladores. Incluye la lógica para la autenticación de usuarios (verificación de tokens JWT), autorización basada en roles (si se implementa) y otras funciones que procesan las solicitudes.


