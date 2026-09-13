

const db = require('../config/db');

const registerPlayers = async (req,res) => {
    const {name, gamertag, email}= req.body;

    if(!name || !gamertag || !email)
    {
        res.status(400).json({error: 'Error: No deje ni un campo vacio'})
        return;
    };

    try{
        const query ='INSERT INTO Players(name, gamertag, email) VALUES (?,?,?)'
        await db.query(query, [name, gamertag, email]);

        return res.status(201).json({message: 'Jugador registrado exitosamente'});
    }catch(error){
        console.error(error);
        

        if(error.code === 'ER_DUP_ENTRY'){
            return res.status(400).json({error: 'El Gamertag o el Email no se encuentra disponible'});
        }

        res.status(500).json({error:'Error en el servidor al registrarte'});
    };
};

const getPlayers = async(req, res) =>{
    try{
        const [rows] = await db.query('SELECT gamertag, email, fecha_registro FROM Players');
        res.status(200).json(rows);
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Error al obtener la lista de jugadores'});
    };

};
        // ER_DUP_ENTRY (que es la etiqueta que usa MySQL para decir 'Entrada duplicada')
        // .code: Es el código o la etiqueta exacta que le puso MySQL al tipo de error que ocurrió.
module.exports = {registerPlayers, getPlayers};