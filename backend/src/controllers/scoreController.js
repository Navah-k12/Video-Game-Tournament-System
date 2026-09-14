const db = require('../config/db');

const registerScore = async (req, res) => {
    const { jugadorId, videojuegoId, puntuacion } = req.body;

    if (!jugadorId || !videojuegoId || puntuacion === undefined) {
        return res.status(400).json({ error: 'Jugador, videojuego y puntuación son obligatorios' });
    }

    const puntos = Number(puntuacion);
    if (isNaN(puntos) || !Number.isInteger(puntos) || puntos < 0) {
        return res.status(400).json({ error: 'La puntuación debe ser un número entero no negativo' });
    }

    try {
        const query = 'INSERT INTO puntuaciones (jugador_id, videojuego_id, puntuacion) VALUES (?, ?, ?)';
        await db.query(query, [jugadorId, videojuegoId, puntos]);
        return res.status(201).json({ message: 'Puntuación registrada exitosamente' });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'El jugador o el videojuego no existe' });
        }
        return res.status(500).json({ error: 'Error en el servidor al registrar la puntuación' });
    }
};

module.exports = { registerScore };