import React, { useState } from 'react';
import Cookies from 'js-cookie';

const Homepage = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [showTodos, setShowTodos] = useState(false);

  // Handle new todo input change
  const handleTodoChange = (e) => {
    setNewTodo(e.target.value);
  };

  // Handle form submission to add a new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();

    const jwtToken = Cookies.get('jwtToken');
    if (!jwtToken) {
      alert('You need to be logged in to add a todo.');
      return;
    }

    const response = await fetch('http://localhost:3001/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        task: newTodo,
        status: 'pending', // Default status is 'pending'
      }),
    });

    if (response.ok) {
      setNewTodo('');
      alert('Todo added successfully!');
      if (showTodos) {
        fetchTodos();  // Optionally refresh the todos after adding a new one
      }
    } else {
      alert('Failed to add todo');
    }
  };

  // Fetch todos from the backend
  const fetchTodos = async () => {
    const jwtToken = Cookies.get('jwtToken');
    if (!jwtToken) {
      alert('You need to be logged in to view your todos.');
      return;
    }

    const response = await fetch('http://localhost:3001/todos', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setTodos(data);
    } else {
      alert('Failed to fetch todos');
    }
  };

  // Handle the "Show Todos" button click
  const handleShowTodos = () => {
    setShowTodos(true);
    fetchTodos();
  };

  return (
    <div>
      <h2>Your Todo List</h2>
      
      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo}>
        <div>
          <label>Add New Todo:</label>
          <input
            type="text"
            value={newTodo}
            onChange={handleTodoChange}
            required
            placeholder="Enter your task"
          />
        </div>
        <button type="submit">Add Todo</button>
      </form>

      {/* Show Todos Button */}
      <button onClick={handleShowTodos}>Show Todos</button>

      {/* Display the Todo List */}
      {showTodos && (
        <div>
          <h3>Todo Tasks:</h3>
          <ul>
            {todos.length > 0 ? (
              todos.map((todo) => (
                <li key={todo.id}>
                  <span>{todo.task}</span> - <span>{todo.status}</span>
                </li>
              ))
            ) : (
              <p>No todos available.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Homepage;
