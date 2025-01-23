import React, { useState, useEffect } from 'react';
import './Quiz.css';
import { supabase } from '../lib/supabase'; // 确保导入 Supabase 客户端

function Quiz({ story, userId, onClose, onComplete, userLexile, setUserLexile}) {
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

  const handleLexileUpdate = async (lexileChange) => {

    // Log the Lexile change event
    const { error: logError } = await supabase
      .from('lexile_changes')
      .insert([
        {
          user_id: userId,
          story_id: story.id,
          lexile_change: lexileChange,
          timestamp: new Date().toISOString(), // Current timestamp
        },
      ]);

    if (logError) {
      console.error('Error logging Lexile change:', logError);
    } else {
      console.log('Lexile change logged successfully');
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

    // Check conditions for Lexile increase
    const { data: quizData, error: quizError } = await supabase
    .from('quiz_records')
    .select('score')
    .eq('user_id', userId)
    .eq('story_id', story.id);

    if (quizError) {
        console.error('Error fetching quiz records:', quizError);
        return;
    }

    const previousScores = quizData.map(record => record.score);
    const bestScore = previousScores.length > 0 ? Math.max(...previousScores) : null;

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
      
      // Condition 1: User has never completed the quiz for this story or best score < 80%
      const condition1 = bestScore === null || bestScore < 80;
      // Condition 2: Current score >= 80%
      const condition2 = finalScore >= 80;

      if (condition1 && condition2) {
        // Update Lexile value
        const currentLexile = parseInt(userLexile, 10); // Convert userLexile to an integer

        let newLexile = isNaN(currentLexile) ? 100 : currentLexile + 10; // Increase Lexile by 10, default to 10 if NaN
        newLexile = newLexile + "L";

        const { error: lexileError } = await supabase
          .from('user_profiles')
          .update({ lexile: newLexile })
          .eq('id', userId);

        if (lexileError) {
          console.error('Error updating Lexile value:', lexileError);
        } else {
          console.log('Lexile value updated successfully');
          
          await handleLexileUpdate(10);
        }
      } else {
        console.log('Do not meet required condition for Lexile up');
      }
    }

    if (onComplete) {
      onComplete(finalScore);
    }
  };

  return (
    <div className="quiz-overlay">
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>Reading Quiz</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="quiz-content">
          {story.questions.map((question, index) => (
            <div key={index} className="question-container">
              <p className="question-text">{index+1}. {question.question}</p>
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