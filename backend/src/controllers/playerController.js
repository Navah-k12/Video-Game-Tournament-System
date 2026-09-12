
const players = [];

registerPlayers = (req, res) => {
    const {name, email, alias} = req.body

    if( !name || !email || alias){
        console.log("Ingrese todos los valores");
        
    }
};
