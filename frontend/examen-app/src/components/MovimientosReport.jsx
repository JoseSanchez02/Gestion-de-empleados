import { useState, useEffect, useCallback } from 'react';
import { getMovimientos } from '../services/api';
import './Reportes.css';

export default function MovimientosReport() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEmpleado, setFiltroEmpleado] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const fetchMovimientos = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch ALL movements to allow frontend-only filtering and static stats
      const response = await getMovimientos(null, null);
      setMovimientos(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovimientos();
  }, [fetchMovimientos]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getTipoBadgeClass = (tipo) => {
    switch (tipo) {
      case 'Alta':
        return 'badge-alta';
      case 'Baja':
        return 'badge-baja';
      case 'Cambio':
        return 'badge-cambio';
      default:
        return '';
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'Alta':
        return '↑';
      case 'Baja':
        return '↓';
      case 'Cambio':
        return '↔';
      default:
        return '•';
    }
  };

  // Frontend Filtering Logic
  const displayMovimientos = movimientos.filter(mov => {
    // Filter by type
    if (filtroTipo && mov.tipoMovimiento !== filtroTipo) return false;
    
    // Filter by employee ID
    if (filtroEmpleado && mov.idEmpleado.toString() !== filtroEmpleado) return false;
    
    // Filter by date range
    if (fechaInicio) {
      const start = new Date(fechaInicio);
      start.setHours(0, 0, 0, 0);
      if (new Date(mov.fechaMovimiento) < start) return false;
    }
    if (fechaFin) {
      const end = new Date(fechaFin);
      end.setHours(23, 59, 59, 999);
      if (new Date(mov.fechaMovimiento) > end) return false;
    }
    
    return true;
  });

  // Static Stats (unfiltered)
  const stats = {
    total: movimientos.length,
    altas: movimientos.filter(m => m.tipoMovimiento === 'Alta').length,
    bajas: movimientos.filter(m => m.tipoMovimiento === 'Baja').length,
    cambios: movimientos.filter(m => m.tipoMovimiento === 'Cambio').length,
  };

  const clearFilters = () => {
    setFiltroTipo('');
    setFiltroEmpleado('');
    setFechaInicio('');
    setFechaFin('');
  };

  return (
    <div className="reportes-container">
      {/* Header */}
      <div className="reportes-header">
        <div className="header-left">
          <h1>Reporte de Movimientos</h1>
          <p className="subtitle">Bitácora de altas, bajas y cambios registrados</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Movimientos</div>
        </div>
        <div className="stat-card stat-alta">
          <div className="stat-number">{stats.altas}</div>
          <div className="stat-label">Altas</div>
        </div>
        <div className="stat-card stat-baja">
          <div className="stat-number">{stats.bajas}</div>
          <div className="stat-label">Bajas</div>
        </div>
        <div className="stat-card stat-cambio">
          <div className="stat-number">{stats.cambios}</div>
          <div className="stat-label">Cambios</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-row">
        <div className="filter-group">
          <label htmlFor="filtroTipo">Tipo</label>
          <select
            id="filtroTipo"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Alta">Alta</option>
            <option value="Baja">Baja</option>
            <option value="Cambio">Cambio</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="filtroEmpleado">ID Emp.</label>
          <input
            id="filtroEmpleado"
            type="number"
            value={filtroEmpleado}
            onChange={(e) => setFiltroEmpleado(e.target.value)}
            placeholder="ID"
            min="1"
            style={{ width: '80px' }}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="fechaInicio">Desde</label>
          <input
            id="fechaInicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="fechaFin">Hasta</label>
          <input
            id="fechaFin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary btn-clear" onClick={clearFilters}>
          Limpiar
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando movimientos...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <span className="error-icon">⚠</span>
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={fetchMovimientos}>Reintentar</button>
        </div>
      ) : movimientos.length === 0 ? (
        <div className="empty-container">
          <div className="empty-icon">📋</div>
          <h3>No hay movimientos registrados</h3>
          <p>Los movimientos se registrarán automáticamente al realizar operaciones CRUD.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Mov.</th>
                <th>ID Empleado</th>
                <th>Nombre Empleado</th>
                <th>Tipo</th>
                <th>Fecha y Hora</th>
              </tr>
            </thead>
            <tbody>
              {displayMovimientos.map((mov) => (
                <tr key={mov.idMovimiento}>
                  <td className="td-id">{mov.idMovimiento}</td>
                  <td className="td-id">{mov.idEmpleado}</td>
                  <td className="td-nombre">{mov.nombreEmpleado}</td>
                  <td>
                    <span className={`badge ${getTipoBadgeClass(mov.tipoMovimiento)}`}>
                      <span className="badge-icon">{getTipoIcon(mov.tipoMovimiento)}</span>
                      {mov.tipoMovimiento}
                    </span>
                  </td>
                  <td className="td-date">{formatDate(mov.fechaMovimiento)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
