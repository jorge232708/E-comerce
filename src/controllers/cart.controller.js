// src/controllers/cart.controller.js

// Importamos las funciones del modelo de carrito, que ahora serán asíncronas
import {
  findOrCreateCart,
  getCartDetailsByUserId, // Para obtener el carrito con sus ítems
  addProductToCart,
  removeProductFromCart,
  clearUserCart,
} from '../models/cart.model.js'; // Asegúrate de que este modelo use getDb() y sea async

/**
 * @typedef {object} CartItem
 * @property {number} productId - ID del producto en el carrito.
 * @property {number} quantity - Cantidad del producto.
 */

/**
 * @typedef {object} Cart
 * @property {number} id - ID del carrito.
 * @property {number} userId - ID del usuario propietario del carrito.
 * @property {Array<CartItem>} items - Array de productos en el carrito.
 * @property {string} createdAt - Marca de tiempo de creación.
 * @property {string} updatedAt - Marca de tiempo de última actualización.
 */

/**
 * @typedef {object} AddToCartInput
 * @property {number} productId - ID del producto a añadir.
 * @property {number} quantity - Cantidad a añadir (mínimo 1).
 */

/**
 * Obtiene el carrito de compras del usuario autenticado.
 * @param {object} req - Objeto de petición de Express. Se espera `req.user.id` del middleware de autenticación.
 * @param {object} res - Objeto de respuesta de Express.
 */
export const getCart = async (req, res) => { // Marcado como async
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'No autorizado. Se requiere autenticación.' });
  }
  const userId = req.user.id;

  try {
    // Obtenemos el carrito y sus ítems de la base de datos
    const cart = await getCartDetailsByUserId(userId);
    
    // Si no hay carrito, devuelve un carrito vacío con el userId
    if (!cart) {
      return res.status(200).json({ userId, items: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener el carrito.' });
  }
};

/**
 * Añade un producto al carrito del usuario autenticado.
 * Si el producto ya existe, incrementa la cantidad. Si no, lo añade.
 * @param {object} req - Objeto de petición de Express. Se espera `req.user.id` y `req.body` con `productId` y `quantity`.
 * @param {object} res - Objeto de respuesta de Express.
 */
export const addToCart = async (req, res) => { // Marcado como async
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'No autorizado. Se requiere autenticación.' });
  }
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  // Validaciones básicas de entrada
  if (typeof productId !== 'number' || typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ message: 'productId debe ser un número y quantity un número positivo.' });
  }

  try {
    // La lógica de añadir/actualizar cantidad se manejará en el modelo
    const updatedCart = await addProductToCart(userId, productId, quantity);
    
    if (!updatedCart) {
      // Esto podría pasar si el producto no existe o alguna otra validación en el modelo
      return res.status(400).json({ message: 'No se pudo añadir el producto al carrito. Verifique el ID del producto.' });
    }

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error al añadir producto al carrito:', error);
    res.status(500).json({ message: 'Error interno del servidor al añadir producto al carrito.' });
  }
};

/**
 * Elimina un producto específico del carrito del usuario autenticado.
 * @param {object} req - Objeto de petición de Express. Se espera `req.user.id` y `req.params.id` (productId).
 * @param {object} res - Objeto de respuesta de Express.
 */
export const removeFromCart = async (req, res) => { // Marcado como async
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'No autorizado. Se requiere autenticación.' });
  }
  const userId = req.user.id;
  const productId = parseInt(req.params.id); // Convierte el ID de la URL a número

  try {
    const success = await removeProductFromCart(userId, productId); // El modelo indica si se eliminó

    if (!success) {
      // Si no se eliminó, es porque el carrito o el producto no existían
      return res.status(404).json({ message: 'Producto no encontrado en el carrito o carrito inexistente.' });
    }
    
    // Opcional: devolver el carrito actualizado
    const updatedCart = await getCartDetailsByUserId(userId);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar producto del carrito.' });
  }
};

/**
 * Vacía completamente el carrito del usuario autenticado.
 * @param {object} req - Objeto de petición de Express. Se espera `req.user.id`.
 * @param {object} res - Objeto de respuesta de Express.
 */
export const clearCart = async (req, res) => { // Marcado como async
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'No autorizado. Se requiere autenticación.' });
  }
  const userId = req.user.id;

  try {
    const success = await clearUserCart(userId); // El modelo indica si se vació

    if (!success) {
      return res.status(404).json({ message: 'No se encontró un carrito para este usuario.' });
    }
    res.status(204).send(); // 204 No Content para vaciado exitoso
  } catch (error) {
    console.error('Error al vaciar el carrito:', error);
    res.status(500).json({ message: 'Error interno del servidor al vaciar el carrito.' });
  }
};