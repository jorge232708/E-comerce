// src/config/swagger.js

const swaggerOptions = {
  // La propiedad principal debe ser 'swaggerDefinition'
  swaggerDefinition: {
    openapi: '3.0.0', // Especifica la versión de OpenAPI que estás usando
    info: {
      title: 'API de E-commerce con Node.js', // Título más específico
      version: '1.0.0',
      description: 'Documentación de la API para un proyecto de E-commerce. Incluye gestión de productos, usuarios, carritos y órdenes.', // Descripción más completa
      contact: {
        name: 'Soporte de API - Jorge Barbeito', // Nombre del autor
        url: 'https://github.com/tu-usuario-github/e-commerce-api', // URL a tu repositorio o proyecto
        email: 'soporte@ejemplo.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api', // Ruta base para todas tus rutas (ej. /api/products, /api/auth)
        description: 'Servidor de Desarrollo Local',
      },
      // Puedes añadir más servidores aquí, por ejemplo, para producción o staging:
      // {
      //   url: 'https://api.tu-dominio.com/api', // Ejemplo para producción
      //   description: 'Servidor de Producción',
      // },
    ],
    // Habilitar la seguridad JWT globalmente en la documentación
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Indica que se usará JSON Web Tokens
          description: 'Introduce tu token JWT aquí para acceder a endpoints protegidos. Ejemplo: `Bearer <token>`',
        },
      },
      // Aquí puedes añadir más schemas si no los defines directamente en los modelos/controladores.
      // Pero ya los estamos definiendo con @typedef en los controladores,
      // así que swagger-jsdoc los encontrará si los incluyes en 'apis'.
    },
    // Si quieres que TODOS los endpoints requieran autenticación por defecto (puedes sobrescribir por endpoint)
    // security: [
    //   {
    //     bearerAuth: [],
    //   },
    // ],
  },
  // Rutas a los archivos donde swagger-jsdoc buscará los comentarios JSDoc.
  // Es crucial que estas rutas sean correctas y que incluyan todos los lugares con `@swagger` y `@typedef`.
  apis: [
    './src/routes/*.js',       // Lee todos los archivos .js en la carpeta 'routes'
    './src/models/*.js',       // Lee todos los archivos .js en la carpeta 'models' para los esquemas de modelos (@typedef)
    './src/controllers/*.js',  // ¡Importante! Lee todos los archivos .js en 'controllers' para los `@typedef` de request/response bodies (ej. UserCredentials, Cart, Order)
  ],
};

export default swaggerOptions;