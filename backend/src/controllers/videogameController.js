const db = require('../config/db');

const registerVideogame = async (req, res) => {
    const { nombre, genero } = req.body;

    if (!nombre || !genero) {
        return res.status(400).json({ error: 'El nombre y el género del videojuego son obligatorios' });
    }

    try {
        const query = 'INSERT INTO videojuegos (nombre, genero) VALUES (?, ?)';
        await db.query(query, [nombre.trim(), genero.trim()]);
        return res.status(201).json({ message: 'Videojuego registrado exitosamente' });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ese videojuego ya está registrado' });
        }
        return res.status(500).json({ error: 'Error en el servidor al registrar el videojuego' });
    }
};

const getVideogames = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, nombre, genero FROM videojuegos ORDER BY nombre'
        );
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al consultar los videojuegos' });
    }
};

module.exports = { registerVideogame, getVideogames };