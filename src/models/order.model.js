// src/models/order.model.js

import { getDb } from '../db/database.js'; // Importamos la función para obtener la instancia de la DB

/**
 * @typedef {object} OrderItemDetail
 * @property {number} id - ID del ítem de la orden.
 * @property {number} orderId - ID de la orden a la que pertenece.
 * @property {number} productId - ID del producto.
 * @property {number} quantity - Cantidad del producto.
 * @property {number} priceAtOrder - Precio del producto al momento de la orden.
 * @property {string} productName - Nombre del producto (de la tabla products).
 * @property {string} [productImageUrl] - URL de la imagen del producto (de la tabla products).
 */

/**
 * @typedef {object} Order
 * @property {number} id - ID único de la orden.
 * @property {number} userId - ID del usuario que realizó la orden.
 * @property {number} total - Precio total de la orden.
 * @property {string} status - Estado de la orden (ej. 'pending', 'completed', 'shipped').
 * @property {string} createdAt - Marca de tiempo de creación.
 * @property {string} updatedAt - Marca de tiempo de última actualización.
 * @property {Array<OrderItemDetail>} items - Array de productos detallados en la orden.
 */

/**
 * Crea una nueva orden en la base de datos a partir de los datos proporcionados.
 * Esto asume que el cálculo del total y la validación de ítems ya se hicieron en el controlador.
 * @param {number} userId - ID del usuario que realiza la orden.
 * @param {number} total - El precio total de la orden.
 * @param {Array<object>} items - Un array de objetos { productId, quantity, price } para los ítems de la orden.
 * @returns {Promise<Order>} Una promesa que resuelve con el objeto de la orden creada, incluyendo sus ítems.
 */
export const createOrder = async (userId, total, items) => {
  const db = getDb();
  let orderId;

  // Usamos una transacción para asegurar la atomicidad de la creación de la orden y sus ítems
  await db.exec('BEGIN TRANSACTION;');
  try {
    // 1. Insertar la orden principal
    const orderResult = await db.run(
      `INSERT INTO orders (userId, total, status)
       VALUES (?, ?, ?)`,
      userId, total, 'pending' // Estado inicial de la orden
    );
    orderId = orderResult.lastID;

    // 2. Insertar cada ítem de la orden
    for (const item of items) {
      await db.run(
        `INSERT INTO order_items (orderId, productId, quantity, priceAtOrder)
         VALUES (?, ?, ?, ?)`,
        orderId, item.productId, item.quantity, item.price
      );
    }

    await db.exec('COMMIT;'); // Confirmar la transacción

    // 3. Recuperar la orden completa con sus ítems y detalles para devolverla
    return await getOrderById(orderId);

  } catch (error) {
    await db.exec('ROLLBACK;'); // Revertir la transacción en caso de error
    console.error('Error al crear la orden en la base de datos:', error);
    throw error; // Propagar el error
  }
};

/**
 * Obtiene todas las órdenes de un usuario específico, incluyendo los detalles de sus ítems.
 * @param {number} userId - ID del usuario.
 * @returns {Promise<Order[]>} Una promesa que resuelve con un array de órdenes del usuario.
 */
export const getOrdersByUserId = async (userId) => {
  const db = getDb();

  // 1. Obtener todas las órdenes del usuario
  const orders = await db.all('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC', userId);

  if (orders.length === 0) {
    return []; // No hay órdenes para este usuario
  }

  // 2. Para cada orden, obtener sus ítems
  const ordersWithItems = await Promise.all(orders.map(async (order) => {
    const items = await db.all(
      `SELECT
         oi.id,
         oi.orderId,
         oi.productId,
         oi.quantity,
         oi.priceAtOrder,
         p.name AS productName,
         p.imageUrl AS productImageUrl
       FROM order_items oi
       JOIN products p ON oi.productId = p.id
       WHERE oi.orderId = ?`,
      order.id
    );
    return { ...order, items };
  }));

  return ordersWithItems;
};

/**
 * Obtiene una orden específica por su ID, incluyendo los detalles de sus ítems.
 * @param {number} orderId - ID de la orden.
 * @returns {Promise<Order | undefined>} Una promesa que resuelve con la orden o undefined si no se encuentra.
 */
export const getOrderById = async (orderId) => {
  const db = getDb();

  const order = await db.get('SELECT * FROM orders WHERE id = ?', orderId);
  if (!order) {
    return undefined;
  }

  const items = await db.all(
    `SELECT
       oi.id,
       oi.orderId,
       oi.productId,
       oi.quantity,
       oi.priceAtOrder,
       p.name AS productName,
       p.imageUrl AS productImageUrl
     FROM order_items oi
     JOIN products p ON oi.productId = p.id
     WHERE oi.orderId = ?`,
    orderId
  );

  return { ...order, items };
};

// Puedes añadir más funciones si necesitas, por ejemplo, actualizar el estado de una orden.
/**
 * Actualiza el estado de una orden.
 * @param {number} orderId - ID de la orden a actualizar.
 * @param {string} newStatus - Nuevo estado de la orden (ej. 'completed', 'shipped').
 * @returns {Promise<boolean>} True si se actualizó, false si la orden no se encontró.
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  const db = getDb();
  const result = await db.run(
    'UPDATE orders SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
    newStatus, orderId
  );
  return result.changes > 0;
};