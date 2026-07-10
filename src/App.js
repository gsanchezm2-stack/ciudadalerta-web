import React, { useState, useEffect } from 'react';
import './App.css';

const API = 'http://localhost:5000/api';

export default function App() {
  const [alertas, setAlertas] = useState([]);
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [sector, setSector] = useState('');
  const [vista, setVista] = useState('alertas');

  const obtenerAlertas = async () => {
    try {
      const res = await fetch(`${API}/alertas`);
      if (!res.ok) throw new Error('Error al obtener alertas');
      const data = await res.json();
      setAlertas(data);
    } catch (error) {
      alert('Error: No se pudo conectar al servidor');
    }
  };

  useEffect(() => {
    obtenerAlertas();
  }, []);

  const enviarAlerta = async () => {
    if (!tipo || !descripcion || !sector) {
      alert('Por favor completa todos los campos');
      return;
    }
    try {
      const response = await fetch(`${API}/alertas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, descripcion, sector })
      });
      
      if (!response.ok) throw new Error('Error al enviar');
      
      alert('Alerta registrada correctamente');
      setTipo('');
      setDescripcion('');
      setSector('');
      setVista('alertas');
      obtenerAlertas();
    } catch (error) {
      alert('No se pudo enviar la alerta');
    }
  };

  const eliminarAlerta = async (id) => {
    if (window.confirm('Deseas eliminar esta alerta?')) {
      try {
        await fetch(`${API}/alertas/${id}`, { method: 'DELETE' });
        obtenerAlertas();
      } catch (error) {
        alert('Error al eliminar la alerta');
      }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="headerTitle">CiudadAlerta</h1>
        <p className="headerSubtitle">Plataforma de alertas ciudadanas</p>
      </div>

      <div className="nav">
        <button 
          className={`navBtn ${vista === 'alertas' ? 'navBtnActive' : ''}`}
          onClick={() => setVista('alertas')}>
          Ver Alertas
        </button>
        <button 
          className={`navBtn ${vista === 'nueva' ? 'navBtnActive' : ''}`}
          onClick={() => setVista('nueva')}>
          Nueva Alerta
        </button>
      </div>

      {vista === 'nueva' && (
        <div className="form">
          <h3 className="formTitle">Registrar nueva alerta</h3>
          <input 
            className="input" 
            placeholder="Tipo (Ej: Seguridad, Infraestructura...)"
            value={tipo} 
            onChange={(e) => setTipo(e.target.value)} />
          <input 
            className="input" 
            placeholder="Sector o barrio"
            value={sector} 
            onChange={(e) => setSector(e.target.value)} />
          <textarea 
            className="input textarea" 
            placeholder="Descripcion detallada de la alerta"
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)} 
            rows="4" />
          <button className="btnEnviar" onClick={enviarAlerta}>
            Enviar Alerta
          </button>
        </div>
      )}

      {vista === 'alertas' && (
        <div className="lista">
          {alertas.length === 0 ? (
            <p className="empty">No hay alertas registradas</p>
          ) : (
            alertas.map((item) => (
              <div key={item._id} className="card">
                <div className="cardHeader">
                  <span className="cardTipo">{item.tipo}</span>
                  <button className="btnEliminar" onClick={() => eliminarAlerta(item._id)}>
                    Eliminar
                  </button>
                </div>
                <p className="cardDesc">{item.descripcion}</p>
                <p className="cardSector">{item.sector}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}