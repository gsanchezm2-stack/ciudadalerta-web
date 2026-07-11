import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAlerta, cambiarEstadoAlerta, eliminarAlerta } from '../api';
import { useAuth } from '../context/AuthContext';
import { tienePermiso } from '../permisos';
import { ESTADOS_ALERTA, formatFecha } from '../utils';

export default function AlertaDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alerta, setAlerta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const esAutor = alerta?.autor?._id === user.id;
  const puedeCambiarEstado = tienePermiso(user.rol, 'alertas:cambiar_estado') || (tienePermiso(user.rol, 'alertas:cerrar_propia') && esAutor);
  const puedeEliminar = tienePermiso(user.rol, 'alertas:eliminar');

  const estadosDisponibles = tienePermiso(user.rol, 'alertas:cambiar_estado')
    ? ESTADOS_ALERTA
    : ['resuelto'];

  useEffect(() => {
    async function load() {
      try {
        const data = await getAlerta(id);
        setAlerta(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleEstadoChange = async (e) => {
    const nuevoEstado = e.target.value;
    try {
      const updated = await cambiarEstadoAlerta(id, nuevoEstado);
      setAlerta(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Seguro que quieres eliminar esta alerta?')) return;
    try {
      await eliminarAlerta(id);
      navigate('/alertas', { replace: true });
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="empty">Cargando...</p>;
  if (error) return <p className="empty text-error">{error}</p>;
  if (!alerta) return <p className="empty">Alerta no encontrada</p>;

  return (
    <div>
      <Link to="/alertas" className="back-link">&larr; Volver a alertas</Link>
      <div className="detail-card">
        <div className="detail-header">
          <span className={`badge badge-${alerta.estado}`}>{alerta.estado?.replace('_', ' ') || 'pendiente'}</span>
          <span className={`tipo-badge tipo-${alerta.tipo?.toLowerCase()}`}>{alerta.tipo}</span>
        </div>
        <h2 className="detail-title">{alerta.descripcion}</h2>
        <div className="detail-meta">
          <div className="detail-meta-item">
            <span className="detail-label">Sector</span>
            <span className="detail-value">{alerta.sector}</span>
          </div>
          <div className="detail-meta-item">
            <span className="detail-label">Fecha</span>
            <span className="detail-value">{formatFecha(alerta.fecha)}</span>
          </div>
          <div className="detail-meta-item">
            <span className="detail-label">Reportado por</span>
            <span className="detail-value">{alerta.autor?.nombre || 'Anonimo'}</span>
          </div>
          <div className="detail-meta-item">
            <span className="detail-label">ID</span>
            <span className="detail-value text-mono">{alerta._id}</span>
          </div>
        </div>

        {puedeCambiarEstado && (
          <div className="detail-actions">
            <label className="detail-action-label">Cambiar estado:</label>
            <select className="input" value={alerta.estado} onChange={handleEstadoChange}>
              {estadosDisponibles.map(e => (
                <option key={e} value={e}>{e.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        )}

        {puedeEliminar && (
          <div className="detail-actions detail-actions-danger">
            <button className="btn btn-danger" onClick={handleDelete}>Eliminar esta alerta</button>
          </div>
        )}
      </div>
    </div>
  );
}
