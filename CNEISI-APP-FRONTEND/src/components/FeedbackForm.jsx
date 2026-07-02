import { useState } from 'react';
import api from '../api/client';
import { FEEDBACK_QUESTIONS } from '../utils/feedbackQuestions';

const emptyScores = {
  respuesta1: 3,
  respuesta2: 3,
  respuesta3: 3,
  respuesta4: 3,
  respuesta5: 3,
};

export default function FeedbackForm({ eventoId, onSuccess, onError }) {
  const [scores, setScores] = useState(emptyScores);
  const [submitting, setSubmitting] = useState(false);

  function updateScore(key, value) {
    setScores((prev) => ({ ...prev, [key]: Number(value) }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/Feedbacks', { eventoId, ...scores });
      onSuccess?.();
    } catch (error) {
      onError?.(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="feedback-form glass-card" onSubmit={handleSubmit}>
      <h4>Feedback del evento</h4>
      <p className="scanner-hint">Calificá cada aspecto de 0 a 5</p>
      <div className="feedback-scores">
        {FEEDBACK_QUESTIONS.map((question, index) => {
          const key = `respuesta${index + 1}`;
          return (
            <label key={key} className="feedback-score-row">
              <span>{question}</span>
              <select value={scores[key]} onChange={(event) => updateScore(key, event.target.value)}>
                {[0, 1, 2, 3, 4, 5].map((score) => (
                  <option key={score} value={score}>
                    {score}
                  </option>
                ))}
              </select>
            </label>
          );
        })}
      </div>
      <button type="submit" className="primary-button" disabled={submitting}>
        Enviar feedback
      </button>
    </form>
  );
}
