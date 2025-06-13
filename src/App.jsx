import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminManagement from './pages/AdminManagement';
import EventManagement from './pages/EventManagement';
import UserManagement from './pages/UserManagement';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Ruta pública - Login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas - Dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              {/* Página principal del dashboard */}
              <Route index element={<Dashboard />} />
              
              {/* Gestión de administradores */}
              <Route path="admins" element={<AdminManagement />} />
              
              {/* Gestión de eventos */}
              <Route path="events" element={<EventManagement />} />
              
              {/* Gestión de usuarios */}
              <Route path="users" element={<UserManagement />} />
              
              {/* Placeholder para futuras rutas */}
              <Route path="statistics" element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Estadísticas Detalladas
                  </h2>
                  <p className="text-gray-600">
                    Esta funcionalidad se implementará en la siguiente fase.
                  </p>
                </div>
              } />
              
              <Route path="settings" element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Configuración
                  </h2>
                  <p className="text-gray-600">
                    Esta funcionalidad se implementará en la siguiente fase.
                  </p>
                </div>
              } />
            </Route>
            
            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Ruta 404 */}
            <Route path="*" element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-6">Página no encontrada</p>
                  <a 
                    href="/dashboard" 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Volver al Dashboard
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

