import { Route, Routes } from 'react-router-dom';

import Register from './components/Register';
import LoginPage from './components/LoginPage';
import HomePage from './components/Homepage';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './components/UserProfile';

import './App.css';

const App = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<LoginPage />} />

    {/* Protected routes */}
    <Route
      path="/todoApp"
      element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/userprofile"
      element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default App;
