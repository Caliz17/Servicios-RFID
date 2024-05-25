import express from 'express';

import Clientes from './routes/Clientes.routes.js';
import Auditorias from './routes/Auditoria.routes.js';
import Cuentas from './routes/Cuenta.routes.js';
import PagoServicios from './routes/PagoServicio.routes.js';
import RolUsuario from './routes/RolUsuario.routes.js';
import TarjetaRfid from './routes/TarjetaRfid.route.js';
import TipoCuenta from './routes/TipoCuenta.routes.js';
import TipoServicio from './routes/TipoServicio.routes.js';
import Transferencia from './routes/Transferencia.routes.js';
import Usuario from './routes/Usuario.routes.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api', Clientes);
app.use('/api', Auditorias);
app.use('/api', Cuentas);
app.use('/api', PagoServicios);
app.use('/api', RolUsuario);
app.use('/api', TarjetaRfid);
app.use('/api', TipoCuenta);
app.use('/api', TipoServicio);
app.use('/api', Transferencia);
app.use('/api', Usuario);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
