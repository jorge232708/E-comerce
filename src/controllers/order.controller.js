// src/controllers/order.controller.js

// Importamos las funciones del modelo de órdenes, carrito y productos (que serán asíncronas)
import { createOrder as createOrderInModel, getOrdersByUserId } from '../models/order.model.js';
import { getCartDetailsByUserId, clearUserCart } from '../models/cart.model.js'; // Necesitamos esto para el carrito
import { getProductById } from '../models/product.model.js'; // Necesitamos esto para obtener el precio del producto

/**
 * @typedef {object} OrderItem
 * @property {number} productId - ID del producto.
 * @property {number} quantity - Cantidad del producto.
 */

/**
 * @typedef {object} Order
 * @property {number} id - ID único de la orden.
 * @property {number} userId - ID del usuario que realizó la orden.
 * @property {number} total - Precio total de la orden.
 * @property {string} status - Estado de la orden (ej. 'pending', 'completed').
 * @property {string} createdAt - Fecha y hora de creación de la orden.
 * @property {string} updatedAt - Fecha y hora de última actualización.
 */

/**
 * Crea una nueva orden a partir del contenido del carrito del usuario autenticado.
 * @param {object} req - Objeto de petición de Express. Se espera `req.user.id`.
 * @param {object} res - Objeto de respuesta de Express.
 */
export const createOrder = async (req, res) => { // Marcado como async
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'No autorizado. Se requiere autenticación.' });
  }
  const userId = req.user.id;

  try {
    // 1. Obtener el carrito del usuario con sus ítems
    const cart = await getCartDetailsByUserId(userId);

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'El carrito del usuario está vacío. No se puede crear una orden.' });
    }

    // 2. Calcular el total de la orden y obtener los detalles completos de los ítems
    let total = 0;
    const orderItemsDetails = []; // Para almacenar los ítems con sus precios al momento de la orden

    for (const item of cart.items) {
      const product = await getProductById(item.productId); // Obtener el producto real de la DB
      if (!product) {
        // Esto es un escenario de error: producto en carrito que no existe en inventario
        return res.status(404).json({ message: `Producto con ID ${item.productId} no encontrado. No se puede crear la orden.` });
      }
      const itemPrice = product.price; // Precio actual del producto
      total += itemPrice * item.quantity;
      orderItemsDetails.push({
        productId: item.productId,
        quantity: item.quantity,
        price: itemPrice // Guardamos el precio al que se vendió
      });
    }

    // 3. Crear la orden en la base de datos a través del modelo
    const newOrder = await createOrderInModel(userId, total, orderItemsDetails);

    // 4. Limpiar el carrito después de crear la orden
    await clearUserCart(userId);

    res.status(201).json(newOrder); // 201 Created para la nueva orden
  } catch (error) {
    console.error('Error al crear la orden:', error);
    res.status(500).json({ message: 'Error interno del servidor al crear la orden.' });
  }
};

/**
 * Obtiene todas las órdenes del usuario autenticado.
 * @param {object} req - Objeto de petición de Express. Se espera `req.user.id`.
 * @param {object} res - Objeto de respuesta de Express.
 */
export const getOrders = async (req, res) => { // Marcado como async
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'No autorizado. Se requiere autenticación.' });
  }
  const userId = req.user.id;

  try {
    const orders = await getOrdersByUserId(userId); // Llamamos a la función asíncrona del modelo
    res.status(200).json(orders); // Devuelve las órdenes del usuario
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener las órdenes.' });
  }
};