import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { authService } from '../services/api';
import { STORAGE_KEYS } from '../constants/api';

// Estado inicial
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Tipos de acciones
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Crear contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      
      if (!token) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return;
      }

      try {
        const response = await authService.checkAuth();
        
        if (response.authenticated) {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user: { username: response.username },
              token: token
            }
          });
        } else {
          // Token inválido
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      } finally {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // Función de login
  // const login = async (credentials) => {
  //   dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
  //   try {
  //     const response = await authService.login(credentials);
      
  //     // Guardar token en localStorage
  //     localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      
  //     // Obtener información del usuario
  //     const userInfo = await authService.checkAuth();
      
  //     const userData = {
  //       username: userInfo.username
  //     };
      
  //     localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      
  //     dispatch({
  //       type: AUTH_ACTIONS.LOGIN_SUCCESS,
  //       payload: {
  //         user: userData,
  //         token: response.token
  //       }
  //     });
      
  //     return { success: true };
  //   } catch (error) {
  //     const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
  //     dispatch({
  //       type: AUTH_ACTIONS.LOGIN_FAILURE,
  //       payload: errorMessage
  //     });
  //     return { success: false, error: errorMessage };
  //   }
  // };

  // Función de login
  const login = useCallback(async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const response = await authService.login(credentials);
      
      // Guardar token en localStorage
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      
      // Obtener información del usuario
      const userInfo = await authService.checkAuth();
      
      const userData = {
        username: userInfo.username
      };
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: userData,
          token: response.token
        }
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Función de logout
  // const logout = () => {
  //   authService.logout();
  //   dispatch({ type: AUTH_ACTIONS.LOGOUT });
  // };

   // Función de logout
  const logout = useCallback(() => {
    authService.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  // Función para limpiar errores
  // const clearError = () => {
  //   dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  // };

  // Función para limpiar errores
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    ...state,
    login,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

