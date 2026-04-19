import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-hero">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-logo-wrapper">
            <img src="/Asuper_Logo.png" alt="Alsuper" className="hero-logo" />
          </div>
          <div className="hero-badge">Recursos Humanos</div>
          <h1 className="hero-title">
            Gestión de
            <span className="brand-text"> Empleados</span>
          </h1>
          <p className="hero-subtitle">
            Plataforma integral para la administración del personal de Alsuper.
            Realiza altas, bajas, cambios y consulta reportes de movimientos.
          </p>
          <div className="hero-actions">
            <button className="btn btn-hero-primary" onClick={() => navigate('/empleados')}>
              <span className="btn-icon">👤</span>
              Gestión de Empleados
            </button>
            <button className="btn btn-hero-secondary" onClick={() => navigate('/reportes')}>
              <span className="btn-icon">📊</span>
              Ver Reportes
            </button>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon feature-icon-create">+</div>
          <h3>Altas</h3>
          <p>Registra nuevos colaboradores con validación automática y bitácora.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon feature-icon-edit">✎</div>
          <h3>Cambios</h3>
          <p>Actualiza la información del personal con registro de modificaciones.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon feature-icon-delete">↓</div>
          <h3>Bajas</h3>
          <p>Baja lógica de empleados manteniendo el historial completo.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon feature-icon-report">📋</div>
          <h3>Bitácora</h3>
          <p>Consulta el registro detallado de todos los movimientos realizados.</p>
        </div>
      </div>

    </div>
  );
}
