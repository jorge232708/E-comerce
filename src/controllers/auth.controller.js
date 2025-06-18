// src/controllers/auth.controller.js

// Importaciones necesarias, asegurando las extensiones .js
// findUserByEmail y addUser ahora son asíncronas
import { findUserByEmail, addUser } from '../models/user.model.js';
import { generateToken } from '../utils/jwt.utils.js';
import bcrypt from 'bcrypt'; // Importamos bcrypt

/**
 * @typedef {object} UserCredentials
 * @property {string} email - Correo electrónico del usuario.
 * @property {string} password - Contraseña del usuario.
 */

/**
 * @typedef {object} AuthResponse
 * @property {string} token - Token de autenticación JWT.
 */

/**
 * Registra un nuevo usuario en el sistema.
 * @param {object} req - Objeto de petición de Express (contiene body con email y password).
 * @param {object} res - Objeto de respuesta de Express.
 */
export const register = async (req, res) => {
  const { email, password } = req.body;

  // Validación básica
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
  }

  try {
    // Usamos await porque findUserByEmail ahora es asíncrona
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario con este correo ya existe.' }); // 409 Conflict
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10); 
    
    // Usamos await porque addUser ahora es asíncrona
    const user = await addUser(email, hashedPassword); 

    // Generamos el token de autenticación
    const token = generateToken(user.id);

    // Respuesta exitosa
    res.status(201).json({ token }); // 201 Created
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    // Aseguramos que la respuesta de error sea clara, incluso si es un error de DB
    res.status(500).json({ message: 'Error interno del servidor al registrar usuario.' });
  }
};

/**
 * Inicia sesión de un usuario y devuelve un token de autenticación.
 * @param {object} req - Objeto de petición de Express (contiene body con email y password).
 * @param {object} res - Objeto de respuesta de Express.
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validación básica
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
  }

  try {
    // Usamos await porque findUserByEmail ahora es asíncrona
    const user = await findUserByEmail(email);

    // Si el usuario no existe
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' }); // 401 Unauthorized
    }

    // Comparamos la contraseña proporcionada con la contraseña hasheada almacenada
    const isPasswordValid = await bcrypt.compare(password, user.password); 

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas.' }); // 401 Unauthorized
    }

    // Generamos el token de autenticación
    const token = generateToken(user.id);

    // Respuesta exitosa
    res.json({ token }); // 200 OK por defecto
  } catch (error) {
    console.error('Error al intentar iniciar sesión:', error);
    // Aseguramos que la respuesta de error sea clara
    res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
  }
};