// src/index.js (tu archivo principal de entrada)

import express from 'express';
import dotenv from 'dotenv'; // Si usas variables de entorno
import cors from 'cors'; // Si usas CORS
// ... otras importaciones de middlewares globales si tienes

// --- Importaciones de la Base de Datos ---
import { connectDb, closeDb } from './db/database.js'; // Tu archivo DataBase.js
import { initializeDatabase } from './db/init-db.js'; // El NUEVO archivo que acabamos de crear

// --- Importaciones de Rutas ---
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js'; // Si ya tienes
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
//import categoryRoutes from './routes/category.routes.js'; // Si ya la tienes o cuando la crees

dotenv.config(); // Cargar variables de entorno al inicio

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares Globales ---
app.use(cors()); // Configura CORS según tus necesidades
app.use(express.json()); // Middleware para parsear JSON en el cuerpo de las peticiones

// --- Rutas de la API ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Si ya la tienes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/categories', categoryRoutes); // Descomentar cuando tengas tus rutas de categoría

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor de E-commerce de Zayana en funcionamiento.');
});

// --- Función para Iniciar el Servidor y la DB ---
const startApplication = async () => {
    try {
        // 1. Conectar a la base de datos
        await connectDb();
        console.log(' Conexión a la base de datos establecida.');

        // 2. Inicializar las tablas de la base de datos (crearlas si no existen)
        await initializeDatabase(); 
        console.log(' Estructura de la base de datos verificada y lista.');

        // 3. Iniciar el servidor Express
        app.listen(PORT, () => {
            console.log(` Servidor escuchando en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error(' Error FATAL al iniciar la aplicación:', error);
        closeDb(); // Asegurarse de cerrar la conexión si algo falló
        process.exit(1); // Salir de la aplicación con un código de error
    }
};

// Iniciar la aplicación
startApplication();