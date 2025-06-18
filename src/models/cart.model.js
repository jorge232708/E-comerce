// src/models/cart.model.js

import { getDb } from '../db/database.js'; // Importamos la función para obtener la instancia de la DB
import { getProductById } from './product.model.js'; // Necesitamos esto para verificar la existencia del producto

/**
 * @typedef {object} CartItemDetail
 * @property {number} id - ID del ítem en el carrito.
 * @property {number} cartId - ID del carrito al que pertenece.
 * @property {number} productId - ID del producto.
 * @property {number} quantity - Cantidad del producto en el carrito.
 * @property {string} productName - Nombre del producto.
 * @property {number} productPrice - Precio del producto.
 * @property {string} [productImageUrl] - URL de la imagen del producto.
 */

/**
 * @typedef {object} CartDetail
 * @property {number} id - ID único del carrito.
 * @property {number} userId - ID del usuario propietario del carrito.
 * @property {string} createdAt - Marca de tiempo de creación.
 * @property {string} updatedAt - Marca de tiempo de última actualización.
 * @property {Array<CartItemDetail>} items - Array de productos detallados en el carrito.
 */

/**
 * Busca un carrito por userId. Si no existe, lo crea.
 * @param {number} userId - ID del usuario.
 * @returns {Promise<object>} Una promesa que resuelve con el objeto del carrito (solo el registro de la tabla 'carts').
 */
export const findOrCreateCart = async (userId) => {
  const db = getDb();
  let cart = await db.get('SELECT * FROM carts WHERE userId = ?', userId);

  if (!cart) {
    const result = await db.run('INSERT INTO carts (userId) VALUES (?)', userId);
    cart = await db.get('SELECT * FROM carts WHERE id = ?', result.lastID);
  }
  return cart;
};

/**
 * Obtiene los detalles completos del carrito de un usuario, incluyendo los ítems y sus detalles de producto.
 * @param {number} userId - ID del usuario.
 * @returns {Promise<CartDetail | undefined>} Una promesa que resuelve con los detalles del carrito o undefined si no hay carrito.
 */
export const getCartDetailsByUserId = async (userId) => {
  const db = getDb();

  // Primero, obtenemos el carrito principal
  const cart = await db.get('SELECT * FROM carts WHERE userId = ?', userId);
  if (!cart) {
    return undefined; // No hay carrito para este usuario
  }

  // Luego, obtenemos los ítems de ese carrito, uniendo con la tabla de productos para obtener detalles
  const items = await db.all(
    `SELECT
       ci.id,
       ci.cartId,
       ci.productId,
       ci.quantity,
       p.name AS productName,
       p.price AS productPrice,
       p.imageUrl AS productImageUrl
     FROM cart_items ci
     JOIN products p ON ci.productId = p.id
     WHERE ci.cartId = ?`,
    cart.id
  );

  return { ...cart, items };
};

/**
 * Añade o actualiza un producto en el carrito de un usuario.
 * @param {number} userId - ID del usuario.
 * @param {number} productId - ID del producto a añadir/actualizar.
 * @param {number} quantity - Cantidad a añadir (si el producto ya existe, se suma a la cantidad actual).
 * @returns {Promise<CartDetail>} Una promesa que resuelve con los detalles actualizados del carrito.
 * @throws {Error} Si el producto no existe.
 */
export const addProductToCart = async (userId, productId, quantity) => {
  const db = getDb();

  // 1. Verificar si el producto existe
  const product = await getProductById(productId);
  if (!product) {
    throw new Error('El producto especificado no existe.');
  }

  // 2. Asegurarse de que el carrito exista para el usuario
  const cart = await findOrCreateCart(userId);
  const cartId = cart.id;

  // 3. Buscar si el ítem ya está en el carrito
  const existingItem = await db.get(
    'SELECT * FROM cart_items WHERE cartId = ? AND productId = ?',
    cartId, productId
  );

  let result;
  if (existingItem) {
    // Si el ítem existe, actualiza la cantidad
    result = await db.run(
      'UPDATE cart_items SET quantity = quantity + ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      quantity, existingItem.id
    );
  } else {
    // Si el ítem no existe, insértalo
    result = await db.run(
      'INSERT INTO cart_items (cartId, productId, quantity) VALUES (?, ?, ?)',
      cartId, productId, quantity
    );
  }

  // Actualizar el timestamp del carrito principal también
  await db.run('UPDATE carts SET updatedAt = CURRENT_TIMESTAMP WHERE id = ?', cartId);

  // Devolver el carrito completo con los detalles actualizados
  return await getCartDetailsByUserId(userId);
};

/**
 * Elimina un producto específico del carrito de un usuario. Si la cantidad llega a 0, elimina el ítem.
 * @param {number} userId - ID del usuario.
 * @param {number} productId - ID del producto a eliminar.
 * @param {number} [quantityToRemove] - Cantidad a reducir. Si no se especifica, elimina el ítem completo.
 * @returns {Promise<boolean>} Una promesa que resuelve a true si el ítem fue afectado (eliminado o cantidad reducida), false si no se encontró.
 */
export const removeProductFromCart = async (userId, productId, quantityToRemove = null) => {
  const db = getDb();
  const cart = await db.get('SELECT * FROM carts WHERE userId = ?', userId);

  if (!cart) {
    return false; // El carrito no existe
  }

  const cartId = cart.id;

  const existingItem = await db.get(
    'SELECT * FROM cart_items WHERE cartId = ? AND productId = ?',
    cartId, productId
  );

  if (!existingItem) {
    return false; // El producto no está en el carrito
  }

  let changes = 0;
  if (quantityToRemove !== null && existingItem.quantity > quantityToRemove) {
    // Reducir la cantidad
    const result = await db.run(
      'UPDATE cart_items SET quantity = quantity - ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      quantityToRemove, existingItem.id
    );
    changes = result.changes;
  } else {
    // Eliminar el ítem completamente (si quantityToRemove es nulo o mayor/igual a la cantidad actual)
    const result = await db.run(
      'DELETE FROM cart_items WHERE id = ?',
      existingItem.id
    );
    changes = result.changes;
  }

  // Actualizar el timestamp del carrito principal si hubo cambios en los ítems
  if (changes > 0) {
    await db.run('UPDATE carts SET updatedAt = CURRENT_TIMESTAMP WHERE id = ?', cartId);
  }

  return changes > 0;
};

/**
 * Vacía completamente el carrito de un usuario (elimina todos los ítems del carrito).
 * @param {number} userId - ID del usuario.
 * @returns {Promise<boolean>} Una promesa que resuelve a true si el carrito fue vaciado, false si no se encontró.
 */
export const clearUserCart = async (userId) => {
  const db = getDb();
  const cart = await db.get('SELECT * FROM carts WHERE userId = ?', userId);

  if (!cart) {
    return false; // El carrito no existe
  }

  const result = await db.run('DELETE FROM cart_items WHERE cartId = ?', cart.id);
  
  // Actualizar el timestamp del carrito principal aunque esté vacío
  if (result.changes > 0) {
     await db.run('UPDATE carts SET updatedAt = CURRENT_TIMESTAMP WHERE id = ?', cart.id);
  }

  return true; // Se considera vaciado exitoso si el carrito existía, incluso si ya estaba vacío
};