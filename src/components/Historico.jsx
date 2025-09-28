import React from "react";

function Historico({ historico }) {
  return (
    <div className="card historico">
      <h2>Histórico</h2>
      {historico.length > 0 ? (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Umidade</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {historico.map((item, index) => (
              <tr key={index}>
                <td>{item.umidade}</td>
                <td>{item.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Carregando histórico...</p>
      )}
    </div>
  );
}

export default Historico;
