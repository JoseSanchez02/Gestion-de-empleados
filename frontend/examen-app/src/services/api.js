/**
 * Servicio de API para consumir los endpoints del backend.
 * Todas las operaciones se realizan mediante Stored Procedures en el servidor.
 */

const API_BASE_URL = 'http://localhost:5050/api';

/**
 * Helper para realizar peticiones HTTP con manejo de errores.
 */
async function request(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error HTTP: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('No se pudo conectar con el servidor. Verifica que la API esté ejecutándose.');
    }
    throw error;
  }
}

// =============================================
// Endpoints de Empleados
// =============================================

/**
 * Obtener la lista de empleados.
 * @param {boolean} soloActivos - Filtrar solo empleados activos.
 */
export async function getEmpleados(soloActivos = false) {
  return request(`${API_BASE_URL}/empleados?soloActivos=${soloActivos}`);
}

/**
 * Obtener un empleado por su Id.
 * @param {number} id - Id del empleado.
 */
export async function getEmpleadoById(id) {
  return request(`${API_BASE_URL}/empleados/${id}`);
}

/**
 * Alta de un nuevo empleado.
 * @param {string} nombre - Nombre del empleado.
 */
export async function createEmpleado(nombre) {
  return request(`${API_BASE_URL}/empleados`, {
    method: 'POST',
    body: JSON.stringify({ nombre }),
  });
}

/**
 * Cambio/Actualización de un empleado.
 * @param {number} id - Id del empleado.
 * @param {string} nombre - Nuevo nombre del empleado.
 */
export async function updateEmpleado(id, nombre) {
  return request(`${API_BASE_URL}/empleados/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ nombre }),
  });
}

/**
 * Baja lógica de un empleado.
 * @param {number} id - Id del empleado.
 */
export async function deleteEmpleado(id) {
  return request(`${API_BASE_URL}/empleados/${id}`, {
    method: 'DELETE',
  });
}

// =============================================
// Endpoints de Movimientos (Bitácora)
// =============================================

/**
 * Obtener la bitácora de movimientos.
 * @param {number|null} idEmpleado - Filtrar por empleado (opcional).
 * @param {string|null} tipoMovimiento - Filtrar por tipo (Alta, Baja, Cambio) (opcional).
 */
export async function getMovimientos(idEmpleado = null, tipoMovimiento = null) {
  const params = new URLSearchParams();
  if (idEmpleado) params.append('idEmpleado', idEmpleado);
  if (tipoMovimiento) params.append('tipoMovimiento', tipoMovimiento);

  const queryString = params.toString();
  const url = `${API_BASE_URL}/movimientos${queryString ? '?' + queryString : ''}`;
  return request(url);
}
