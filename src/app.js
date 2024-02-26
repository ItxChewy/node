import express from 'express';
import morgan from 'morgan';
import cocheRoutes from './routes/coche.routes';
import marcaRoutes from './routes/marca.routes';
import multer from 'multer';

const app = express();

const upload = multer({ dest: './static/img' });

app.set('port', 4000);

app.use(morgan('dev'));
app.use(express.json());

// Rutas específicas de imágenes
app.use('/static/images', express.static('./static/img'));

// Rutas de la aplicación
app.use('/api/coches', cocheRoutes);
app.use('/api/marca', marcaRoutes);

export default app;
