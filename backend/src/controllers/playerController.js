playerController.js

const db = require('../config/db');

const registerPlayers = async (req,res) => {
    const {name, gamertag, email}= req.body;

    if(!name || !gamertag || !email)
    {
        res.status(400).json({Error: 'Error: No deje ni un campo vacio'})
        return;
    };

    try{
        const query ='INSERT INTO Players(name, gamertag, email) VALUES (?,?,?)'
        await db.query(query, [name, gamertag, email]);

        return res.status(201).json({message: 'Jugador registrado exitosamente'});
    }catch(ERROR){
        console.error(ERROR);
        res.status(500).json({ERROR:'Error en el servidor al registrarte'});
    };
};

module.exports = {registerPlayers};