import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { crearAlerta } from '../api';
import { TIPOS_ALERTA } from '../utils';

export default function AlertaNew() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState('');
  const [sector, setSector] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!tipo || !descripcion.trim() || !sector.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (descripcion.trim().length < 10) {
      setError('La descripcion debe tener al menos 10 caracteres');
      return;
    }

    setLoading(true);
    try {
      await crearAlerta({ tipo, descripcion, sector });
      navigate('/alertas', { replace: true });
    } catch (err) {
      setError(err.message || 'No se pudo enviar la alerta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link to="/alertas" className="back-link">&larr; Volver a alertas</Link>
      <h2 className="page-title">Nueva Alerta</h2>

      {error && <p className="form-error">{error}</p>}

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Tipo de alerta</label>
          <select className="input" value={tipo} onChange={(e) => setTipo(e.target.value)} required>
            <option value="">Selecciona un tipo...</option>
            {TIPOS_ALERTA.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Sector</label>
          <input className="input" placeholder="Ej: Centro, Norte, Bella Vista..."
            value={sector} onChange={(e) => setSector(e.target.value)} required />
        </div>

        <div className="form-group">
          <label className="form-label">Descripcion detallada</label>
          <textarea className="input textarea" placeholder="Describe el problema con detalle (min. 10 caracteres)"
            value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="5" required />
          <span className="form-hint">{descripcion.length}/500 caracteres</span>
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Alerta'}
        </button>
      </form>
    </div>
  );
}
