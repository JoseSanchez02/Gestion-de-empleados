import { useState, useEffect, useCallback } from 'react';
import { getEmpleados, createEmpleado, updateEmpleado, deleteEmpleado } from '../services/api';
import './Empleados.css';

export default function EmpleadoList() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [formNombre, setFormNombre] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [soloActivos, setSoloActivos] = useState(false);
  const [alertaDepuracion, setAlertaDepuracion] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchEmpleados = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch ALL employees to maintain static stats in the UI
      const response = await getEmpleados(false);
      setEmpleados(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  // Logic for 'approaching deletion' alerta (75+ days inactity)
  const isProximoABaja = useCallback((emp) => {
    const lastDateStr = emp.fechaModificacion || emp.fechaAlta;
    if (!lastDateStr) return false;
    const lastDate = new Date(lastDateStr);
    const diffTime = Math.abs(new Date() - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 75;
  }, []);

  // Frontend filtering logic
  const displayEmpleados = empleados.filter(emp => {
    if (soloActivos && !emp.activo) return false;
    if (alertaDepuracion && !isProximoABaja(emp)) return false;
    return true;
  });

  // Static stats (unfiltered)
  const totalCount = empleados.length;
  const activosCount = empleados.filter(e => e.activo).length;
  const inactivosCount = empleados.filter(e => !e.activo).length;

  const handleOpenCreate = () => {
    setEditingEmpleado(null);
    setFormNombre('');
    setShowForm(true);
  };

  const handleOpenEdit = (empleado) => {
    setEditingEmpleado(empleado);
    setFormNombre(empleado.nombre);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEmpleado(null);
    setFormNombre('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formNombre.trim()) {
      showToast('El nombre del empleado es obligatorio.', 'error');
      return;
    }

    try {
      setFormLoading(true);
      if (editingEmpleado) {
        await updateEmpleado(editingEmpleado.idEmpleado, formNombre.trim());
        showToast('Empleado actualizado exitosamente.');
      } else {
        await createEmpleado(formNombre.trim());
        showToast('Empleado creado exitosamente.');
      }
      handleCloseForm();
      await fetchEmpleados();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmpleado(id);
      showToast('Empleado dado de baja exitosamente.');
      setConfirmDelete(null);
      await fetchEmpleados();
    } catch (err) {
      showToast(err.message, 'error');
      setConfirmDelete(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="empleados-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="toast-icon">{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="empleados-header">
        <div className="header-left">
          <h1>Gestión de Empleados</h1>
          <p className="subtitle">Administra altas, bajas y cambios del personal</p>
        </div>
        <div className="header-actions">
          <label className="filter-toggle" title="Filtrar solo registros activos">
            <input
              type="checkbox"
              checked={soloActivos}
              onChange={(e) => setSoloActivos(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Solo activos</span>
          </label>

          <label className="filter-toggle" title="Empleados con más de 75 días sin actividad">
            <input
              type="checkbox"
              checked={alertaDepuracion}
              onChange={(e) => setAlertaDepuracion(e.target.checked)}
            />
            <span className="toggle-slider toggle-warning"></span>
            <span className="toggle-label">Alerta de Depuración</span>
          </label>

          <button className="btn btn-primary btn-nuevo" onClick={handleOpenCreate}>
            <span className="btn-icon">+</span>
            Nuevo Empleado
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando empleados...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <span className="error-icon">⚠</span>
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={fetchEmpleados}>Reintentar</button>
        </div>
      ) : (
        <>
          <div className="table-container">
            {displayEmpleados.length === 0 ? (
              <div className="empty-container">
                <div className="empty-icon">🔍</div>
                <h3>No se encontraron resultados</h3>
                <p>Prueba ajustando los filtros de búsqueda.</p>
                {(soloActivos || alertaDepuracion) && (
                  <button className="btn btn-secondary" onClick={() => { setSoloActivos(false); setAlertaDepuracion(false); }}>
                    Limpiar Filtros
                  </button>
                )}
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Estatus</th>
                    <th>Fecha de Alta</th>
                    <th>Última Modificación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {displayEmpleados.map((emp) => {
                    const critical = isProximoABaja(emp);
                    return (
                      <tr key={emp.idEmpleado} className={`${!emp.activo ? 'row-inactive' : ''} ${critical ? 'row-critical' : ''}`}>
                        <td className="td-id">{emp.idEmpleado}</td>
                        <td className="td-nombre">
                          {emp.nombre}
                          {critical && <span className="warning-dot" title="Próximo a depuración (+75 días inactivo)">⚠️</span>}
                        </td>
                        <td>
                          <span className={`badge ${emp.activo ? 'badge-active' : 'badge-inactive'}`}>
                            {emp.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="td-date">{formatDate(emp.fechaAlta)}</td>
                        <td className="td-date">{formatDate(emp.fechaModificacion)}</td>
                        <td className="td-actions">
                          <button
                            className="btn-action btn-edit"
                            onClick={() => handleOpenEdit(emp)}
                            title="Editar empleado"
                          >
                            ✎
                          </button>
                          {emp.activo && (
                            <button
                              className="btn-action btn-delete"
                              onClick={() => setConfirmDelete(emp.idEmpleado)}
                              title="Dar de baja"
                            >
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Stats Cards - MOVED BELOW TABLE */}
          <div className="stats-row stats-footer">
            <div className="stat-card">
              <div className="stat-number">{totalCount}</div>
              <div className="stat-label">Total Empleados</div>
            </div>
            <div className="stat-card stat-active">
              <div className="stat-number">{activosCount}</div>
              <div className="stat-label">Activos en Sistema</div>
            </div>
            <div className="stat-card stat-inactive">
              <div className="stat-number">{inactivosCount}</div>
              <div className="stat-label">Inactivos</div>
            </div>
          </div>
        </>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
              <button className="modal-close" onClick={handleCloseForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre del Empleado *</label>
                <input
                  id="nombre"
                  type="text"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  placeholder="Ingresa el nombre completo"
                  autoFocus
                  maxLength={100}
                  required
                />
              </div>
              {editingEmpleado && (
                <div className="form-info">
                  <span>ID: {editingEmpleado.idEmpleado}</span>
                  <span>Alta: {formatDate(editingEmpleado.fechaAlta)}</span>
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? 'Guardando...' : (editingEmpleado ? 'Actualizar' : 'Crear Empleado')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirmar Baja</h2>
              <button className="modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
            </div>
            <p className="confirm-text">
              ¿Estás seguro de que deseas dar de baja al empleado con ID <strong>{confirmDelete}</strong>?
            </p>
            <p className="confirm-subtext">Esta acción cambiará su estatus a inactivo.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>
                Confirmar Baja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
