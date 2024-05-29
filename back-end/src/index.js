import express from 'express';
import { specs, swaggerUi } from './swaggerConfig.js';

import Clientes from './routes/Clientes.routes.js';
import Auditorias from './routes/Auditoria.routes.js'; // Asegúrate de que esta ruta esté correctamente importada
import Cuentas from './routes/Cuenta.routes.js';
import PagoServicios from './routes/PagoServicio.routes.js';
import RolUsuario from './routes/RolUsuario.routes.js';
import TarjetaRfid from './routes/TarjetaRfid.route.js';
import TipoCuenta from './routes/TipoCuenta.routes.js';
import TipoServicio from './routes/TipoServicio.routes.js';
import Transferencia from './routes/Transferencia.routes.js';
import Usuario from './routes/Usuario.routes.js';

const app = express();
const port = 3001;

app.use(express.json());

// Swagger documentation route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api', Clientes);
app.use('/api', Auditorias); // Asegúrate de que esta línea esté presente
app.use('/api', Cuentas);
app.use('/api', PagoServicios);
app.use('/api', RolUsuario);
app.use('/api', TarjetaRfid);
app.use('/api', TipoCuenta);
app.use('/api', TipoServicio);
app.use('/api', Transferencia);
app.use('/api', Usuario);

// inicio bienvenida en la ruta raiz
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido a la API de la aplicación de pagos</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          color: #333;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          text-align: center;
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #4CAF50;
        }
        p {
          font-size: 1.2em;
        }
        .button {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          font-size: 1em;
          color: #fff;
          background-color: #4CAF50;
          text-decoration: none;
          border-radius: 5px;
          transition: background-color 0.3s;
        }
        .button:hover {
          background-color: #45a049;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>¡Bienvenido a la API de la aplicación de gestion de Servicios!</h1>
        <p>Estamos encantados de tenerte aquí. Explora nuestra API para gestionar tus pagos de manera eficiente y segura.</p>
        <a href="/docs" class="button">Ver Documentación</a>
      </div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
