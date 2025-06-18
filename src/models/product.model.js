// src/models/product.model.js

import { getDb } from '../db/database.js'; // Importamos la función para obtener la instancia de la DB

/**
 * @swagger
 * components:
 * schemas:
 * Product:
 * type: object
 * required:
 * - id
 * - name
 * - price
 * - stock
 * - categoryId
 * properties:
 * id:
 * type: number
 * description: ID único del producto.
 * example: 1
 * readOnly: true
 * name:
 * type: string
 * description: Nombre del producto.
 * example: "Auriculares Inalámbricos Pro"
 * description:
 * type: string
 * description: Descripción detallada del producto.
 * example: "Sonido de alta fidelidad con cancelación de ruido."
 * price:
 * type: number
 * format: float
 * description: Precio del producto.
 * example: 99.99
 * imageUrl:
 * type: string
 * format: url
 * description: URL de la imagen principal del producto.
 * example: "https://ejemplo.com/imagenes/auriculares.jpg"
 * categoryId:
 * type: number
 * description: ID de la categoría a la que pertenece el producto.
 * example: 101
 * stock:
 * type: integer
 * description: Cantidad de unidades disponibles en stock.
 * example: 200
 * createdAt:
 * type: string
 * format: date-time
 * description: Marca de tiempo de creación del producto.
 * example: "2023-10-27T10:00:00Z"
 * updatedAt:
 * type: string
 * format: date-time
 * description: Marca de tiempo de la última actualización del producto.
 * example: "2023-10-27T10:30:00Z"
 *
 * ProductInput: # Esquema para la entrada de datos al crear/actualizar un producto
 * type: object
 * required:
 * - name
 * - price
 * - stock
 * - categoryId
 * properties:
 * name:
 * type: string
 * description: Nombre del producto.
 * example: "Auriculares Inalámbricos Pro"
 * description:
 * type: string
 * description: Descripción detallada del producto.
 * example: "Sonido de alta fidelidad con cancelación de ruido."
 * price:
 * type: number
 * format: float
 * description: Precio del producto.
 * example: 99.99
 * imageUrl:
 * type: string
 * format: url
 * description: URL de la imagen principal del producto.
 * example: "https://ejemplo.com/imagenes/auriculares.jpg"
 * categoryId:
 * type: number
 * description: ID de la categoría a la que pertenece el producto.
 * example: 101
 * stock:
 * type: integer
 * description: Cantidad de unidades disponibles en stock.
 * example: 200
 */

/**
 * @typedef {object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} [description]
 * @property {number} price
 * @property {string} [imageUrl]
 * @property {number} [categoryId]
 * @property {number} stock
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * Obtiene todos los productos de la base de datos.
 * @returns {Promise<Product[]>} Una promesa que resuelve con un array de productos.
 */
export const getAllProducts = async () => {
  const db = getDb();
  // `db.all()` recupera todas las filas que coinciden con la consulta.
  return await db.all('SELECT * FROM products');
};

/**
 * Obtiene un producto por su ID.
 * @param {number} id - El ID del producto.
 * @returns {Promise<Product | undefined>} Una promesa que resuelve con el producto o undefined si no se encuentra.
 */
export const getProductById = async (id) => {
  const db = getDb();
  // `db.get()` recupera la primera fila que coincide con la consulta.
  return await db.get('SELECT * FROM products WHERE id = ?', id);
};

/**
 * Añade un nuevo producto a la base de datos.
 * @param {object} productData - Los datos del producto.
 * @param {string} productData.name
 * @param {string} [productData.description]
 * @param {number} productData.price
 * @param {string} [productData.imageUrl]
 * @param {number} [productData.categoryId]
 * @param {number} productData.stock
 * @returns {Promise<Product>} Una promesa que resuelve con el producto insertado (incluyendo su ID).
 */
export const addProduct = async ({ name, description, price, imageUrl, categoryId, stock }) => {
  const db = getDb();
  // `db.run()` ejecuta una consulta que no devuelve filas (INSERT, UPDATE, DELETE).
  // Retorna un objeto con `lastID` (el ID de la última fila insertada) y `changes` (número de filas afectadas).
  const result = await db.run(
    `INSERT INTO products (name, description, price, imageUrl, categoryId, stock)
     VALUES (?, ?, ?, ?, ?, ?)`,
    name, description, price, imageUrl, categoryId, stock
  );

  // Recuperamos el producto completo recién insertado para devolverlo
  // Esto es útil porque la base de datos asigna `createdAt` y `updatedAt`.
  return await getProductById(result.lastID);
};

/**
 * Actualiza un producto existente en la base de datos.
 * @param {number} id - El ID del producto a actualizar.
 * @param {object} updates - Un objeto con los campos a actualizar y sus nuevos valores.
 * @returns {Promise<number>} Una promesa que resuelve con el número de filas afectadas (0 si no se encontró el producto, 1 si se actualizó).
 */
export const updateProductById = async (id, updates) => {
  const db = getDb();
  const fields = [];
  const values = [];

  // Construir dinámicamente la consulta UPDATE basada en los campos proporcionados
  for (const key in updates) {
    if (updates.hasOwnProperty(key)) { // Asegurarse de que la propiedad es propia del objeto
      // Evitar que el ID o timestamps sean actualizados por el input
      if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    }
  }

  if (fields.length === 0) {
    return 0; // No hay campos para actualizar
  }

  values.push(id); // Añadir el ID al final para la cláusula WHERE

  const result = await db.run(
    `UPDATE products SET ${fields.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );

  return result.changes; // Retorna el número de filas afectadas
};

/**
 * Elimina un producto de la base de datos por su ID.
 * @param {number} id - El ID del producto a eliminar.
 * @returns {Promise<number>} Una promesa que resuelve con el número de filas eliminadas (0 si no se encontró, 1 si se eliminó).
 */
export const deleteProductById = async (id) => {
  const db = getDb();
  const result = await db.run('DELETE FROM products WHERE id = ?', id);
  return result.changes; // Retorna el número de filas eliminadas
};