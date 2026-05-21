import React from 'react';
export default function Admin({ setAdminMode }) {
  return (
    <div style={{ padding: 50, background: 'white', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999 }}>
      <h1>Panel Admin</h1>
      <button onClick={() => setAdminMode(false)}>Kembali ke Kasir</button>
    </div>
  );
}