// src/models/user.model.js

import { getDb } from '../db/database.js'; // Importamos la función para obtener la instancia de la DB

/**
 * @typedef {object} User
 * @property {number} id - ID único del usuario.
 * @property {string} email - Correo electrónico del usuario (único).
 * @property {string} password - Contraseña hasheada del usuario.
 */

/**
 * Busca un usuario en la base de datos por su correo electrónico.
 * @param {string} email - El correo electrónico del usuario a buscar.
 * @returns {Promise<User | undefined>} El objeto de usuario si se encuentra, o undefined si no.
 */
export const findUserByEmail = async (email) => { // Función asíncrona
  const db = getDb(); // Obtenemos la instancia de la base de datos
  // Usamos db.get() para obtener una sola fila, y await porque es una operación asíncrona
  return await db.get('SELECT id, email, password FROM users WHERE email = ?', email);
};

/**
 * Añade un nuevo usuario a la base de datos.
 * La contraseña debe ser un hash (no texto plano).
 * @param {string} email - El correo electrónico del nuevo usuario.
 * @param {string} hashedPassword - La contraseña del usuario ya hasheada.
 * @returns {Promise<User>} El objeto del nuevo usuario con su ID generado.
 */
export const addUser = async (email, hashedPassword) => { // Función asíncrona
  const db = getDb(); // Obtenemos la instancia de la base de datos
  // Usamos db.run() para ejecutar una consulta que no devuelve filas (INSERT, UPDATE, DELETE)
  // await es necesario porque db.run() devuelve una Promesa
  const result = await db.run('INSERT INTO users (email, password) VALUES (?, ?)', email, hashedPassword);
  // 'result.lastID' es la propiedad que devuelve el ID de la última fila insertada con sqlite3/sqlite
  return { id: result.lastID, email, password: hashedPassword };
};

/**
 * Busca un usuario en la base de datos por su ID.
 * @param {number} id - El ID del usuario a buscar.
 * @returns {Promise<User | undefined>} El objeto de usuario si se encuentra, o undefined si no.
 */
export const findUserById = async (id) => { // Función asíncrona
  const db = getDb(); // Obtenemos la instancia de la base de datos
  // Usamos db.get() para obtener una sola fila
  return await db.get('SELECT id, email, password FROM users WHERE id = ?', id);
};