// src/routes/cart.routes.js (EJEMPLO - adapta a tus rutas reales)

import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js'; // 
import { getCart, addToCart, removeFromCart, clearCart } from '../controllers/cart.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Carrito
 * description: Operaciones relacionadas con el carrito de compras.
 */

/**
 * @swagger
 * /cart:
 * get:
 * summary: Obtener el carrito del usuario
 * description: Recupera el contenido del carrito de compras del usuario autenticado.
 * tags: [Carrito]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Carrito obtenido exitosamente.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Cart'
 * 401:
 * description: No autorizado.
 * 500:
 * description: Error del servidor.
 */
router.get('/', authenticateToken, getCart);

/**
 * @swagger
 * /cart:
 * post:
 * summary: Añadir producto al carrito
 * description: Añade un producto al carrito del usuario autenticado o incrementa su cantidad si ya existe.
 * tags: [Carrito]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AddToCartInput'
 * responses:
 * 200:
 * description: Producto añadido/actualizado exitosamente en el carrito.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Cart'
 * 400:
 * description: Datos de entrada inválidos.
 * 401:
 * description: No autorizado.
 * 500:
 * description: Error del servidor.
 */
router.post('/', authenticateToken, addToCart);

// ... y así sucesivamente para removeFromCart y clearCart ...

export default router;