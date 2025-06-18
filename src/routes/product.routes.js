// src/routes/product.routes.js

import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js'; // Asegúrate de la extensión .js

// Importa directamente las funciones del controlador
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js'; // Asegúrate de la extensión .js

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Productos
 * description: Operaciones relacionadas con los productos de la tienda de e-commerce.
 */

/**
 * @swagger
 * /products:
 * get:
 * summary: Obtener todos los productos
 * description: Recupera una lista de todos los productos disponibles en el e-commerce.
 * tags: [Productos]
 * responses:
 * 200:
 * description: Lista de productos obtenida exitosamente.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Product'
 * 500:
 * description: Error del servidor.
 */
router.get('/', (req, res, next) => {
  try {
    getProducts(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /products/{id}:
 * get:
 * summary: Obtener un producto por ID
 * description: Recupera los detalles de un producto específico usando su ID.
 * tags: [Productos]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: number # ¡Cambiado de 'string' a 'number' aquí!
 * # format: int64 # Opcional, si quieres especificar un formato de entero largo
 * required: true
 * description: ID único del producto a recuperar.
 * responses:
 * 200:
 * description: Detalles del producto obtenidos exitosamente.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Product'
 * 404:
 * description: Producto no encontrado.
 * 500:
 * description: Error del servidor.
 */
router.get('/:id', (req, res, next) => {
  try {
    getProductById(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /products:
 * post:
 * summary: Crear un nuevo producto
 * description: Añade un nuevo producto a la base de datos de la tienda.
 * tags: [Productos]
 * security:
 * - bearerAuth: [] # Si tienes autenticación JWT, para indicar que el endpoint está protegido
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ProductInput' # Referencia al esquema de entrada para crear producto
 * responses:
 * 201:
 * description: Producto creado exitosamente.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Product'
 * 400:
 * description: Datos de producto inválidos.
 * 401:
 * description: No autorizado (token no proporcionado o inválido).
 * 500:
 * description: Error del servidor.
 */
router.post('/', authenticateToken, (req, res, next) => {
  try {
    createProduct(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /products/{id}:
 * put:
 * summary: Actualizar un producto existente
 * description: Actualiza los detalles de un producto específico usando su ID.
 * tags: [Productos]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: number # ¡Cambiado de 'string' a 'number' aquí!
 * # format: int64 # Opcional, si quieres especificar un formato de entero largo
 * required: true
 * description: ID único del producto a actualizar.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ProductInput' # Referencia al esquema de entrada para actualizar producto
 * responses:
 * 200:
 * description: Producto actualizado exitosamente.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Product'
 * 400:
 * description: Datos de producto inválidos.
 * 401:
 * description: No autorizado.
 * 404:
 * description: Producto no encontrado.
 * 500:
 * description: Error del servidor.
 */
router.put('/:id', authenticateToken, (req, res, next) => {
  try {
    updateProduct(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /products/{id}:
 * delete:
 * summary: Eliminar un producto
 * description: Elimina un producto específico de la base de datos usando su ID.
 * tags: [Productos]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: number # ¡Cambiado de 'string' a 'number' aquí!
 * # format: int64 # Opcional, si quieres especificar un formato de entero largo
 * required: true
 * description: ID único del producto a eliminar.
 * responses:
 * 204:
 * description: Producto eliminado exitosamente (No Content).
 * 401:
 * description: No autorizado.
 * 404:
 * description: Producto no encontrado.
 * 500:
 * description: Error del servidor.
 */
router.delete('/:id', authenticateToken, (req, res, next) => {
  try {
    deleteProduct(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;