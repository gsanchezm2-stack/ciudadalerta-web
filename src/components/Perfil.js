import { useAuth } from '../context/AuthContext';
export default function Perfil() {
  const { user, logout } = useAuth();

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

        <div className="perfil-actions">
          <button className="btn btn-danger" onClick={logout}>Cerrar sesion</button>
        </div>
      </div>
    </div>
  );
}
