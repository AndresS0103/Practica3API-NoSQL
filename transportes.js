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

const SchemaTransportes = new mongoose.Schema({
    ID: String,
    tipo: String,
    proveedor: String,
    capacidad: Number,
    itinerario: {
        origen: String,
        destino: String,
        fecha_salida: Date,
        fecha_llegada: Date
    }
});


const Transportes = mongoose.model('Transportes', SchemaTransportes, 'Transportes'); 

// Ruta GET para obtener todos los transportes
app.get('/Transportes', async (req, res) => {
    try {
        const transportes = await Transportes.find();
        res.json(transportes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los transportes: " + error.message });
    }
});

// Ruta GET para obtener un transporte por ID
app.get('/Transportes/:id', async (req, res) => {
    try {
        const transporte = await Transportes.findById(req.params.id);
        if (!transporte) return res.status(404).json({ message: "Transporte no encontrado" });
        res.json(transporte);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el transporte: " + error.message });
    }
});

// Ruta POST para crear un nuevo transporte
app.post('/Transportes', async (req, res) => {
    const { ID, tipo, proveedor, capacidad, itinerario } = req.body;
    const nuevoTransporte = new Transportes({
        ID,
        tipo,
        proveedor,
        capacidad,
        itinerario
    });

    try {
        const transporteGuardado = await nuevoTransporte.save();
        res.status(201).json(transporteGuardado);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el transporte: " + error.message });
    }
});

// Ruta PUT para actualizar un transporte por ID
app.put('/Transportes/:id', async (req, res) => {
    const { ID, tipo, proveedor, capacidad, itinerario } = req.body;

    try {
        const transporteActualizado = await Transportes.findByIdAndUpdate(
            req.params.id,
            { ID, tipo, proveedor, capacidad, itinerario },
            { new: true }
        );

        if (!transporteActualizado) return res.status(404).json({ message: "Transporte no encontrado" });
        res.json(transporteActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el transporte: " + error.message });
    }
});

// Ruta DELETE para eliminar un transporte por ID
app.delete('/Transportes/:id', async (req, res) => {
    try {
        const transporteEliminado = await Transportes.findByIdAndDelete(req.params.id);
        if (!transporteEliminado) return res.status(404).json({ message: "Transporte no encontrado" });
        res.json({ message: "Transporte eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el transporte: " + error.message });
    }
});

// Inicializar el servidor
app.listen(port, () => {
    console.log(`El servidor se está ejecutando en ${hostname}:${port}`);
});
