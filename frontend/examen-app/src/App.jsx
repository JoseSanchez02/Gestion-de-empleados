import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import EmpleadoList from './components/EmpleadoList';
import MovimientosReport from './components/MovimientosReport';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/empleados" element={<EmpleadoList />} />
            <Route path="/reportes" element={<MovimientosReport />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
