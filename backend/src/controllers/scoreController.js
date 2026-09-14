
const db = require('../config/db');

const registerScores = async(req, res) =>{
    const {playerId, eventId, score} = req.body;

    if(!playerId || !eventId || !score){
        return res.status(400).json({error:'Rellena todos los campos'});
        
    };

    try{
        const query = 'INSERT INTO PlayerScores (playerId, eventId, score) VALUES (?,?,?)';
        await db.query(query,[playerId, eventId, score]);

        return res.status(201).json({message: 'Puntos Registrados éxitosamente'});
        

    }
    catch(error){
        console.error(error)
        if(error.code === 'ER_NO_REFERENCED_ROW_2'){
            return res.status(400).json({error: 'El evento o el jugador no esta resgistrado'});
        };
        res.status(500).json({error:'Error en el servidor'});
    };
};

module.exports = {registerScores};