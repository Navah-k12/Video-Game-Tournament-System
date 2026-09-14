
const db = require('../config/db');

const registerVideogame = async (req,res) =>{
    const {name, genre} = req.body;

    if(!name || !genre){
        return res.status(400).json({error: 'No deje niun campo basio'});
    };

    try{
        const query = 'INSERT INTO Events(name,genre) VALUES(?,?)';
        await db.query(query,[name, genre]);

        return res.status(201).json({message:'El Evento se registro éxitosamente'});

    }catch(error){
        console.error(error);

        if(error.code === 'ER_DUP_ENTRY'){
            return res.status(400).json({error: 'Este evento se encuentra Registrado'});
        };

        res.status(500).json({error:'Error interno en el servidor'});
    };
};

module.exports = {registerVideogame};