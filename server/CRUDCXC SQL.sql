Create Database CrudCxC

USE  CrudCxC

CREATE TABLE tipos_documentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255),
    cuenta_contable VARCHAR(255),
    estado ENUM('Activo', 'Inactivo')
);


CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cedula VARCHAR(15) NOT NULL,
    limite_credito DECIMAL(10, 2) NOT NULL,
    estado ENUM('Activo', 'Inactivo') NOT NULL
);


CREATE TABLE balances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha_corte DATE NOT NULL,
    antiguedad_promedio_saldos INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);


CREATE TABLE asientos_contables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    descripcion VARCHAR(255),
    fecha DATE NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    tipo_movimiento ENUM('DB', 'CR') NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);


CREATE TABLE transacciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_movimiento ENUM('DB', 'CR'),
    tipo_documento_id INT,
    numero_documento VARCHAR(255),
    fecha DATE,
    cliente_id INT,
    monto DECIMAL(10, 2),
    FOREIGN KEY (tipo_documento_id) REFERENCES tipos_documentos(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);



