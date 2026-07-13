import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tienePermiso } from '../permisos';

const NAV_ITEMS = [
  { path: '/tablero', label: 'Tablero', icon: '\u{1F4CA}' },
  { path: '/alertas', label: 'Ver Alertas', icon: '\u{1F514}' },
  { path: '/alertas/nueva', label: 'Nueva Alerta', icon: '\u{2795}' },
  { path: '/mapa', label: 'Mapa', icon: '\u{1F5FA}' },
  { path: '/perfil', label: 'Mi Perfil', icon: '\u{1F464}' },
  { path: '/admin', label: 'Admin', icon: '\u{2699}', adminOnly: true }
];

function DarkModeToggle() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return (
    <button className="theme-toggle" onClick={() => {
      const next = !isDark;
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
      localStorage.setItem('darkMode', next);
    }} title={isDark ? 'Modo claro' : 'Modo oscuro'}>
      {isDark ? '\u2600\uFE0F' : '\u{1F319}'}
    </button>
  );
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <nav className="top-nav">
        <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <span></span><span></span><span></span>
        </button>
        <div className="top-nav-brand">
          <img src="/favicon.svg" alt="CiudadAlerta" className="top-nav-logo-img" />
          <span className="top-nav-logo">CiudadAlerta</span>
        </div>
        <div className="top-nav-user">
          <DarkModeToggle />
          <span className="top-nav-name">{user.nombre}</span>
          <span className="top-nav-role">({user.rol})</span>
          <button className="top-nav-logout" onClick={logout} title="Salir">Salir</button>
        </div>
      </nav>

      <div className="app-body">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user.nombre.charAt(0).toUpperCase()}</div>
            <div className="sidebar-info">
              <span className="sidebar-name">{user.nombre}</span>
              <span className="sidebar-role">{user.rol}</span>
            </div>
          </div>
          <ul className="sidebar-nav">
            {NAV_ITEMS.filter(item => !item.adminOnly || tienePermiso(user.rol, 'usuarios:ver')).map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sidebar-link-icon">{item.icon}</span>
                  <span className="sidebar-link-label">{item.label}</span>
                </Link>
              </li>
            ))}
            <li className="sidebar-divider"></li>
            <li>
              <Link to="/" className="sidebar-link text-error" onClick={logout}>
                <span className="sidebar-link-icon">X</span>
                <span className="sidebar-link-label">Cerrar sesion</span>
              </Link>
            </li>
          </ul>
        </aside>
        <main className="main-content" onClick={() => setSidebarOpen(false)}>
          <div className="main-inner"><Outlet /></div>
        </main>
      </div>
    </div>
  );
}
