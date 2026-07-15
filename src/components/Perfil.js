import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const THEME_OPTIONS = [
  { value: 'light', label: 'Claro', icon: '\u2600\uFE0F' },
  { value: 'dark', label: 'Oscuro', icon: '\u{1F319}' },
  { value: 'auto', label: 'Automatico', icon: '\u{1F5A8}\uFE0F' },
];

export default function Perfil() {
  const { user, logout } = useAuth();
  const { mode, setThemeMode } = useTheme();

  return (
    <div>
      <h2 className="page-title">Mi Perfil</h2>

      <div className="perfil-card">
        <div className="perfil-avatar-large">{user.nombre?.charAt(0).toUpperCase()}</div>
        <div className="perfil-info">
          <div className="perfil-row">
            <span className="perfil-label">Nombre</span>
            <span className="perfil-value">{user.nombre}</span>
          </div>
          <div className="perfil-row">
            <span className="perfil-label">Email</span>
            <span className="perfil-value">{user.email}</span>
          </div>
          <div className="perfil-row">
            <span className="perfil-label">Rol</span>
            <span className="perfil-value">
              <span className={`role-badge role-${user.rol}`}>{user.rol}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="perfil-card" style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--text-secondary)', marginBottom: 12, alignSelf: 'flex-start' }}>
          Apariencia
        </h3>
        <div className="theme-selector">
          {THEME_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setThemeMode(opt.value)}
              className={`theme-option ${mode === opt.value ? 'theme-option-active' : ''}`}
            >
              <span>{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="perfil-actions" style={{ marginTop: 16 }}>
        <button className="btn btn-danger" onClick={logout}>Cerrar sesion</button>
      </div>
    </div>
  );
}
