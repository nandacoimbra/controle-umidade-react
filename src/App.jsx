import { useEffect, useState } from "react";
import LeituraAtual from "./components/LeituraAtual";
import Grafico from "./components/Grafico";
import "./App.css";

function App() {
  const [umidadeAtual, setUmidadeAtual] = useState(null);
  const [timestampAtual, setTimestampAtual] = useState("");
  const [historico, setHistorico] = useState([]);
  const ESP_URL = "http://192.168.1.9"; // IP do ESP32 

  // Função para buscar umidade atual e histórico
  const buscarUmidade = () => {
    fetch(`${ESP_URL}/umidade`)
      .then((res) => res.json())
      .then((data) => {
        setUmidadeAtual(data.umidade);
        setTimestampAtual(data.timestamp);
        setHistorico((prev) => [
          ...prev,
          { umidade: data.umidade, timestamp: data.timestamp },
        ]);
      })
      .catch((err) => console.error("Erro ao buscar umidade:", err));
  };

  // Função para buscar histórico completo
  const buscarHistorico = () => {
    fetch(`${ESP_URL}/historico`)
      .then((res) => res.json())
      .then((data) => setHistorico(data))
      .catch((err) => console.error("Erro ao buscar histórico:", err));
  };

  // Função para limpar histórico
  const limparHistorico = () => {
    fetch(`${ESP_URL}/limpar`, { method: "POST" }) // método POST
      .then((res) => {
        if (res.ok) {
          setHistorico([]);
          alert("Histórico limpo com sucesso!");
        } else {
          alert("Falha ao limpar histórico no ESP32");
        }
      })
      .catch((err) => console.error("Erro ao limpar histórico:", err));
  };

  useEffect(() => {
    buscarUmidade();
    buscarHistorico();
    // Faz uma requisição a cada 15 minutos
    const interval = setInterval(buscarUmidade, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Função para converter umidade bruta para % (4095 = solo seco, 0 = solo encharcado)
  function converterUmidade(raw) {
  //100% = solo ideal
    return Math.round(((4095 - raw) / 4095) * 100);
  }

  return (
    <div className="app-container">
      <h1 className="title">Controle de Umidade</h1>
      <div className="graph-data">
        <div className="data">
          <LeituraAtual
            umidadeAtual={umidadeAtual}
            timestampAtual={timestampAtual}
            atualizar={buscarUmidade}
            converterUmidade={converterUmidade}
            limparHistorico={limparHistorico}
          />
          {/* <Planta /> */}
        </div>
        "{/* <Historico historico={historico} /> */}
        <Grafico className="graph" historico={historico} />
      </div>
    </div>
  );
}

export default App;
