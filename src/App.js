import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { loginUser, registrarUsuario, forgotPassword, resetPassword } from './api';

const AppLayout = lazy(() => import('./components/AppLayout'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const AlertasList = lazy(() => import('./components/AlertasList'));
const AlertaDetail = lazy(() => import('./components/AlertaDetail'));
const AlertaNew = lazy(() => import('./components/AlertaNew'));
const Perfil = lazy(() => import('./components/Perfil'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const MapaAlertas = lazy(() => import('./components/MapaAlertas'));

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/tablero" replace />;
  return children;
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState(0);
  const [resetMsg, setResetMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      login(data.usuario, data.token);
      navigate('/tablero', { replace: true });
    } catch (err) {
      setError(err.message || 'No se pudo conectar al servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setResetMsg('');
    setLoading(true);
    try {
      const data = await forgotPassword(resetEmail);
      setResetToken(data.resetToken);
      setResetMsg('Token de recuperacion recibido');
      setResetStep(1);
    } catch (err) {
      setResetMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetMsg('');
    setLoading(true);
    try {
      await resetPassword(resetToken, newPassword);
      setResetMsg('Contrasena actualizada. Ya puedes iniciar sesion.');
      setResetStep(2);
    } catch (err) {
      setResetMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showForgot) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-primary-700 text-white px-6 py-5">
          <h1 className="text-2xl font-bold">CiudadAlerta</h1>
          <p className="text-primary-200 text-sm mt-1">Recuperar contrasena</p>
        </div>
        <div className="auth-container">
          <div className="auth-box">
            <h2 className="auth-title">Recuperar Contrasena</h2>
            {resetMsg && <p className={resetStep === 2 ? 'auth-success' : 'auth-error'}>{resetMsg}</p>}

            {resetStep === 0 && (
              <form onSubmit={handleForgot}>
                <input className="input" type="email" placeholder="Tu email" value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)} required autoFocus />
                <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar enlace'}
                </button>
              </form>
            )}

            {resetStep === 1 && (
              <form onSubmit={handleReset}>
                <input className="input" type="password" placeholder="Nueva contrasena (min. 8)" value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} required minLength={8} autoFocus />
                <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                  {loading ? 'Actualizando...' : 'Cambiar contrasena'}
                </button>
              </form>
            )}

            {resetStep === 2 && (
              <button className="btn btn-primary btn-block" onClick={() => { setShowForgot(false); setResetStep(0); }}>
                Volver al login
              </button>
            )}

            <p className="auth-toggle">
              <a href="/login" className="auth-link" onClick={(e) => { e.preventDefault(); setShowForgot(false); setResetStep(0); }}>Volver al login</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-700 text-white px-6 py-5">
        <h1 className="text-2xl font-bold">CiudadAlerta</h1>
        <p className="text-primary-200 text-sm mt-1">Plataforma de alertas ciudadanas</p>
      </div>
      <div className="auth-container">
        <div className="auth-box">
          <h2 className="auth-title">Iniciar Sesion</h2>
          {error && <p className="auth-error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input className="input" type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)} required autoFocus />
            <input className="input" type="password" placeholder="Contrasena" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <p className="auth-toggle">
            <a href="/forgot" className="auth-link" onClick={(e) => { e.preventDefault(); setShowForgot(true); }}>Olvidaste tu contrasena?</a>
          </p>
          <p className="auth-toggle">
            No tienes cuenta?{' '}
            <a href="/registro" className="auth-link" onClick={(e) => { e.preventDefault(); navigate('/registro'); }}>Registrate</a>
          </p>
        </div>
      </div>
    </div>
  );
}

function RegisterPage() {
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-700 text-white px-6 py-5">
        <h1 className="text-2xl font-bold">CiudadAlerta</h1>
        <p className="text-primary-200 text-sm mt-1">Plataforma de alertas ciudadanas</p>
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

export default function AppWrapper() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="empty">Cargando...</div>}>
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/registro" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/tablero" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tablero" element={<Dashboard />} />
              <Route path="alertas" element={<AlertasList />} />
              <Route path="alertas/nueva" element={<AlertaNew />} />
              <Route path="alertas/:id" element={<AlertaDetail />} />
              <Route path="mapa" element={<MapaAlertas />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="admin" element={<AdminPanel />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
