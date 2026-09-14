const db = require('../config/db');

const registerPlayers = async (req, res) => {
    const { nombre, gamertag, correo } = req.body;

    if (!nombre || !gamertag || !correo) {
        return res.status(400).json({ error: 'Nombre, Gamertag y correo son obligatorios' });
    }

    try {
        const query = 'INSERT INTO jugadores (nombre, gamertag, correo) VALUES (?, ?, ?)';
        await db.query(query, [nombre.trim(), gamertag.trim(), correo.trim()]);
        return res.status(201).json({ message: 'Jugador registrado exitosamente' });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ese Gamertag ya está registrado' });
        }
        return res.status(500).json({ error: 'Error en el servidor al registrar el jugador' });
    }
};

const getPlayers = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, nombre, gamertag, correo, fecha_registro AS fechaRegistro FROM jugadores ORDER BY id'
        );
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al consultar los jugadores' });
    }
};

const searchPlayers = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Indica el término a buscar (?q=nombre o gamertag)' });
    }

    try {
        const search = `%${q.trim()}%`;
        const [rows] = await db.query(
            `SELECT id, nombre, gamertag, correo, fecha_registro AS fechaRegistro
             FROM jugadores
             WHERE nombre LIKE ? OR gamertag LIKE ?
             ORDER BY nombre`,
            [search, search]
        );
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al buscar jugadores' });
    }
};

module.exports = { registerPlayers, getPlayers, searchPlayers };