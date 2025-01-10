import "./App.css";
import { useState, useEffect } from "react";

// Componente do Modal
const CongratsModal = ({ onRestart, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>🎉 Parabéns! 🎉</h2>
        <p>Você completou o Desafio 75 Hard!</p>
        <p>Sua dedicação e perseverança são inspiradoras.</p>
        <div className="modal-buttons">
          <button className="restart-btn" onClick={onRestart}>
            Começar Novo Desafio
          </button>
          <button className="close-btn" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [days, setDays] = useState(() => {
    const savedDays = localStorage.getItem("75hardDays");
    return savedDays ? JSON.parse(savedDays) : [];
  });
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const totalDays = 75;

  // Verifica se completou o desafio
  useEffect(() => {
    if (days.length === totalDays) {
      setShowCongratsModal(true);
    }
  }, [days.length]);

  const getProgressColor = (percentage) => {
    if (percentage === 100) return "#4CAF50";
    if (percentage >= 50) return "#2196F3";
    return "#FFC107";
  };

  useEffect(() => {
    localStorage.setItem("75hardDays", JSON.stringify(days));
  }, [days]);

  const addNewDay = () => {
    if (days.length >= totalDays) {
      setShowCongratsModal(true);
      return;
    }

    const newDay = {
      id: days.length + 1,
      goals: [
        { id: 1, text: "Exercício físico", completed: false },
        { id: 2, text: "Dieta", completed: false },
        { id: 3, text: "Leitura", completed: false },
        { id: 4, text: "Beber água", completed: false },
      ],
    };
    setDays([newDay, ...days]);
  };

  const deleteDay = (dayId) => {
    if (window.confirm("Tem certeza que deseja excluir este dia?")) {
      setDays(days.filter((day) => day.id !== dayId));
    }
  };

  const resetChallenge = () => {
    if (
      window.confirm(
        "Tem certeza que deseja resetar todo o progresso? Esta ação não pode ser desfeita."
      )
    ) {
      setDays([]);
      setShowCongratsModal(false);
    }
  };

  const toggleGoal = (dayId, goalId) => {
    setDays(
      days.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            goals: day.goals.map((goal) =>
              goal.id === goalId
                ? { ...goal, completed: !goal.completed }
                : goal
            ),
          };
        }
        return day;
      })
    );
  };

  const calculateDayProgress = (day) => {
    const completedGoals = day.goals.filter((goal) => goal.completed).length;
    return (completedGoals / day.goals.length) * 100;
  };

  const totalProgress = (days.length / totalDays) * 100;

  return (
    <div className="App">
      {showCongratsModal && (
        <CongratsModal
          onRestart={resetChallenge}
          onClose={() => setShowCongratsModal(false)}
        />
      )}

      <div className="header">
        <h1>Desafio 75 Hard</h1>
        <button className="reset-btn" onClick={resetChallenge}>
          Resetar Desafio
        </button>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress"
            style={{
              width: `${totalProgress}%`,
              backgroundColor: getProgressColor(totalProgress),
            }}
          />
        </div>
        <div className="progress-text">
          {days.length}/{totalDays} dias
        </div>
      </div>

      <div className="days-container">
        <div className="day-card new-day-card" onClick={addNewDay}>
          <div className="new-day-content">
            <span className="plus-icon">+</span>
            <h3>Adicionar Novo Dia</h3>
          </div>
        </div>

        {days.map((day) => (
          <div key={day.id} className="day-card">
            <div className="day-header">
              <h3>Dia {day.id}</h3>
              <button className="delete-btn" onClick={() => deleteDay(day.id)}>
                ×
              </button>
            </div>

            <div className="day-progress-bar">
              <div
                className="day-progress"
                style={{
                  width: `${calculateDayProgress(day)}%`,
                  backgroundColor:
                    calculateDayProgress(day) === 100 ? "#4CAF50" : "#2196F3",
                }}
              >
                {Math.round(calculateDayProgress(day))}%
              </div>
            </div>

            {day.goals.map((goal) => (
              <div key={goal.id} className="goal-item">
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleGoal(day.id, goal.id)}
                />
                <span>{goal.text}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
