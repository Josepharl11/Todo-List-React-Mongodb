import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect('mongodb://localhost:27017/todolist', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.log('Error al conectar a MongoDB:', err));

const taskSchema = new mongoose.Schema({
    task: {type: String, required: true },
});

const Task = mongoose.model('Task', taskSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'project') {
    app.use(express.static(path.join(__dirname, 'frontend', 'build')));
}

// Get para obtener las tareas.
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST para agregar las tareas.
app.post('/add-task', async (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ success: false, message: "La tarea no puede estar vacía"});
    }

    try {
        const newTask = new Task({ task });
        await newTask.save();
        res.json({ success: true, task: newTask });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete para borrar las tareas.
app.delete('/delete-task', async (req, res) => {
    const { taskId } = req.body; // QueryString
    if (!taskId) {
        return res.status(400).json({ success: false, message: "Debe existir una tarea para eliminarla" });
    }

    try {
        const result = await Task.findByIdAndDelete(taskId);
        if (!result) {
            return res.status(404).json({ success: false, message: "Tarea no encontrada" });
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put('/edit-task', async (req, res) => {
    const { taskId, newTask } = req.body;
    if (!taskId || !newTask) {
        return res.status(400).json({ success: false, message: "La tarea no existe o la nueva tarea esta vacia" });
    } 

    try {
        const updatedTask = await Task.findByIdAndUpdate(taskId, { task: newTask }, { new: true});
        if (!updatedTask) {
            return res.status(404).json({ success: false, message: "Tarea no encontrada" });
        }

        res.json({ success: true, task: updatedTask });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET es básicamente mi ruta principal, irá al index.html.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});