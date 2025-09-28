import React from "react";

function LeituraAtual({ umidadeAtual, timestampAtual, atualizar, limparHistorico, converterUmidade }) {

  const handleLimpar = () => {
    if (window.confirm("Tem certeza que deseja limpar todo o histórico? Isso apagará todos os registros!")) {
      limparHistorico();
    }
  };

  return (
    <div className="card leitura-atual">
      <h2>Última Leitura</h2>
      {umidadeAtual !== null ? (
        <>
          <p><b>Umidade</b>: {converterUmidade(umidadeAtual)}%</p>
          <p><b>Data/Hora</b>: {timestampAtual}</p>
          <p>
            <b>Status da Planta</b>:{" "}
            {converterUmidade(umidadeAtual) < 20 ? (
              <span className="regar">Regar 🌱</span>
            ) : (
              <span className="ok">OK 💧</span>
            )}
          </p>
          <div style={{ marginTop: "10px" }}>
            <button onClick={atualizar} style={{ marginRight: "10px",backgroundColor: "#5db7deff" ,color: "#121619"}}>Atualizar Dados</button>
            <button onClick={handleLimpar} style={{ backgroundColor: "#121619", color: "#ffff" }}>
              Limpar Histórico
            </button>
          </div>
        </>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
}

export default LeituraAtual;
