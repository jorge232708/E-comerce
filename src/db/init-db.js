// src/db/init-db.js

import { getDb, closeDb } from './database.js'; // Importa getDb y closeDb de tu src/db/database.js

const initializeDatabase = async () => {
  const db = getDb(); // Obtiene la instancia de la base de datos ya conectada

  try {
    // PRAGMA foreign_keys = ON; es CRUCIAL para que las relaciones entre tablas (FOREIGN KEYs) funcionen
    // y la base de datos mantenga la integridad de tus datos.
    await db.exec(`
      PRAGMA foreign_keys = ON; 

      -- Tabla de Usuarios
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      );

      -- Tabla de Categorías (Nueva, para organizar productos)
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      );

      -- Tabla de Productos
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        imageUrl TEXT,
        categoryId INTEGER, -- Clave foránea para la categoría
        stock INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        -- Definición de la clave foránea a la tabla 'categories'
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
      );

      -- Tabla de Carritos (Un carrito por usuario)
      CREATE TABLE IF NOT EXISTS carts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER UNIQUE NOT NULL, -- Cada usuario tiene un único carrito
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        -- Clave foránea al usuario, si el usuario se elimina, su carrito también
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Tabla de Ítems del Carrito (Productos dentro de un carrito específico)
      CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cartId INTEGER NOT NULL,
        productId INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0), -- La cantidad debe ser positiva
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        -- Clave foránea al carrito, si el carrito se elimina, sus ítems también
        FOREIGN KEY (cartId) REFERENCES carts(id) ON DELETE CASCADE,
        -- Clave foránea al producto, si el producto se elimina, sus ocurrencias en carritos también
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
        -- Asegura que un mismo producto no se añada dos veces como una entrada separada en el mismo carrito
        UNIQUE (cartId, productId) 
      );

      -- Tabla de Órdenes
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        total REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending', -- Estado inicial de la orden
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        -- Clave foránea al usuario, si el usuario se elimina, sus órdenes también
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Tabla de Ítems de la Orden (Productos dentro de una orden específica)
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER NOT NULL,
        productId INTEGER NOT NULL,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        priceAtOrder REAL NOT NULL, -- Precio al que se vendió el producto, crucial para registros históricos
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        -- Clave foránea a la orden, si la orden se elimina, sus ítems también
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
        -- Clave foránea al producto, si el producto se elimina, los ítems de órdenes pueden quedar,
        -- pero su productId se establecerá en NULL (SET NULL), manteniendo el registro de la venta.
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE SET NULL
      );
    `);
    console.log(' Base de datos inicializada y tablas creadas/verificadas con éxito.');
  } catch (error) {
    console.error(' Error FATAL al inicializar la base de datos:', error);
    // Propaga el error para que la aplicación no intente iniciar sin una DB funcional
    throw error; 
  } finally {
    // Si esta función se ejecuta de forma independiente (ej. `node init-db.js`), debería cerrar la conexión.
    // Si se llama desde `index.js` antes de que el servidor escuche, `closeDb()` NO se debería llamar aquí,
    // ya que la conexión se mantendrá abierta para el resto de la aplicación.
    // Por ahora, la mantenemos para robustez, pero puede ser eliminada si `connectDb` maneja un singleton.
    closeDb(); 
  }
};

export { initializeDatabase }; // Exportamos la función para que tu src/index.js pueda importarla