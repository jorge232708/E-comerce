// src/routes/auth.routes.js (EJEMPLO - necesitas adaptarlo a tu código real)
import express from 'express';
import { register, login } from '../controllers/auth.controller.js'; // Asegúrate de la extensión .js

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Autenticación
 * description: Gestión de usuarios y autenticación.
 */

/**
 * @swagger
 * /auth/register:
 * post:
 * summary: Registrar un nuevo usuario
 * description: Permite a un nuevo usuario crear una cuenta con email y contraseña.
 * tags: [Autenticación]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserCredentials' # Referencia a tu @typedef
 * responses:
 * 201:
 * description: Usuario registrado exitosamente.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AuthResponse' # Referencia a tu @typedef
 * 400:
 * description: Datos de entrada inválidos (ej. email o contraseña faltantes).
 * 409:
 * description: El usuario con este correo ya existe.
 * 500:
 * description: Error del servidor.
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 * post:
 * summary: Iniciar sesión
 * description: Autentica a un usuario y devuelve un token JWT.
 * tags: [Autenticación]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserCredentials' # Referencia a tu @typedef
 * responses:
 * 200:
 * description: Inicio de sesión exitoso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AuthResponse' # Referencia a tu @typedef
 * 400:
 * description: Datos de entrada inválidos.
 * 401:
 * description: Credenciales inválidas.
 * 500:
 * description: Error del servidor.
 */
router.post('/login', login);

export default router;