CREATE DATABASE videojuegos,
USE videojuegos; 


CREATE TABLE  jugadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    gamertag VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE  videojuegos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    genero VARCHAR(50) NOT NULL
);

CREATE TABLE  puntuaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jugador_id INT NOT NULL,
    videojuego_id INT NOT NULL,
    puntuacion INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_puntuacion_positiva CHECK (puntuacion >= 0),
    CONSTRAINT fk_puntuacion_jugador FOREIGN KEY (jugador_id) 
        REFERENCES jugadores(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_puntuacion_videojuego FOREIGN KEY (videojuego_id) 
        REFERENCES videojuegos(id) ON DELETE CASCADE ON UPDATE CASCADE
);