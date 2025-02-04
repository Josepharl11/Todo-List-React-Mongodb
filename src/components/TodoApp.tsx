import React, { useState, useEffect } from 'react';
import TodoList from './TodoList';
import TodoListItem from './TodoListItem';

interface Task {
  _id: string;
  task: string;
}

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
 
  const fetchTasks = async () => {
    const response = await fetch('/tasks');
    const data = await response.json();
    setTasks(data);
  };

  // Función para agregar tarea
  const addTask = async (task: string) => {
    const response = await fetch('/add-task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({task }),
    });
    const result = await response.json();
    if (result.success) {
        setTasks([...tasks, result.task]);
    }
  };

  // Función para eliminar tarea
  const deleteTask = async (_id: string) => {
    const response = await fetch('/delete-task', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId: _id }),
      });
    
      const result = await response.json();
    
      if (result.success) {
        setTasks(tasks.filter((task) => task._id !== _id));  // Elimina la tarea del estado
      } else {
        alert(result.message);  // Muestra un mensaje si hubo un error
      }
  };

  // Función para editar tarea
  const editTask = async (_id: string, newTask: string) => {
    const response = await fetch('/edit-task', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId: _id, newTask }),
      });
    
      const result = await response.json();
    
      if (result.success) {
        setTasks(tasks.map((task) => (task._id === _id ? { ...task, task: newTask } : task)));
      } else {
        alert(result.message);  // Muestra un mensaje si hubo un error
      }
  };

  useEffect(() =>{
    fetchTasks();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    addTask(newTask);
    setNewTask('');
  };

  return (
    <div className="todo-container">
      <h2>To-Do List</h2>
      <div className="todo">
        <form onSubmit={handleSubmit} className="todo-header">
            <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            required
            />
            <button type="submit" className="check">
            <span className="fas fa-plus"></span>
            </button>
        </form>
        <TodoList tasks={tasks} deleteTask={deleteTask} editTask={editTask} />
        </div>
    </div>
  );
};

export default TodoApp;