const db = require('../config/db');

const registerScore = async (req, res) => {
    const { jugadorId, videojuegoId, puntuacion, fecha } = req.body;

    if (!jugadorId || !videojuegoId || puntuacion === undefined) {
        return res.status(400).json({ error: 'Jugador, videojuego y puntuación son obligatorios' });
    }

    const puntos = Number(puntuacion);
    if (isNaN(puntos) || !Number.isInteger(puntos) || puntos < 0) {
        return res.status(400).json({ error: 'La puntuación debe ser un número entero no negativo' });
    }

    try {
        const query = fecha
            ? 'INSERT INTO puntuaciones (jugador_id, videojuego_id, puntuacion, fecha) VALUES (?, ?, ?, ?)'
            : 'INSERT INTO puntuaciones (jugador_id, videojuego_id, puntuacion) VALUES (?, ?, ?)';
        const params = fecha
            ? [jugadorId, videojuegoId, puntos, fecha]
            : [jugadorId, videojuegoId, puntos];
        await db.query(query, params);
        return res.status(201).json({ message: 'Puntuación registrada exitosamente' });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'El jugador o el videojuego no existe' });
        }
        return res.status(500).json({ error: 'Error en el servidor al registrar la puntuación' });
    }
};

const getScores = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT p.id,
                    j.gamertag AS jugador,
                    v.nombre AS videojuego,
                    p.puntuacion,
                    p.fecha
             FROM puntuaciones p
             INNER JOIN jugadores j ON j.id = p.jugador_id
             INNER JOIN videojuegos v ON v.id = p.videojuego_id
             ORDER BY p.fecha DESC, p.id DESC`
        );
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al consultar las puntuaciones' });
    }
};

const getRanking = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT p.id,
                    j.gamertag AS jugador,
                    v.nombre AS videojuego,
                    p.puntuacion
             FROM puntuaciones p
             INNER JOIN jugadores j ON j.id = p.jugador_id
             INNER JOIN videojuegos v ON v.id = p.videojuego_id
             ORDER BY p.puntuacion DESC, p.fecha ASC`
        );
        const ranking = rows.map((row, index) => ({ posicion: index + 1, ...row }));
        return res.status(200).json(ranking);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al generar la clasificación' });
    }
};

const getStats = async (req, res) => {
    try {
        const [[row]] = await db.query(
            `SELECT
                (SELECT COUNT(*) FROM jugadores)    AS total_jugadores,
                (SELECT COUNT(*) FROM videojuegos)  AS total_videojuegos,
                (SELECT COUNT(*) FROM puntuaciones) AS total_puntuaciones,
                (SELECT COALESCE(AVG(puntuacion), 0) FROM puntuaciones) AS promedio_puntuacion`
        );
        return res.status(200).json({
            totalJugadores: row.total_jugadores,
            totalVideojuegos: row.total_videojuegos,
            totalPuntuaciones: row.total_puntuaciones,
            promedio: Math.round(Number(row.promedio_puntuacion) * 100) / 100
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al calcular las estadísticas' });
    }
};

module.exports = { registerScore, getScores, getRanking, getStats };