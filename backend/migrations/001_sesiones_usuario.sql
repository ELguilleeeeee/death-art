
CREATE TABLE sesiones_usuario (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

    usuario_id INT NOT NULL,

    identificador CHAR(36)
        CHARACTER SET ascii
        COLLATE ascii_bin
        NOT NULL,

    fecha_creacion DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    fecha_expiracion DATETIME NOT NULL,

    fecha_revocacion DATETIME NULL,

    PRIMARY KEY (id),

    UNIQUE KEY uq_sesion_identificador
        (identificador),

    INDEX idx_sesion_usuario
        (usuario_id),

    INDEX idx_sesion_expiracion
        (fecha_expiracion),

    CONSTRAINT fk_sesion_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE

) ENGINE=InnoDB;
