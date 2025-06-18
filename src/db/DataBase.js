// src/db/DataBase.js (REEMPLAZA TODO EL CONTENIDO EXISTENTE CON ESTO)

import Database from 'better-sqlite3'; // Usamos la clase Database de better-sqlite3
import { fileURLToPath } from 'url';
import path from 'path';

let dbInstance = null; // Usamos esta variable para mantener la instancia de la base de datos

/**
 * @returns {Promise<any>} Una promesa que resuelve con la instancia de la base de datos adaptada.
 */
export const connectDb = async () => {
    if (dbInstance) {
        console.log('Base de datos ya está conectada. Reutilizando instancia.');
        return dbInstance;
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dbPath = path.join(__dirname, 'database.db'); // Ruta relativa a DataBase.js

    try {
        // Conectar a la base de datos. better-sqlite3 crea el archivo si no existe.
        const db = new Database(dbPath, { verbose: console.log }); // verbose para ver logs de la DB
        console.log('✅ Conexión a la base de datos SQLite establecida con better-sqlite3.');

        // Habilitar las claves foráneas (MUY IMPORTANTE)
        db.pragma('foreign_keys = ON');
        console.log("PRAGMA foreign_keys = ON; habilitado.");

        // Adaptar los métodos síncronos de better-sqlite3 a Promesas para compatibilidad con el resto del código
        dbInstance = {
            run: (sql, params) => {
                try {
                    const stmt = db.prepare(sql);
                    const info = stmt.run(params);
                    return info; // Retorna { changes, lastInsertRowid }
                } catch (error) {
                    throw error; // Propaga el error
                }
            },
            get: (sql, params) => {
                try {
                    const stmt = db.prepare(sql);
                    return stmt.get(params);
                } catch (error) {
                    throw error;
                }
            },
            all: (sql, params) => {
                try {
                    const stmt = db.prepare(sql);
                    return stmt.all(params);
                } catch (error) {
                    throw error;
                }
            },
            close: () => {
                db.close();
                dbInstance = null;
                console.log('✅ Conexión a la base de datos SQLite cerrada.');
            },
            // Asegurarse de que exec (para múltiples sentencias SQL) también esté disponible si es necesario para init-db.js
            exec: (sql) => {
                try {
                    db.exec(sql);
                } catch (error) {
                    throw error;
                }
            }
        };

        return dbInstance;

    } catch (err) {
        console.error('❌ Error al conectar a la base de datos SQLite con better-sqlite3:', err.message);
        dbInstance = null;
        throw err;
    }
};

/**
 * Obtiene la instancia de la base de datos conectada.
 * @returns {any | null} La instancia de la base de datos adaptada o null si no está conectada.
 */
export const getDb = () => {
    if (!dbInstance) {
        console.error('⚠️ La base de datos no está conectada. Llamar a connectDb() primero.');
    }
    return dbInstance;
};

/**
 * Cierra la conexión a la base de datos.
 * @returns {void}
 */
export const closeDb = async () => {
    if (dbInstance && typeof dbInstance.close === 'function') {
        dbInstance.close();
    } else {
        console.log('⚠️ No hay conexión a la base de datos para cerrar.');
    }
};