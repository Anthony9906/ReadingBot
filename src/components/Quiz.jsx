import React, { useState, useEffect } from 'react';
import './Quiz.css';
import { supabase } from '../lib/supabase'; // 确保导入 Supabase 客户端

function Quiz({ story, userId, onClose, onComplete }) {
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // 初始化答案状态
    const initialAnswers = {};
    story.questions.forEach((_, index) => {
      initialAnswers[index] = ''; // 初始化每个问题的答案为空
    });
    setCurrentAnswers(initialAnswers);
  }, [story]);

  const handleAnswerSelect = (questionId, answer) => {
    if (!submitted) {
      setCurrentAnswers(prev => ({
        ...prev,
        [questionId]: answer
      }));
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(currentAnswers).length < story.questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    let correctCount = 0;
    story.questions.forEach((question, index) => {
      if (currentAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / story.questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);

    // 保存 Quiz 记录到 Supabase
    const { error } = await supabase
      .from('quiz_records')
      .insert([
        {
          user_id: userId,
          story_id: story.id, // 确保 story 对象中有 id 属性
          score: finalScore,
          created_at: new Date()
        }
      ]);

    if (error) {
      console.error('Error saving quiz record:', error);
    } else {
      console.log('Quiz record saved successfully');
    }

    if (onComplete) {
      onComplete(finalScore);
    }
  };

  return (
    <div className="quiz-overlay">
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>Reading Comprehension Quiz</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="quiz-content">
          {story.questions.map((question, index) => (
            <div key={index} className="question-container">
              <p className="question-text">{question.question}</p>
              <div className="options-container">
                {[question.correctAnswer, ...question.wrongAnswers].map((option, idx) => (
                  <label
                    key={idx}
                    className={`option-label ${
                      submitted
                        ? option === question.correctAnswer
                          ? 'correct'
                          : currentAnswers[index] === option
                          ? 'incorrect'
                          : ''
                        : currentAnswers[index] === option
                        ? 'selected'
                        : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={currentAnswers[index] === option}
                      onChange={() => handleAnswerSelect(index, option)}
                      disabled={submitted}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="quiz-footer">
          {submitted ? (
            <div className="quiz-results">
              <h3>Your Score: {score}%</h3>
              <button onClick={onClose} className="close-quiz-button">
                Close Quiz
              </button>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              className="submit-button"
              disabled={Object.keys(currentAnswers).length < story.questions.length}
            >
              Submit Answers
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;