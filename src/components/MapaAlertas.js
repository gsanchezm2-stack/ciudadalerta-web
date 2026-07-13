import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAlertas } from '../api';
import { formatFecha } from '../utils';

const markerColors = {
  Seguridad: '#dc2626',
  Infraestructura: '#d97706',
  Movilidad: '#2563eb',
  Ambiental: '#16a34a',
  Salud: '#9333ea',
  Educacion: '#3730a3',
  Otro: '#6b7280'
};

function createIcon(color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:24px;height:24px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
}

export default function MapaAlertas() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getAlertas({ limit: '100' });
        setAlertas(data.alertas || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const alertasFiltradas = useMemo(() => {
    if (!filtroTipo) return alertas;
    return alertas.filter(a => a.tipo === filtroTipo);
  }, [alertas, filtroTipo]);

  const alertasConCoords = useMemo(() => {
    return alertasFiltradas.filter(a => a.lat && a.lng);
  }, [alertasFiltradas]);

  const centro = useMemo(() => {
    if (alertasConCoords.length === 0) return [18.5, -69.9];
    const avgLat = alertasConCoords.reduce((s, a) => s + a.lat, 0) / alertasConCoords.length;
    const avgLng = alertasConCoords.reduce((s, a) => s + a.lng, 0) / alertasConCoords.length;
    return [avgLat, avgLng];
  }, [alertasConCoords]);

  if (loading) return <p className="empty">Cargando mapa...</p>;

  return (
    <div>
      <h2 className="page-title">Mapa de Alertas</h2>

      <div className="filter-bar">
        <select className="input filter-input" value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          {['Seguridad', 'Infraestructura', 'Movilidad', 'Ambiental', 'Salud', 'Educacion', 'Otro'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <span className="pagination-info">{alertasConCoords.length} alertas con ubicacion</span>
      </div>

      <div className="map-container">
        <MapContainer center={centro} zoom={12} style={{ height: '500px', width: '100%', borderRadius: '14px' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {alertasConCoords.map(a => (
            <Marker key={a._id} position={[a.lat, a.lng]} icon={createIcon(markerColors[a.tipo] || '#6b7280')}>
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <strong>{a.tipo}</strong><br />
                  <span style={{ fontSize: 12, color: '#666' }}>{formatFecha(a.fecha)}</span>
                  <p style={{ margin: '6px 0', fontSize: 13 }}>{a.descripcion?.slice(0, 80)}...</p>
                  <p style={{ fontSize: 12, color: '#888' }}>{a.sector}</p>
                  <Link to={`/alertas/${a._id}`} style={{ fontSize: 12, color: '#065A82', fontWeight: 600 }}>
                    Ver detalle &rarr;
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {alertasConCoords.length === 0 && (
        <p className="empty">No hay alertas con ubicacion para mostrar</p>
      )}
    </div>
  );
}
