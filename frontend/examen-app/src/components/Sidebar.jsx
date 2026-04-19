import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleSalir = () => {
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src="/Asuper_Logo.png" alt="Alsuper" className="logo-img" />
          <div className="logo-text">
            <span className="logo-title">ALSUPER</span>
            <span className="logo-subtitle">Recursos Humanos</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title">MENÚ PRINCIPAL</span>
          <NavLink
            to="/empleados"
            className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-label">Gestión de Empleados</span>
          </NavLink>
          <NavLink
            to="/reportes"
            className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Reporte de Usuarios</span>
          </NavLink>
        </div>
      </nav>

      <div className="sidebar-footer">
        <button
          className={`nav-item nav-item-salir ${isHome ? 'nav-item-disabled' : ''}`}
          onClick={handleSalir}
          disabled={isHome}
        >
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Salir</span>
        </button>
        <div className="sidebar-version">Alsuper RRHH v1.0</div>
      </div>
    </aside>
  );
}
