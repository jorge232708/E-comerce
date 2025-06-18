// src/utils/jwt.utils.js

import jwt from 'jsonwebtoken';

// Secreto para firmar los tokens JWT.
// ¡ADVERTENCIA: Usa una variable de entorno segura en producción!
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_seguro';

/**
 * Genera un token JWT para un ID de usuario dado.
 * @param {number} userId - El ID del usuario para el cual se generará el token.
 * @returns {string} El token JWT generado.
 */
export const generateToken = (userId) => { // Eliminadas las anotaciones de tipo TypeScript
  // El token expirará en 1 hora (puedes ajustar este tiempo)
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Verifica un token JWT.
 * @param {string} token - El token JWT a verificar.
 * @returns {object | string} El payload decodificado del token si es válido, o un error si no.
 */
export const verifyToken = (token) => { // Eliminadas las anotaciones de tipo TypeScript
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // Si el token es inválido o expirado, la verificación lanzará un error.
    // Esto se manejará en el middleware de autenticación.
    throw new Error('Token inválido o expirado.');
  }
};