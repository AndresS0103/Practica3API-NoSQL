// Llamado de librerías
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Puerto y host
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

const SchemaClientes = new mongoose.Schema({
    identificacion: String,
    nombre: String,
    correo: String,
    telefono: String,
    fecha_nacimiento: Date,
    historial_viajes: [
        {
            paquete_id: String,
            fecha_reserva: Date,
            estado: String
        }
    ]
});


const Clientes = mongoose.model('Clientes', SchemaClientes, 'Clientes'); 

// ruta get para obtener el listado de todos los clientes
app.get('/Clientes', async (req, res) => {
    try {
        const clientes = await Clientes.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los clientes: " + error.message });
    }
});


//ruta get para obtener un cliente por su id
app.get('/Clientes/:id', async (req, res) => {
    try {
        const cliente = await Clientes.findById(req.params.id);
        if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el cliente: " + error.message });
    }
});

//ruta post para crear un nuevo cliente
app.post('/Clientes', async (req, res) => {
    const { identificacion, nombre, correo, telefono, fecha_nacimiento, historial_viajes } = req.body;
    const nuevoCliente = new Clientes({
        identificacion,
        nombre,
        correo,
        telefono,
        fecha_nacimiento,
        historial_viajes
    });

    try {
        const clienteGuardado = await nuevoCliente.save();
        res.status(201).json(clienteGuardado);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el cliente: " + error.message });
    }
});

//ruta put para actualizar un cliente por su id
app.put('/Clientes/:id', async (req, res) => {
    const { identificacion, nombre, correo, telefono, fecha_nacimiento, historial_viajes } = req.body;

    try {
        const clienteActualizado = await Clientes.findByIdAndUpdate(
            req.params.id,
            { identificacion, nombre, correo, telefono, fecha_nacimiento, historial_viajes },
            { new: true }
        );

        if (!clienteActualizado) return res.status(404).json({ message: "Cliente no encontrado" });
        res.json(clienteActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el cliente: " + error.message });
    }
});

//ruta delete para eliminar un cliente por su id
app.delete('/Clientes/:id', async (req, res) => {
    try {
        const clienteEliminado = await Clientes.findByIdAndDelete(req.params.id);
        if (!clienteEliminado) return res.status(404).json({ message: "Cliente no encontrado" });
        res.json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el cliente: " + error.message });
    }
});

// Inicializar el servidor
app.listen(port, () => {
    console.log(`El servidor se está ejecutando en ${hostname}:${port}`);
});
