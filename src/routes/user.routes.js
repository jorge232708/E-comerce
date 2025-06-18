// src/routes/user.routes.js

import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js'; // Importamos el middleware de autenticación

const router = Router();

/**
 * @swagger
 * tags:
 * name: Users
 * description: Operaciones relacionadas con los usuarios.
 */

/**
 * @swagger
 * /api/users/{id}:
 * get:
 * summary: Obtiene los detalles de un usuario por su ID.
 * tags: [Users]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: ID del usuario.
 * responses:
 * 200:
 * description: Detalles del usuario.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/User'
 * 401:
 * description: No autorizado (token no proporcionado o inválido).
 * 403:
 * description: Prohibido (no tiene permisos para acceder a este recurso, o no es el propio usuario).
 * 404:
 * description: Usuario no encontrado.
 * 500:
 * description: Error del servidor.
 */
router.get('/:id', authenticateToken, userController.getUserById);

/**
 * @swagger
 * /api/users/{id}:
 * put:
 * summary: Actualiza los detalles de un usuario por su ID.
 * tags: [Users]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: ID del usuario a actualizar.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * format: email
 * description: Nuevo correo electrónico del usuario.
 * password:
 * type: string
 * description: Nueva contraseña del usuario (se recomienda pasar solo si se va a cambiar).
 * example:
 * email: "nuevo.email@ejemplo.com"
 * password: "nuevaContraseñaSegura"
 * responses:
 * 200:
 * description: Usuario actualizado exitosamente.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/User'
 * 400:
 * description: Datos de entrada inválidos.
 * 401:
 * description: No autorizado.
 * 403:
 * description: Prohibido (no tiene permisos o no es el propio usuario).
 * 404:
 * description: Usuario no encontrado.
 * 500:
 * description: Error del servidor.
 */
router.put('/:id', authenticateToken, userController.updateUser);

// Puedes añadir más rutas si lo necesitas, por ejemplo, para eliminar un usuario (requiere rol de admin)
/**
 * @swagger
 * /api/users/{id}:
 * delete:
 * summary: Elimina un usuario por su ID (requiere rol de administrador).
 * tags: [Users]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: ID del usuario a eliminar.
 * responses:
 * 204:
 * description: Usuario eliminado exitosamente (No Content).
 * 401:
 * description: No autorizado.
 * 403:
 * description: Prohibido (no tiene rol de administrador).
 * 404:
 * description: Usuario no encontrado.
 * 500:
 * description: Error del servidor.
 */
// router.delete('/:id', authenticateToken, authorizeRole(['admin']), userController.deleteUser);


export default router;