const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 3001; // El puerto en el que correrá el servidor

// Middleware para CORS y para poder trabajar con JSON
app.use(cors());
app.use(express.json());

// Configuración de la conexión con la base de datos MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '0417',  
    database: 'CrudCxC', 
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});





// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});





//Balances


// Ruta para obtener los balances
app.get('/api/balances', (req, res) => {
    const query = 'SELECT * FROM balances'; // Ajusta el nombre de la tabla según tu base de datos

    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results); // Enviar los resultados al frontend
    });
});


// Ruta para crear un nuevo balance
app.post('/api/balances', (req, res) => {
    const { cliente_id, fecha_corte, antiguedad_promedio_saldos, monto } = req.body;
    const query = 'INSERT INTO balances (cliente_id, fecha_corte, antiguedad_promedio_saldos, monto) VALUES (?, ?, ?, ?)';

    connection.query(query, [cliente_id, fecha_corte, antiguedad_promedio_saldos, monto], (err, result) => {
        if (err) {
            console.error("Error al insertar en la base de datos:", err);
            return res.status(500).send('Error al crear el balance');
        }

        // Devuelve el nuevo balance
        res.status(201).json({
            id: result.insertId,
            cliente_id,
            fecha_corte,
            antiguedad_promedio_saldos,
            monto
        });
    });
});


// Editar balance
app.get('/api/balances/:id', (req, res) => {
    const balanceId = req.params.id;
    const query = 'SELECT * FROM balances WHERE id = ?';

    connection.query(query, [balanceId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Balance no encontrado' });
        }
        res.json(results[0]); // Devuelve el balance encontrado
    });
});
// Ruta para actualizar un balance
app.put('/api/balances/:id', (req, res) => {
    const { id } = req.params; // Obtener el ID de los parámetros de la URL
    const { cliente_id, fecha_corte, antiguedad_promedio_saldos, monto } = req.body;
    
    const query = `
        UPDATE balances 
        SET cliente_id = ?, fecha_corte = ?, antiguedad_promedio_saldos = ?, monto = ?
        WHERE id = ?`;
    
    connection.query(query, [cliente_id, fecha_corte, antiguedad_promedio_saldos, monto, id], (err, result) => {
        if (err) {
            console.error("Error al actualizar en la base de datos:", err);
            return res.status(500).send('Error al actualizar el balance');
        }
        
        res.status(200).json({
            id,
            cliente_id,
            fecha_corte,
            antiguedad_promedio_saldos,
            monto
        });
    });
});

// Ruta para eliminar un balance
app.delete('/api/balances/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM balances WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error al eliminar el balance:", err);
            return res.status(500).send('Error al eliminar el balance');
        }
        res.status(204).send(); // No content
    });
});



// Asientos Contables



// Ruta para obtener todos los asientos contables
app.get('/api/asientos_contables', (req, res) => {
    const query = 'SELECT * FROM asientos_contables';

    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results); // Enviar los resultados al frontend
    });
});

// Ruta para crear un nuevo asiento contable
app.post('/api/asientos_contables', (req, res) => {
    const { cliente_id, descripcion, fecha, monto, tipo_movimiento } = req.body;
    const query = 'INSERT INTO asientos_contables (cliente_id, descripcion, fecha, monto, tipo_movimiento) VALUES (?, ?, ?, ?, ?)';

    connection.query(query, [cliente_id, descripcion, fecha, monto, tipo_movimiento], (err, result) => {
        if (err) {
            console.error("Error al insertar en la base de datos:", err);
            return res.status(500).send('Error al crear el asiento contable');
        }

        res.status(201).json({
            id: result.insertId,
            cliente_id,
            descripcion,
            fecha,
            monto,
            tipo_movimiento
        });
    });
});

// Ruta para obtener un asiento contable específico
app.get('/api/asientos_contables/:id', (req, res) => {
    const asientoId = req.params.id;
    const query = 'SELECT * FROM asientos_contables WHERE id = ?';

    connection.query(query, [asientoId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Asiento contable no encontrado' });
        }
        res.json(results[0]); // Devuelve el asiento contable encontrado
    });
});

// Ruta para actualizar un asiento contable
app.put('/api/asientos_contables/:id', (req, res) => {
    const { id } = req.params; // Obtener el ID de los parámetros de la URL
    const { cliente_id, descripcion, fecha, monto, tipo_movimiento } = req.body;

    const query = `
        UPDATE asientos_contables 
        SET cliente_id = ?, descripcion = ?, fecha = ?, monto = ?, tipo_movimiento = ?
        WHERE id = ?`;

    connection.query(query, [cliente_id, descripcion, fecha, monto, tipo_movimiento, id], (err, result) => {
        if (err) {
            console.error("Error al actualizar en la base de datos:", err);
            return res.status(500).send('Error al actualizar el asiento contable');
        }

        res.status(200).json({
            id,
            cliente_id,
            descripcion,
            fecha,
            monto,
            tipo_movimiento
        });
    });
});

// Ruta para eliminar un asiento contable
app.delete('/api/asientos_contables/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM asientos_contables WHERE id = ?';

    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error al eliminar el asiento contable:", err);
            return res.status(500).send('Error al eliminar el asiento contable');
        }
        res.status(204).send(); // No content
    });
});



//Clientes


// Ruta para obtener todos los clientes
app.get('/api/clientes', (req, res) => {
    const query = 'SELECT * FROM clientes';

    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results); // Enviar los resultados al frontend
    });
});

// Ruta para crear un nuevo cliente
app.post('/api/clientes', (req, res) => {
    const { nombre, cedula, limite_credito, estado } = req.body;
    const query = 'INSERT INTO clientes (nombre, cedula, limite_credito, estado) VALUES (?, ?, ?, ?)';

    connection.query(query, [nombre, cedula, limite_credito, estado], (err, result) => {
        if (err) {
            console.error("Error al insertar en la base de datos:", err);
            return res.status(500).send('Error al crear el cliente');
        }

        res.status(201).json({
            id: result.insertId,
            nombre,
            cedula,
            limite_credito,
            estado
        });
    });
});

// Ruta para obtener un cliente específico
app.get('/api/clientes/:id', (req, res) => {
    const clienteId = req.params.id;
    const query = 'SELECT * FROM clientes WHERE id = ?';

    connection.query(query, [clienteId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json(results[0]); // Devuelve el cliente encontrado
    });
});

// Ruta para actualizar un cliente
app.put('/api/clientes/:id', (req, res) => {
    const { id } = req.params; // Obtener el ID de los parámetros de la URL
    const { nombre, cedula, limite_credito, estado } = req.body;

    const query = `
        UPDATE clientes 
        SET nombre = ?, cedula = ?, limite_credito = ?, estado = ?
        WHERE id = ?`;

    connection.query(query, [nombre, cedula, limite_credito, estado, id], (err, result) => {
        if (err) {
            console.error("Error al actualizar en la base de datos:", err);
            return res.status(500).send('Error al actualizar el cliente');
        }

        res.status(200).json({
            id,
            nombre,
            cedula,
            limite_credito,
            estado
        });
    });
});

// Ruta para eliminar un cliente
app.delete('/api/clientes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM clientes WHERE id = ?';

    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error al eliminar el cliente:", err);
            return res.status(500).send('Error al eliminar el cliente');
        }
        res.status(204).send(); // No content
    });
});




// Obtener Id del cliente
app.get('/api/clientesid', (req, res) => {
    console.log('Solicitud recibida en /api/clientesid'); // Log para verificar la solicitud
    const query = 'SELECT id FROM clientes';
    connection.query(query, (err, result) => { 
        if (err) {
            console.error("Error al obtener clientes:", err);
            return res.status(500).json({ error: 'Error al obtener clientes' });
        }
        res.json(result);
    });
});


//Tipo de documento


// Ruta para obtener todos los tipos de documentos
app.get('/api/tipos_documentos', (req, res) => {
    const query = 'SELECT * FROM tipos_documentos';

    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results); // Enviar los resultados al frontend
    });
});

// Ruta para crear un nuevo tipo de documento
app.post('/api/tipos_documentos', (req, res) => {
    const { descripcion, cuenta_contable, estado } = req.body;
    const query = 'INSERT INTO tipos_documentos (descripcion, cuenta_contable, estado) VALUES (?, ?, ?)';

    connection.query(query, [descripcion, cuenta_contable, estado], (err, result) => {
        if (err) {
            console.error("Error al insertar en la base de datos:", err);
            return res.status(500).send('Error al crear el tipo de documento');
        }

        res.status(201).json({
            id: result.insertId,
            descripcion,
            cuenta_contable,
            estado
        });
    });
});

// Ruta para obtener un tipo de documento específico
app.get('/api/tipos_documentos/:id', (req, res) => {
    const tipoDocumentoId = req.params.id;
    const query = 'SELECT * FROM tipos_documentos WHERE id = ?';

    connection.query(query, [tipoDocumentoId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Tipo de documento no encontrado' });
        }
        res.json(results[0]); // Devuelve el tipo de documento encontrado
    });
});

// Ruta para actualizar un tipo de documento
app.put('/api/tipos_documentos/:id', (req, res) => {
    const { id } = req.params; // Obtener el ID de los parámetros de la URL
    const { descripcion, cuenta_contable, estado } = req.body;

    const query = `
        UPDATE tipos_documentos 
        SET descripcion = ?, cuenta_contable = ?, estado = ?
        WHERE id = ?`;

    connection.query(query, [descripcion, cuenta_contable, estado, id], (err, result) => {
        if (err) {
            console.error("Error al actualizar en la base de datos:", err);
            return res.status(500).send('Error al actualizar el tipo de documento');
        }

        res.status(200).json({
            id,
            descripcion,
            cuenta_contable,
            estado
        });
    });
});

// Ruta para eliminar un tipo de documento
app.delete('/api/tipos_documentos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tipos_documentos WHERE id = ?';

    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error al eliminar el tipo de documento:", err);
            return res.status(500).send('Error al eliminar el tipo de documento');
        }
        res.status(204).send(); // No content
    });
});

// Obtener Id de tipos de documentos
app.get('/api/tipos_documentosid', (req, res) => {
    console.log('Solicitud recibida en /api/tipos_documentosid'); // Log para verificar la solicitud
    const query = 'SELECT id FROM tipos_documentos';
    connection.query(query, (err, result) => { 
        if (err) {
            console.error("Error al obtener tipos de documentos:", err);
            return res.status(500).json({ error: 'Error al obtener tipos de documentos' });
        }
        res.json(result);
    });
});


//Lista de transacciones


// Ruta para obtener todas las transacciones
app.get('/api/transacciones', (req, res) => {
    const query = 'SELECT * FROM transacciones';

    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results); // Enviar los resultados al frontend
    });
});

// Ruta para crear una nueva transacción
app.post('/api/transacciones', (req, res) => {
    const { tipo_movimiento, tipo_documento_id, numero_documento, fecha, cliente_id, monto } = req.body;
    const query = 'INSERT INTO transacciones (tipo_movimiento, tipo_documento_id, numero_documento, fecha, cliente_id, monto) VALUES (?, ?, ?, ?, ?, ?)';

    connection.query(query, [tipo_movimiento, tipo_documento_id, numero_documento, fecha, cliente_id, monto], (err, result) => {
        if (err) {
            console.error("Error al insertar en la base de datos:", err);
            return res.status(500).send('Error al crear la transacción');
        }

        res.status(201).json({
            id: result.insertId,
            tipo_movimiento,
            tipo_documento_id,
            numero_documento,
            fecha,
            cliente_id,
            monto
        });
    });
});

// Ruta para obtener una transacción específica
app.get('/api/transacciones/:id', (req, res) => {
    const transaccionId = req.params.id;
    const query = 'SELECT * FROM transacciones WHERE id = ?';

    connection.query(query, [transaccionId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Transacción no encontrada' });
        }
        res.json(results[0]); // Devuelve la transacción encontrada
    });
});

// Ruta para actualizar una transacción
app.put('/api/transacciones/:id', (req, res) => {
    const { id } = req.params; // Obtener el ID de los parámetros de la URL
    const { tipo_movimiento, tipo_documento_id, numero_documento, fecha, cliente_id, monto } = req.body;

    const query = `
        UPDATE transacciones 
        SET tipo_movimiento = ?, tipo_documento_id = ?, numero_documento = ?, fecha = ?, cliente_id = ?, monto = ?
        WHERE id = ?`;

    connection.query(query, [tipo_movimiento, tipo_documento_id, numero_documento, fecha, cliente_id, monto, id], (err, result) => {
        if (err) {
            console.error("Error al actualizar en la base de datos:", err);
            return res.status(500).send('Error al actualizar la transacción');
        }

        res.status(200).json({
            id,
            tipo_movimiento,
            tipo_documento_id,
            numero_documento,
            fecha,
            cliente_id,
            monto
        });
    });
});

// Ruta para eliminar una transacción
app.delete('/api/transacciones/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM transacciones WHERE id = ?';

    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error al eliminar la transacción:", err);
            return res.status(500).send('Error al eliminar la transacción');
        }
        res.status(204).send(); // No content
    });
});

// Obtener Id de transacciones
app.get('/api/transaccionesid', (req, res) => {
    console.log('Solicitud recibida en /api/transaccionesid'); // Log para verificar la solicitud
    const query = 'SELECT id FROM transacciones';
    connection.query(query, (err, result) => { 
        if (err) {
            console.error("Error al obtener transacciones:", err);
            return res.status(500).json({ error: 'Error al obtener transacciones' });
        }
        res.json(result);
    });
});
