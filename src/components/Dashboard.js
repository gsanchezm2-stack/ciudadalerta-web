import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAlertas, getStats } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recientes, setRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, alertasData] = await Promise.all([getStats(), getAlertas({ limit: '5' })]);
        setStats(s);
        setRecientes(alertasData.alertas || []);
      } catch (e) {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const estadoData = stats?.porEstado || {};
  const total = stats?.total || recientes.length;

  return (
    <div>
      <h2 className="page-title">Tablero</h2>
      <p className="page-subtitle">Bienvenido, {user.nombre}</p>

      {loading ? (
        <p className="empty">Cargando...</p>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card stat-total">
              <span className="stat-number">{total}</span>
              <span className="stat-label">Total Alertas</span>
            </div>
            <div className="stat-card stat-pending">
              <span className="stat-number">{estadoData['pendiente'] || 0}</span>
              <span className="stat-label">Pendientes</span>
            </div>
            <div className="stat-card stat-review">
              <span className="stat-number">{estadoData['en_revision'] || 0}</span>
              <span className="stat-label">En revision</span>
            </div>
            <div className="stat-card stat-resolved">
              <span className="stat-number">{estadoData['resuelto'] || 0}</span>
              <span className="stat-label">Resueltos</span>
            </div>
          </div>

          <div className="section-title">Alertas recientes</div>
          <div className="recent-list">
            {recientes.map(a => (
              <Link to={`/alertas/${a._id}`} key={a._id} className="recent-card">
                <div className="recent-card-left">
                  <span className={`badge badge-${a.estado}`}>{a.estado?.replace('_', ' ') || 'pendiente'}</span>
                  <span className="recent-tipo">{a.tipo}</span>
                </div>
                <p className="recent-desc">{a.descripcion?.slice(0, 60)}...</p>
              </Link>
            ))}
            {recientes.length === 0 && <p className="empty">No hay alertas recientes</p>}
          </div>
        </>
      )}
    </div>
  );
}
