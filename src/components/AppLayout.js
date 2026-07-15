import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tienePermiso } from '../permisos';

const NAV_ITEMS = [
  { path: '/tablero', label: 'Tablero', icon: 'grid', iconUnselected: 'grid-outline' },
  { path: '/alertas', label: 'Alertas', icon: 'notifications', iconUnselected: 'notifications-outline' },
  { path: '/alertas/nueva', label: 'Nueva Alerta', icon: 'add-circle', iconUnselected: 'add-circle-outline' },
  { path: '/mapa', label: 'Mapa', icon: 'map', iconUnselected: 'map-outline' },
  { path: '/perfil', label: 'Mi Perfil', icon: 'person', iconUnselected: 'person-outline' },
  { path: '/admin', label: 'Admin', icon: 'settings', iconUnselected: 'settings-outline', adminOnly: true }
];

function SidebarIcon({ name }) {
  const icons = {
    grid: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    notifications: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    'add-circle': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    map: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
    person: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  };
  return icons[name] || null;
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
        <div className="top-nav-logo">
          <span style={{ fontSize: '18px' }}>&#x1F6E1;</span>
          <span className="top-nav-logo-text">CiudadAlerta</span>
        </div>
        <div className="top-nav-user">
          <span className="top-nav-name">{user.nombre}</span>
          <span className="top-nav-role">{user.rol}</span>
          <button className="top-nav-logout" onClick={logout} title="Salir">Salir</button>
        </div>
      </nav>

      <div className="app-body">
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
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
                  className={`sidebar-link ${location.pathname === item.path || (item.path !== '/tablero' && location.pathname.startsWith(item.path)) ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sidebar-link-icon">
                    <SidebarIcon name={item.icon} />
                  </span>
                  <span className="sidebar-link-label">{item.label}</span>
                </Link>
              </li>
            ))}
            <li className="sidebar-divider"></li>
            <li>
              <Link to="/" className="sidebar-link text-error" onClick={logout}>
                <span className="sidebar-link-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </span>
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
