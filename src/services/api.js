import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../constants/api';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
    return response.data;
  },
  
  checkAuth: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CHECK_AUTH);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

// Servicios de usuarios
export const userService = {
  getAll: async (state = null) => {
    const params = state ? { state } : {};
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.USERS, { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.USER_BY_ID(id));
    return response.data;
  },
  
  search: async (username) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.USER_SEARCH, {
      params: { username }
    });
    return response.data;
  },
  
  changeStatus: async (id, state) => {
    const response = await apiClient.patch(API_CONFIG.ENDPOINTS.USER_STATUS(id), { state });
    return response.data;
  },
  
  getMe: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.USER_ME);
    return response.data;
  }
};

// Servicios de administradores
export const adminService = {
  register: async (adminData) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.ADMIN_REGISTER, adminData);
    return response.data;
  }
};

// Servicios de eventos
export const eventService = {
  getAll: async (status = null, page = 0, size = 10) => {
    const params = { page, size };
    if (status) params.status = status;
    
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADMIN_EVENTS, { params });
    console.log(response.data)
    return response.data;
  },
  
  getByBlockStatus: async (bloqueado) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADMIN_EVENTS_BY_BLOCK, {
      params: { bloqueado }
    });
    return response.data;
  },
  
  toggleBlock: async (id) => {
    const response = await apiClient.patch(API_CONFIG.ENDPOINTS.ADMIN_EVENT_TOGGLE_BLOCK(id));
    return response.data;
  },
  
  changeStatus: async (id, newStatus) => {
    const response = await apiClient.patch(API_CONFIG.ENDPOINTS.ADMIN_EVENT_STATUS(id), null, {
      params: { newStatus }
    });
    return response.data;
  },
  
  getStatistics: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADMIN_EVENT_STATISTICS);
    return response.data;
  }
};

export default apiClient;

