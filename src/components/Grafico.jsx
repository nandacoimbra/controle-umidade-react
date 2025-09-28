import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Grafico({ historico }) {
  // converter umidade bruta para %
  const converterUmidade = (raw) => Math.round(((4095 - raw) / 4095) * 100);

  // extrair labels e dados
  const labels = historico.map((item) => item.timestamp);
  const dataValues = historico.map((item) => converterUmidade(item.umidade));

  const data = {
    labels,
    datasets: [
      {
        label: "Umidade (%)",
        data: dataValues,
        borderColor: "#5db7deff", // cor da linha
        backgroundColor: "#5db7deff", // cor dos pontos
        pointBackgroundColor: "#000000ff", // cor do fundo do ponto
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { color: "#b8b7b4ff" },
        title: {
          display: true,
          text: "Umidade (%)",
          fontSize: 20,
        color: "#b8b7b4ff",
        },
      },
      x:{
        ticks: { color: "#b8b7b4ff" },
      }
    },
  };

  return (
    <div className="card" style={{ height: "300px", width: "100%" , backgroundColor: "#121619", color: "#ffff"}}>
      <Line data={data} options={options} />
    </div>
  );
}

export default Grafico;
