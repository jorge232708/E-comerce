// src/controllers/user.controller.js

import * as userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { getDb } from '../db/database.js'; // Necesario para transacciones si se implementan más tarde

/**
 * @swagger
 * components:
 * schemas:
 * UserProfile:
 * type: object
 * properties:
 * id:
 * type: integer
 * description: El ID del usuario.
 * example: 1
 * email:
 * type: string
 * format: email
 * description: El correo electrónico del usuario.
 * example: "usuario@ejemplo.com"
 * createdAt:
 * type: string
 * format: date-time
 * description: Fecha y hora de creación del usuario.
 * updatedAt:
 * type: string
 * format: date-time
 * description: Última fecha y hora de actualización del usuario.
 */

/**
 * Obtiene los detalles de un usuario por su ID.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
export const getUserById = async (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id, 10);

  // Verificación de autorización: Un usuario solo puede ver su propio perfil
  // o un administrador puede ver cualquier perfil.
  // req.user.id viene del middleware authenticateToken
  if (req.user.id !== userId /* && (!req.user.role || req.user.role !== 'admin') */) {
    return res.status(403).json({ message: 'Acceso denegado. No tiene permisos para ver este perfil.' });
  }

  try {
    const user = await userModel.findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // No devolver la contraseña hasheada en la respuesta por seguridad
    const { password, ...userProfile } = user;
    res.status(200).json(userProfile);
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${userId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener el usuario.', error: error.message });
  }
};

/**
 * Actualiza los detalles de un usuario.
 * Permite actualizar email y/o password.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id, 10);
  const { email, password } = req.body;

  // Verificación de autorización: Un usuario solo puede actualizar su propio perfil.
  // Los administradores podrían tener una ruta separada o un middleware de rol.
  if (req.user.id !== userId /* && (!req.user.role || req.user.role !== 'admin') */) {
    return res.status(403).json({ message: 'Acceso denegado. No tiene permisos para actualizar este perfil.' });
  }

  try {
    const updates = {};
    if (email) {
      // Opcional: Validar formato de email aquí
      // También podrías verificar si el nuevo email ya está en uso por otro usuario
      const existingUserWithEmail = await userModel.findUserByEmail(email);
      if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
        return res.status(400).json({ message: 'El correo electrónico ya está en uso por otro usuario.' });
      }
      updates.email = email;
    }
    if (password) {
      // Opcional: Validar complejidad de la contraseña aquí
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron datos para actualizar.' });
    }

    // Primero, verificar si el usuario existe antes de intentar actualizarlo
    const userExists = await userModel.findUserById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const changes = await getDb().run(
      `UPDATE users SET ${Object.keys(updates).map(key => `${key} = ?`).join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      ...Object.values(updates), userId
    );

    if (changes.changes === 0) {
      // Esto podría indicar que el ID no existe (aunque ya lo verificamos) o que los datos son los mismos
      return res.status(400).json({ message: 'No se realizaron cambios en el perfil del usuario.' });
    }

    // Obtener el usuario actualizado para devolverlo (sin la contraseña)
    const updatedUser = await userModel.findUserById(userId);
    const { password: updatedPassword, ...userProfile } = updatedUser;
    res.status(200).json({ message: 'Perfil actualizado exitosamente.', user: userProfile });

  } catch (error) {
    console.error(`Error al actualizar usuario con ID ${userId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar el usuario.', error: error.message });
  }
};

/**
 * Elimina un usuario por su ID.
 * Esta función generalmente requeriría un middleware de autorización que verifique un rol de 'admin'.
 * Se deja aquí como esqueleto y para la definición Swagger.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id, 10);

  // Considerar agregar aquí un middleware de autorización: authorizeRole(['admin'])
  // if (req.user.role !== 'admin') {
  //   return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  // }

  try {
    const changes = await getDb().run('DELETE FROM users WHERE id = ?', userId);

    if (changes.changes === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado para eliminar.' });
    }

    // 204 No Content - La petición fue exitosa y no hay contenido que devolver.
    res.status(204).send();
  } catch (error) {
    console.error(`Error al eliminar usuario con ID ${userId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar el usuario.', error: error.message });
  }
};