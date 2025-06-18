// src/middleware/auth.middleware.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; // <--- ¡Asegúrate de importar dotenv si lo usas aquí!

dotenv.config(); // <--- ¡Carga las variables de entorno si no lo haces en index.js y las necesitas aquí!

// Secreto para firmar y verificar los tokens JWT.
// ¡ADVERTENCIA: En un entorno de producción, DEBES usar una variable de entorno segura
// y no un string hardcodeado como 'tu_secreto_seguro'!
const JWT_SECRET = process.env.JWT_SECRET || 'tu_super_secreto_para_jwt_aqui_bien_largo_y_complejo'; // Usa la del .env que te pedí

/**
 * Middleware de autenticación para verificar tokens JWT.
 * Adjunta la información del usuario decodificada (ej. user ID) a `req.user`.
 * @param {object} req - Objeto de petición de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware.
 */
export const authenticateToken = (req, res, next) => { // <--- ¡Cambiado de 'authenticate' a 'authenticateToken'!
  // Extrae el token del encabezado 'Authorization'.
  // Se espera un formato "Bearer TOKEN".
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // Si no hay token, deniega el acceso.
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token de autenticación.' });
  }

  try {
    // Verifica el token usando el secreto.
    // jwt.verify devuelve el payload decodificado si el token es válido.
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Adjunta la información decodificada del usuario a `req.user`.
    // Esto hace que `req.user` esté disponible en los controladores posteriores.
    req.user = decoded; 
    
    // Pasa el control al siguiente middleware o ruta.
    next();
  } catch (error) {
    // Si la verificación falla (token inválido, expirado, etc.), deniega el acceso.
    return res.status(403).json({ message: 'Token inválido o expirado.' }); // Cambiado a 403 Forbidden
  }
};