import React, { useState } from 'react';

interface TaskItemProps {
  task: { _id: string; task: string };
  deleteTask: (id: string) => void;
  editTask: (id: string, newTask: string) => void;
}

const TodoListItem: React.FC<TaskItemProps> = ({ task, deleteTask, editTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTask, setNewTask] = useState(task.task);

  const handleEditClick = () => {
    if (isEditing) {
        if (newTask.trim() !== '') {
            editTask(task._id, newTask);
        } else {
            alert('La tarea no puede estar vacia');
            return;
        }
    }
    setIsEditing(!isEditing);
  };

  return (
    <li className="todo-list-item">
      <div className="todo-list-item-name">
        {isEditing ? (
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
        ) : (
          task.task
        )}
      </div>
      <button onClick={handleEditClick} className="edit">
        <span className="fas fa-edit"></span>
      </button>
      <button onClick={() => deleteTask(task._id)} className="remove">
        <span className="fas fa-times"></span>
      </button>
    </li>
  );
};

export default TodoListItem;