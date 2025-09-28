import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "./App.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [umidadeAtual, setUmidadeAtual] = useState(null);
  const [timestampAtual, setTimestampAtual] = useState("");
  const [historico, setHistorico] = useState([]);

  const ESP_URL = "http://192.168.1.9";

  function converterUmidade(raw) {
    return Math.round(((4095 - raw) / 4095) * 100);
  }

  const buscarUmidade = () => {
    fetch(`${ESP_URL}/umidade`)
      .then(res => res.json())
      .then(data => {
        setUmidadeAtual(data.umidade);
        setTimestampAtual(data.timestamp);
        setHistorico(prev => [...prev, { umidade: data.umidade, timestamp: data.timestamp }]);
      })
      .catch(err => console.error(err));
  };

  const buscarHistorico = () => {
    fetch(`${ESP_URL}/historico`)
      .then(res => res.json())
      .then(data => setHistorico(data))
      .catch(err => console.error(err));
  };

  const limparHistorico = () => {
    fetch(`${ESP_URL}/limpar`, { method: "POST" })
      .then(res => { if(res.ok) { setHistorico([]); alert("Histórico limpo!"); }})
      .catch(err => console.error(err));
  };

  useEffect(() => {
    buscarUmidade();
    buscarHistorico();
    const interval = setInterval(buscarUmidade, 15*60*1000);
    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: historico.map(item => item.timestamp),
    datasets: [
      {
        label: "Umidade do Solo (%)",
        data: historico.map(item => converterUmidade(item.umidade)),
        borderColor: "var(--jungle-green)",
        backgroundColor: "rgba(73,160,120,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false }, title: { display: true, text: "Histórico de Umidade (%)", color: "var(--aero)" } },
    scales: { y: { beginAtZero: true, max: 100 }, x: { ticks: { color: "var(--aero)" } } },
  };

  return (
    <div className="app-container">
      <h1 className="title">Controle de Rega</h1>

      <div className="card leitura-atual">
        <h2>Leitura Atual</h2>
        {umidadeAtual !== null ? (
          <>
            <p>Umidade: {converterUmidade(umidadeAtual)}%</p>
            <p>Data/Hora: {timestampAtual}</p>
            <p>Status da Planta: {converterUmidade(umidadeAtual) < 20 ? <span className="regar">Regar 🌱</span> : <span className="ok">OK 💧</span>}</p>
          </>
        ) : <p>Carregando...</p>}
        <div className="botoes">
          <button onClick={buscarUmidade}>Atualizar Agora</button>
          <button onClick={limparHistorico}>Limpar Histórico</button>
        </div>
      </div>

      <div className="card planta">
        <h2>Planta</h2>
        <img src="https://via.placeholder.com/200x150.png?text=Planta" alt="Planta" />
      </div>

      <div className="card grafico">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default App;
