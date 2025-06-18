// src/controllers/product.controller.js

// Importamos las funciones del modelo de producto, que ahora serán asíncronas
import {
  getAllProducts,
  getProductById as getProductFromModel, // Renombramos para evitar conflicto de nombres
  addProduct,
  updateProductById,
  deleteProductById,
} from '../models/product.model.js'; // Asegúrate de que este modelo use getDb() y sea async

/**
 * @typedef {object} Product
 * @property {number} id - ID único del producto.
 * @property {string} name - Nombre del producto.
 * @property {string} [description] - Descripción del producto.
 * @property {number} price - Precio del producto.
 * @property {number} stock - Cantidad en stock.
 * @property {string} [imageUrl] - URL de la imagen del producto.
 * @property {number} [categoryId] - ID de la categoría del producto (si aplica, referenciando la tabla categories).
 * @property {string} createdAt - Marca de tiempo de creación.
 * @property {string} updatedAt - Marca de tiempo de última actualización.
 */

/**
 * @typedef {object} ProductInput
 * @property {string} name - Nombre del producto.
 * @property {string} [description] - Descripción del producto.
 * @property {number} price - Precio del producto.
 * @property {number} stock - Cantidad en stock.
 * @property {string} [imageUrl] - URL de la imagen del producto.
 * @property {number} [categoryId] - ID de la categoría del producto (si aplica).
 */


/**
 * Obtiene todos los productos de la base de datos.
 * @param {object} req - Objeto de petición de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
export const getProducts = async (req, res) => { // Marcado como async
  try {
    const products = await getAllProducts(); // Llamamos a la función asíncrona del modelo
    res.status(200).json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener productos.' });
  }
};

/**
 * Busca un producto por su ID.
 * @param {object} req - Objeto de petición de Express (contiene params.id).
 * @param {object} res - Objeto de respuesta de Express.
 */
export const getProductById = async (req, res) => { // Marcado como async
  const id = parseInt(req.params.id);

  try {
    const product = await getProductFromModel(id); // Llamamos a la función asíncrona del modelo

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener producto.' });
  }
};

/**
 * Crea un nuevo producto y lo agrega a la base de datos.
 * @param {object} req - Objeto de petición de Express (contiene body con los datos del producto).
 * @param {object} res - Objeto de respuesta de Express.
 */
export const createProduct = async (req, res) => { // Marcado como async
  const { name, description, price, stock, imageUrl, categoryId } = req.body; // Cambiado 'category' a 'categoryId'

  if (!name || !price || !stock) {
    return res.status(400).json({ message: 'Nombre, precio y stock son campos obligatorios.' });
  }

  try {
    // Llamamos a la función asíncrona del modelo para añadir el producto
    const newProduct = await addProduct({ name, description, price, stock, imageUrl, categoryId });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error interno del servidor al crear producto.' });
  }
};

/**
 * Actualiza un producto existente.
 * @param {object} req - Objeto de petición de Express (contiene params.id y body con los campos a actualizar).
 * @param {object} res - Objeto de respuesta de Express.
 */
export const updateProduct = async (req, res) => { // Marcado como async
  const id = parseInt(req.params.id);
  const updatedFields = req.body;

  try {
    const updatedRows = await updateProductById(id, updatedFields); // Llamamos a la función asíncrona del modelo

    if (updatedRows === 0) { // El modelo debe devolver el número de filas afectadas
      return res.status(404).json({ message: 'Producto no encontrado para actualizar.' });
    }

    // Opcional: Podríamos recuperar el producto actualizado para devolverlo
    const product = await getProductFromModel(id);
    res.status(200).json(product);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar producto.' });
  }
};

/**
 * Elimina un producto por su ID.
 * @param {object} req - Objeto de petición de Express (contiene params.id).
 * @param {object} res - Objeto de respuesta de Express.
 */
export const deleteProduct = async (req, res) => { // Marcado como async
  const id = parseInt(req.params.id);

  try {
    const deletedRows = await deleteProductById(id); // Llamamos a la función asíncrona del modelo

    if (deletedRows === 0) { // El modelo debe devolver el número de filas eliminadas
      return res.status(404).json({ message: 'Producto no encontrado para eliminar.' });
    }
    res.status(204).send(); // 204 No Content para eliminación exitosa
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar producto.' });
  }
};