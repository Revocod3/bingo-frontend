import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { getApiUrl } from '../../config/env';

const apiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variable para controlar el proceso de refresh token
let isRefreshing = false;
interface PromiseQueueItem {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let failedQueue: PromiseQueueItem[] = [];

// Variable para evitar bucles infinitos de redirección
let isLoggingOut = false;

// Función para procesar la cola de solicitudes fallidas
const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom: PromiseQueueItem) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Add request interceptor to automatically include the auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Para solicitudes del lado del cliente, intenta primero con el token almacenado
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem('authToken');

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      } else {
        // Fallback: intenta obtener el token de la sesión de NextAuth
        const session = await getSession();
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si ya estamos en proceso de logout, no intentar refrescar token
    if (isLoggingOut) {
      return Promise.reject(error);
    }

    // Obtener la configuración de la solicitud original
    const originalRequest = error.config;

    // Si la respuesta es 401 (Unauthorized) y no es un reintento
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Si ya estamos refrescando, añadir esta solicitud a la cola
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Intentar refrescar el token
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          // No hay refresh token, cerrar sesión
          console.error('No hay refresh token disponible');
          await handleLogout();
          return Promise.reject(error);
        }

        // Llamar a la API de refresh token directamente (sin usar el interceptor)
        const response = await axios.post(`${getApiUrl()}/api/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        if (response.data.access) {
          // Guardar el nuevo token de acceso
          localStorage.setItem('authToken', response.data.access);

          // Actualizar el encabezado de autorización para esta solicitud
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

          // Procesar la cola con el nuevo token
          processQueue(null, response.data.access);

          // Reintento de la solicitud original
          return axios(originalRequest);
        } else {
          // Si la respuesta no contiene un token de acceso, cerrar sesión
          console.error('Error al refrescar el token: respuesta inválida');
          await handleLogout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Error al refrescar el token, cerrar sesión
        console.error('Error al refrescar el token:', refreshError);
        processQueue(refreshError, null);
        await handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Para otros errores, simplemente rechazar la promesa
    return Promise.reject(error);
  }
);

// Función para manejar el proceso de cierre de sesión
const handleLogout = async () => {
  // Prevenir múltiples llamadas simultáneas o bucles
  if (isLoggingOut) return;

  try {
    isLoggingOut = true;

    // Eliminar tokens del localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }

    // Cerrar la sesión de NextAuth sin redirección automática
    await signOut({ redirect: false });

    // Verificar si ya estamos en la página de login para evitar redirecciones innecesarias
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      // Solo redirigir si no estamos ya en la página de login
      if (!currentPath.includes('/auth/login')) {
        window.location.href = '/auth/login?session=expired';
      }
    }
  } catch (error) {
    console.error('Error durante el logout:', error);
  } finally {
    // Reiniciar el flag después de un breve retraso
    setTimeout(() => {
      isLoggingOut = false;
    }, 1000);
  }
};

export default apiClient;
