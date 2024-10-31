
USE  CrudCxC

CREATE TABLE tipos_documentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255),
    cuenta_contable VARCHAR(255),
    estado ENUM('Activo', 'Inactivo')
);


CREATE TABLE clientes (
  cedula VARCHAR(15) primary key NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    limite_credito DECIMAL(10, 2) NOT NULL,
    estado ENUM('Activo', 'Inactivo') NOT NULL
);
use crudcxc
select * from clientes

CREATE TABLE balances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id  VARCHAR(15) NOT NULL,
    fecha_corte DATE NOT NULL,
    antiguedad_promedio_saldos INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(cedula) ON DELETE CASCADE
);


CREATE TABLE asientos_contables (
    id INT AUTO_INCREMENT PRIMARY KEY,
       cliente_id  VARCHAR(15) NOT NULL,
    descripcion VARCHAR(255),
    fecha DATE NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    tipo_movimiento ENUM('DB', 'CR') NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(cedula) ON DELETE CASCADE
);


CREATE TABLE transacciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_movimiento ENUM('DB', 'CR'),
    tipo_documento_id INT,
    numero_documento VARCHAR(255),
    fecha DATE,
       cliente_id  VARCHAR(15) NOT NULL,
    monto DECIMAL(10, 2),
    FOREIGN KEY (tipo_documento_id) REFERENCES tipos_documentos(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(cedula)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
);


-- Datos de prueba
use Crudcxc
INSERT INTO tipos_documentos (descripcion, cuenta_contable, estado) VALUES
('Factura de Venta', '4110', 'Activo'),
('Nota de Crédito', '4210', 'Activo'),
('Recibo de Pago', '4310', 'Activo'),
('Factura de Compra', '4410', 'Inactivo'),
('Nota de Débito', '4510', 'Activo');


INSERT INTO clientes (nombre, cedula, limite_credito, estado) VALUES
('Juan Perez', '00123456789', 50000.00, 'Activo'),
('Maria Lopez', '00123456790', 75000.00, 'Activo'),
('Carlos Gomez', '00123456791', 100000.00, 'Inactivo'),
('Ana Martinez', '00123456792', 20000.00, 'Activo'),
('Luis Sanchez', '00123456793', 30000.00, 'Activo');

INSERT INTO balances (cliente_id, fecha_corte, antiguedad_promedio_saldos, monto) VALUES
('00123456789', '2024-09-01', 30, 15000.00),
('00123456792', '2024-09-01', 45, 25000.00),
('00123456790', '2024-09-01', 60, 10000.00),
('00123456791', '2024-09-01', 15, 5000.00),
('00123456793', '2024-09-01', 90, 3000.00);

INSERT INTO asientos_contables (cliente_id, descripcion, fecha, monto, tipo_movimiento) VALUES
('00123456789', 'Venta producto A', '2024-09-01', 1000.00, 'DB'),
('00123456792', 'Venta producto B', '2024-09-02', 5000.00, 'DB'),
('00123456790', 'Devolución producto A', '2024-09-03', 1000.00, 'CR'),
('00123456791', 'Venta producto C', '2024-09-04', 2000.00, 'DB'),
('00123456793', 'Cobro factura', '2024-09-05', 1500.00, 'CR');

INSERT INTO transacciones (tipo_movimiento, tipo_documento_id, numero_documento, fecha, cliente_id, monto) VALUES
('DB', 1, '10001', '2024-09-01', '00123456789', 1000.00),
('CR', 4, '10002', '2024-09-02', '00123456792', 5000.00),
('DB', 5, '10003', '2024-09-03', '00123456790', 3000.00),
('DB', 6, '10004', '2024-09-04', '00123456791', 2000.00),
('CR', 7, '10005', '2024-09-05', '00123456793', 1500.00);




insert into users (username, password, role) values ('elpi0417@gmail.com', 1212, 'admin');
insert into users (username, password, role) values ('elpi0417@gmail.com', 1212, 'admin');


select * from users