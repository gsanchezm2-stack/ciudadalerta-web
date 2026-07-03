import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

function App() {
  const [alertas, setAlertas] = useState([]);
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [sector, setSector] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [vista, setVista] = useState('alertas');

  const obtenerAlertas = async () => {
    const res = await fetch(`${API}/alertas`);
    const data = await res.json();
    setAlertas(data);
  };

  useEffect(() => {
    obtenerAlertas();
  }, []);

  const enviarAlerta = async () => {
    const res = await fetch(`${API}/alertas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, descripcion, sector })
    });
    const data = await res.json();
    setMensaje(data.mensaje);
    setTipo('');
    setDescripcion('');
    setSector('');
    obtenerAlertas();
  };

  const eliminarAlerta = async (id) => {
    await fetch(`${API}/alertas/${id}`, { method: 'DELETE' });
    obtenerAlertas();
  };

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header */}
      <div style={{ background: '#065A82', color: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>🚨 CiudadAlerta</h1>
        <p style={{ margin: '5px 0 0' }}>Plataforma digital de alertas y reportes ciudadanos</p>
      </div>

      {/* Navegación */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setVista('alertas')}
          style={{ padding: '10px 20px', background: vista === 'alertas' ? '#065A82' : '#ddd', color: vista === 'alertas' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Ver Alertas
        </button>
        <button onClick={() => setVista('nueva')}
          style={{ padding: '10px 20px', background: vista === 'nueva' ? '#065A82' : '#ddd', color: vista === 'nueva' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Nueva Alerta
        </button>
      </div>

      {/* Vista: Nueva Alerta */}
      {vista === 'nueva' && (
        <div style={{ background: '#f0f9fb', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <h2>Registrar nueva alerta</h2>
          {mensaje && <p style={{ color: 'green', fontWeight: 'bold' }}>{mensaje}</p>}
          <input placeholder="Tipo (Seguridad, Infraestructura, Ambiente...)"
            value={tipo} onChange={e => setTipo(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          <input placeholder="Sector o barrio"
            value={sector} onChange={e => setSector(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          <textarea placeholder="Descripción de la alerta"
            value={descripcion} onChange={e => setDescripcion(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', height: '100px' }} />
          <button onClick={enviarAlerta}
            style={{ background: '#028090', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>
            Enviar Alerta
          </button>
        </div>
      )}

      {/* Vista: Lista de Alertas */}
      {vista === 'alertas' && (
        <div>
          <h2>Alertas registradas ({alertas.length})</h2>
          {alertas.length === 0 && <p style={{ color: '#888' }}>No hay alertas registradas aún.</p>}
          {alertas.map(alerta => (
            <div key={alerta._id} style={{ background: '#f0f9fb', padding: '15px', borderRadius: '10px', marginBottom: '10px', borderLeft: '5px solid #065A82' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: '#065A82' }}>{alerta.tipo}</h3>
                <button onClick={() => eliminarAlerta(alerta._id)}
                  style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>
                  Eliminar
                </button>
              </div>
              <p style={{ margin: '5px 0' }}>{alerta.descripcion}</p>
              <small style={{ color: '#888' }}>📍 {alerta.sector} · {new Date(alerta.fecha).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default App;