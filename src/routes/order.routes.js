// src/routes/order.routes.js (EJEMPLO - adapta a tus rutas reales)

import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js'; // ✅ ¡Corregido!
import { createOrder, getOrders } from '../controllers/order.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Órdenes
 * description: Operaciones relacionadas con las órdenes de compra de los usuarios.
 */

/**
 * @swagger
 * /orders:
 * post:
 * summary: Crear una nueva orden
 * description: Crea una orden a partir del contenido del carrito del usuario autenticado y vacía el carrito.
 * tags: [Órdenes]
 * security:
 * - bearerAuth: []
 * responses:
 * 201:
 * description: Orden creada exitosamente.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Order'
 * 400:
 * description: El carrito está vacío.
 * 401:
 * description: No autorizado.
 * 500:
 * description: Error del servidor.
 */
router.post('/', authenticateToken, createOrder);

/**
 * @swagger
 * /orders:
 * get:
 * summary: Obtener órdenes del usuario
 * description: Recupera todas las órdenes realizadas por el usuario autenticado.
 * tags: [Órdenes]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de órdenes obtenida exitosamente.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Order'
 * 401:
 * description: No autorizado.
 * 500:
 * description: Error del servidor.
 */
router.get('/', authenticateToken, getOrders);

export default router;