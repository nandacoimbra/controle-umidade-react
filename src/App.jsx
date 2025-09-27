import { useEffect, useState } from "react";

function App() {
  // Estado para leitura atual
  const [umidadeAtual, setUmidadeAtual] = useState(null);
  const [timestampAtual, setTimestampAtual] = useState("");
  // Estado para histórico
  const [historico, setHistorico] = useState([]);

  const ESP_URL = "http://192.168.1.9";

  // busca a leitura atual
  const buscarUmidade = () => {
    fetch(`${ESP_URL}/umidade`)
      .then((res) => res.json())
      .then((data) => {
        setUmidadeAtual(data.umidade);
        setTimestampAtual(data.timestamp);
      })
      .catch((err) => console.error("Erro ao buscar umidade:", err));
  };

  // busca o histórico de leituras
  const buscarHistorico = () => {
    fetch(`${ESP_URL}/historico`)
      .then((res) => res.json())
      .then((data) => setHistorico(data))
      .catch((err) => console.error("Erro ao buscar histórico:", err));
  };

  // busca leitura atual e histórico ao montar
  useEffect(() => {
    buscarUmidade();
    buscarHistorico();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Controle de Rega</h1>

      <div style={{ marginBottom: "20px" }}>
        <h2>Leitura Atual</h2>
        {umidadeAtual !== null ? (
          <p>
            Umidade: {umidadeAtual} <br />
            Timestamp: {timestampAtual}
          </p>
        ) : (
          <p>Carregando...</p>
        )}
        <button onClick={buscarUmidade}>Atualizar Agora</button>
      </div>

      <div>
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
         <button onClick={buscarHistorico}>Atualizar Agora</button>
    </div>
  );
}

export default App;
