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

const SchemaPaquetes = new mongoose.Schema({
    ID: String,
    nombre: String,
    descripcion: String,
    precio: Number,
    destinos: [String],
    fecha_inicio: Date,
    fecha_fin: Date,
    incluye: {
        alojamiento: Boolean,
        transporte: Boolean,
        alimentacion: Boolean,
        asistencia_medica: Boolean
    }
});

const Paquetes = mongoose.model('Paquetes', SchemaPaquetes, 'Paquetes'); 
// Ruta GET para obtener todos los paquetes
app.get('/Paquetes', async (req, res) => {
    try {
        const paquetes = await Paquetes.find();
        res.json(paquetes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los paquetes: " + error.message });
    }
});

// Ruta GET para obtener un paquete por ID
app.get('/Paquetes/:id', async (req, res) => {
    try {
        const paquete = await Paquetes.findById(req.params.id);
        if (!paquete) return res.status(404).json({ message: "Paquete no encontrado" });
        res.json(paquete);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el paquete: " + error.message });
    }
});

// Ruta POST para crear un nuevo paquete
app.post('/Paquetes', async (req, res) => {
    const { ID, nombre, descripcion, precio, destinos, fecha_inicio, fecha_fin, incluye } = req.body;
    const nuevoPaquete = new Paquetes({
        ID,
        nombre,
        descripcion,
        precio,
        destinos,
        fecha_inicio,
        fecha_fin,
        incluye
    });

    try {
        const paqueteGuardado = await nuevoPaquete.save();
        res.status(201).json(paqueteGuardado);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el paquete: " + error.message });
    }
});

// Ruta PUT para actualizar un paquete por ID
app.put('/Paquetes/:id', async (req, res) => {
    const { ID, nombre, descripcion, precio, destinos, fecha_inicio, fecha_fin, incluye } = req.body;

    try {
        const paqueteActualizado = await Paquetes.findByIdAndUpdate(
            req.params.id,
            { ID, nombre, descripcion, precio, destinos, fecha_inicio, fecha_fin, incluye },
            { new: true }
        );

        if (!paqueteActualizado) return res.status(404).json({ message: "Paquete no encontrado" });
        res.json(paqueteActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el paquete: " + error.message });
    }
});

// Ruta DELETE para eliminar un paquete por ID
app.delete('/Paquetes/:id', async (req, res) => {
    try {
        const paqueteEliminado = await Paquetes.findByIdAndDelete(req.params.id);
        if (!paqueteEliminado) return res.status(404).json({ message: "Paquete no encontrado" });
        res.json({ message: "Paquete eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el paquete: " + error.message });
    }
});

// Inicializar el servidor
app.listen(port, () => {
    console.log(`El servidor se está ejecutando en ${hostname}:${port}`);
});
