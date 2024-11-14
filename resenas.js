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

const SchemaResenas = new mongoose.Schema({
    ID: String,
    paquete_id: String,
    cliente_id: String,
    fecha: Date,
    calificacion: Number,
    comentario: String
});

const Resenas = mongoose.model('Resenas', SchemaResenas, 'Resenas'); 


// Ruta GET para obtener todas las reseñas
app.get('/Resenas', async (req, res) => {
    try {
        const resenas = await Resenas.find();
        res.json(resenas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las reseñas: " + error.message });
    }
});

// Ruta GET para obtener una reseña por ID
app.get('/Resenas/:id', async (req, res) => {
    try {
        const resena = await Resenas.findById(req.params.id);
        if (!resena) return res.status(404).json({ message: "Reseña no encontrada" });
        res.json(resena);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la reseña: " + error.message });
    }
});

// Ruta POST para crear una nueva reseña
app.post('/Resenas', async (req, res) => {
    const { ID, paquete_id, cliente_id, fecha, calificacion, comentario } = req.body;
    const nuevaResena = new Resenas({
        ID,
        paquete_id,
        cliente_id,
        fecha,
        calificacion,
        comentario
    });

    try {
        const resenaGuardada = await nuevaResena.save();
        res.status(201).json(resenaGuardada);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la reseña: " + error.message });
    }
});

// Ruta PUT para actualizar una reseña por ID
app.put('/Resenas/:id', async (req, res) => {
    const { ID, paquete_id, cliente_id, fecha, calificacion, comentario } = req.body;

    try {
        const resenaActualizada = await Resenas.findByIdAndUpdate(
            req.params.id,
            { ID, paquete_id, cliente_id, fecha, calificacion, comentario },
            { new: true }
        );

        if (!resenaActualizada) return res.status(404).json({ message: "Reseña no encontrada" });
        res.json(resenaActualizada);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la reseña: " + error.message });
    }
});

// Ruta DELETE para eliminar una reseña por ID
app.delete('/Resenas/:id', async (req, res) => {
    try {
        const resenaEliminada = await Resenas.findByIdAndDelete(req.params.id);
        if (!resenaEliminada) return res.status(404).json({ message: "Reseña no encontrada" });
        res.json({ message: "Reseña eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la reseña: " + error.message });
    }
});

// Inicializar el servidor
app.listen(port, () => {
    console.log(`El servidor se está ejecutando en ${hostname}:${port}`);
});
