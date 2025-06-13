// Configuración de la API
export const API_CONFIG = {
  BASE_URL: 'https://backendeventhub.onrender.com',
  ENDPOINTS: {
    // Autenticación
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    CHECK_AUTH: '/auth/check-auth',
    
    // Usuarios
    USERS: '/users',
    USER_BY_ID: (id) => `/users/${id}`,
    USER_SEARCH: '/users/search',
    USER_STATUS: (id) => `/users/${id}/status`,
    USER_ME: '/users/me',
    
    // Administradores
    ADMIN_REGISTER: '/admin/register',
    
    // Eventos
    ADMIN_EVENTS: '/api/admin/events',
    ADMIN_EVENTS_BY_BLOCK: '/api/admin/events/by-block-status',
    ADMIN_EVENT_TOGGLE_BLOCK: (id) => `/api/admin/events/${id}/toggle-block`,
    ADMIN_EVENT_STATUS: (id) => `/api/admin/events/${id}/status`,
    ADMIN_EVENT_STATISTICS: '/api/admin/events/statistics',
  }
};

// Estados de usuario
export const USER_STATES = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  BLOCKED: 'Blocked',
  PENDING: 'Pending'
};

// Estados de evento
export const EVENT_STATES = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  CANCELED: 'Canceled',
  COMPLETED: 'Completed'
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  SUBADMIN: 'SUBADMIN',
  USER: 'USER'
};

// Configuración de localStorage
export const STORAGE_KEYS = {
  TOKEN: 'event_hub_token',
  USER: 'event_hub_user'
};

