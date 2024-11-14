// Llamado de librerías
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const port = 3002;
const hostname = 'http://localhost';

app.use(express.json());

const urlNube = "mongodb+srv://AndresS0103:ZsmBIiexenmljFbb@simulacion1andres.xdcrq.mongodb.net/Simulacion1AndresSanchezZuniga";
mongoose.connect(urlNube, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Base de datos en la nube conectada...'))
.catch((error) => console.log('Error al conectar a la base de datos: ' + error));

const SchemaReservas = new mongoose.Schema({
    ID: String,
    Cliente_ID: String,
    Reserva_ID: String,
    fecha_reserva: Date,
    estado: String,
    monto_pagado: Number
});

const Reservas = mongoose.model('Reservas', SchemaReservas, 'Reservas'); 

// Ruta GET para obtener todas las reservas
app.get('/Reservas', async (req, res) => {
    try {
        const reservas = await Reservas.find();
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las reservas: " + error.message });
    }
});

// Ruta GET para obtener una reserva por ID
app.get('/Reservas/:id', async (req, res) => {
    try {
        const reserva = await Reservas.findById(req.params.id);
        if (!reserva) return res.status(404).json({ message: "Reserva no encontrada" });
        res.json(reserva);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la reserva: " + error.message });
    }
});

// Ruta POST para crear una nueva reserva
app.post('/Reservas', async (req, res) => {
    const { ID, Cliente_ID, Reserva_ID, fecha_reserva, estado, monto_pagado } = req.body;
    const nuevaReserva = new Reservas({
        ID,
        Cliente_ID,
        Reserva_ID,
        fecha_reserva,
        estado,
        monto_pagado
    });

    try {
        const reservaGuardada = await nuevaReserva.save();
        res.status(201).json(reservaGuardada);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la reserva: " + error.message });
    }
});

// Ruta PUT para actualizar una reserva por ID
app.put('/Reservas/:id', async (req, res) => {
    const { ID, Cliente_ID, Reserva_ID, fecha_reserva, estado, monto_pagado } = req.body;

    try {
        const reservaActualizada = await Reservas.findByIdAndUpdate(
            req.params.id,
            { ID, Cliente_ID, Reserva_ID, fecha_reserva, estado, monto_pagado },
            { new: true }
        );

        if (!reservaActualizada) return res.status(404).json({ message: "Reserva no encontrada" });
        res.json(reservaActualizada);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la reserva: " + error.message });
    }
});

// Ruta DELETE para eliminar una reserva por ID
app.delete('/Reservas/:id', async (req, res) => {
    try {
        const reservaEliminada = await Reservas.findByIdAndDelete(req.params.id);
        if (!reservaEliminada) return res.status(404).json({ message: "Reserva no encontrada" });
        res.json({ message: "Reserva eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la reserva: " + error.message });
    }
});

// Inicializar el servidor
app.listen(port, () => {
    console.log(`El servidor se está ejecutando en ${hostname}:${port}`);
});
