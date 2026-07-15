import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registrarUsuario(nombre, email, password);
      alert('Registrado exitosamente. Ahora inicia sesion.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'No se pudo conectar al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h1 className="auth-brand">CiudadAlerta</h1>
        <p className="auth-brand-sub">Plataforma de alertas ciudadanas</p>
      </div>
      <div className="auth-container">
        <div className="auth-box">
          <h2 className="auth-title">Crear Cuenta</h2>
          {error && <p className="auth-error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input className="input" type="text" placeholder="Nombre completo" value={nombre}
              onChange={(e) => setNombre(e.target.value)} required autoFocus />
            <input className="input" type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
            <input className="input" type="password" placeholder="Contrasena (min. 8 caracteres)" value={password}
              onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
          <p className="auth-toggle">
            Ya tienes cuenta?{' '}
            <a href="/login" className="auth-link" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Inicia sesion</a>
          </p>
        </div>
      </div>
    </div>
  );
}
