import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Gestion de Servicios API',
        version: '1.0.0',
        description: 'API para gestionar servicios de pagos',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Servidor local'
        },
    ],
};

// Opciones para Swagger
const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.js'], // Ajusta la ruta aquí
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
