// src/models/category.model.js

import { getDb } from '../db/database.js'; // Importamos la función para obtener la instancia de la DB

/**
 * @swagger
 * components:
 * schemas:
 * Category:
 * type: object
 * required:
 * - id
 * - name
 * properties:
 * id:
 * type: number
 * description: ID único de la categoría.
 * example: 1
 * readOnly: true
 * name:
 * type: string
 * description: Nombre de la categoría (debe ser único).
 * example: "Electrónica"
 * createdAt:
 * type: string
 * format: date-time
 * description: Marca de tiempo de creación de la categoría.
 * example: "2023-10-27T10:00:00Z"
 * updatedAt:
 * type: string
 * format: date-time
 * description: Marca de tiempo de la última actualización de la categoría.
 * example: "2023-10-27T10:30:00Z"
 * CategoryInput:
 * type: object
 * required:
 * - name
 * properties:
 * name:
 * type: string
 * description: Nombre de la nueva categoría.
 * example: "Hogar y Cocina"
 */

/**
 * @typedef {object} Category
 * @property {number} id
 * @property {string} name
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * Obtiene todas las categorías de la base de datos.
 * @returns {Promise<Category[]>} Una promesa que resuelve con un array de categorías.
 */
export const getAllCategories = async () => {
  const db = getDb();
  return await db.all('SELECT * FROM categories');
};

/**
 * Obtiene una categoría por su ID.
 * @param {number} id - El ID de la categoría.
 * @returns {Promise<Category | undefined>} Una promesa que resuelve con la categoría o undefined si no se encuentra.
 */
export const getCategoryById = async (id) => {
  const db = getDb();
  return await db.get('SELECT * FROM categories WHERE id = ?', id);
};

/**
 * Obtiene una categoría por su nombre (útil para verificar duplicados).
 * @param {string} name - El nombre de la categoría.
 * @returns {Promise<Category | undefined>} Una promesa que resuelve con la categoría o undefined si no se encuentra.
 */
export const getCategoryByName = async (name) => {
  const db = getDb();
  return await db.get('SELECT * FROM categories WHERE name = ?', name);
};

/**
 * Añade una nueva categoría a la base de datos.
 * @param {string} name - El nombre de la categoría.
 * @returns {Promise<Category>} Una promesa que resuelve con la categoría insertada (incluyendo su ID).
 * @throws {Error} Si la categoría con el mismo nombre ya existe.
 */
export const addCategory = async (name) => {
  const db = getDb();
  
  // Opcional: Verificar si ya existe una categoría con ese nombre antes de insertar
  const existingCategory = await getCategoryByName(name);
  if (existingCategory) {
    throw new Error(`La categoría con el nombre '${name}' ya existe.`);
  }

  const result = await db.run(
    `INSERT INTO categories (name) VALUES (?)`,
    name
  );

  return await getCategoryById(result.lastID);
};

/**
 * Actualiza una categoría existente en la base de datos.
 * @param {number} id - El ID de la categoría a actualizar.
 * @param {string} newName - El nuevo nombre para la categoría.
 * @returns {Promise<number>} Una promesa que resuelve con el número de filas afectadas (0 si no se encontró, 1 si se actualizó).
 * @throws {Error} Si el nuevo nombre ya existe para otra categoría.
 */
export const updateCategoryById = async (id, newName) => {
  const db = getDb();

  // Opcional: Verificar si el nuevo nombre ya está tomado por otra categoría
  const existingCategoryWithName = await getCategoryByName(newName);
  if (existingCategoryWithName && existingCategoryWithName.id !== id) {
    throw new Error(`Ya existe otra categoría con el nombre '${newName}'.`);
  }

  const result = await db.run(
    `UPDATE categories SET name = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
    newName, id
  );

  return result.changes; // Retorna el número de filas afectadas
};

/**
 * Elimina una categoría de la base de datos por su ID.
 * @param {number} id - El ID de la categoría a eliminar.
 * @returns {Promise<number>} Una promesa que resuelve con el número de filas eliminadas (0 si no se encontró, 1 si se eliminó).
 */
export const deleteCategoryById = async (id) => {
  const db = getDb();
  const result = await db.run('DELETE FROM categories WHERE id = ?', id);
  return result.changes; // Retorna el número de filas eliminadas
};