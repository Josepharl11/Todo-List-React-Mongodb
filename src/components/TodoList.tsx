import React from 'react';
import TodoListItem from './TodoListItem';

interface Task {
  _id: string;
  task: string;
}

interface TodoListProps {
  tasks: Task[];
  deleteTask: (id: string) => void;
  editTask: (id: string, newTask: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ tasks, deleteTask, editTask }) => {
  return (
    <ul className="todo-list">
      {tasks.map((task) => (
        <TodoListItem key={task._id} task={task} deleteTask={deleteTask} editTask={editTask} />
    ))}
    </ul>
  );
};

export default TodoList;