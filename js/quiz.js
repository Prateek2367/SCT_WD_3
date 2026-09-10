/**
 * QuizPulse - Quiz Engine
 * Handles game state, question filtering, answer evaluation, scoring, and lifelines.
 */

class QuizEngine {
  constructor(config = {}) {
    this.config = {
      category: config.category || 'all',
      difficulty: config.difficulty || 'all',
      typeFilter: config.typeFilter || 'all',
      questionCount: parseInt(config.questionCount, 10) || 8,
      mode: config.mode || 'timed', // 'timed' or 'practice'
      timeLimit: 20 // seconds per question in timed mode
    };

    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.totalCorrect = 0;
    this.userAnswers = [];
    this.lifelines = {
      fiftyFifty: 1, // can be used 1 time per quiz
      hint: 2        // can be used 2 times per quiz
    };
    this.hintUsedForCurrent = false;
    this.eliminatedIndices = new Set();
    this.timeRemaining = this.config.timeLimit;
    this.timerInterval = null;
    this.isAnswerSubmitted = false;
    this.questionStartTime = Date.now();
  }

  // Prepare questions based on selected configuration
  initQuestions() {
    let pool = [...QUESTION_BANK];

    // Category filter
    if (this.config.category !== 'all') {
      pool = pool.filter(q => q.category === this.config.category);
    }

    // Difficulty filter
    if (this.config.difficulty !== 'all') {
      pool = pool.filter(q => q.difficulty === this.config.difficulty);
    }

    // Question type filter
    if (this.config.typeFilter !== 'all') {
      pool = pool.filter(q => q.type === this.config.typeFilter);
    }

    // Fallback if filters yield fewer questions than desired
    if (pool.length < this.config.questionCount) {
      // Relax difficulty first
      pool = QUESTION_BANK.filter(q => {
        const catMatch = this.config.category === 'all' || q.category === this.config.category;
        const typeMatch = this.config.typeFilter === 'all' || q.type === this.config.typeFilter;
        return catMatch && typeMatch;
      });
    }

    if (pool.length === 0) {
      pool = [...QUESTION_BANK];
    }

    // Shuffle pool
    const shuffled = this.shuffleArray([...pool]);
    // Pick the requested count
    const selected = shuffled.slice(0, Math.min(this.config.questionCount, pool.length));

    // Deep clone questions so runtime changes (shuffling options) don't alter original bank
    this.questions = selected.map(q => {
      const cloned = JSON.parse(JSON.stringify(q));
      // For single or multi questions, we keep option ordering predictable or randomized
      return cloned;
    });

    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.totalCorrect = 0;
    this.userAnswers = [];
    this.eliminatedIndices.clear();
    this.hintUsedForCurrent = false;

    return this.questions.length;
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex] || null;
  }

  startQuestionTimer(onTick, onTimeout) {
    this.stopTimer();
    this.timeRemaining = this.config.timeLimit;
    this.isAnswerSubmitted = false;
    this.hintUsedForCurrent = false;
    this.eliminatedIndices.clear();
    this.questionStartTime = Date.now();

    if (this.config.mode !== 'timed') {
      return;
    }

    onTick(this.timeRemaining, 100);

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      const percent = Math.max(0, (this.timeRemaining / this.config.timeLimit) * 100);
      onTick(this.timeRemaining, percent);

      if (this.timeRemaining <= 0) {
        this.stopTimer();
        onTimeout();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // Lifeline: 50/50 (eliminate 2 incorrect choices for single/multi questions)
  applyFiftyFifty() {
    if (this.lifelines.fiftyFifty <= 0) return null;
    const q = this.getCurrentQuestion();
    if (!q || (q.type !== 'single' && q.type !== 'multi')) return null;

    let incorrectIndices = [];
    if (q.type === 'single') {
      incorrectIndices = q.options.map((_, i) => i).filter(i => i !== q.correctAnswer);
    } else if (q.type === 'multi') {
      incorrectIndices = q.options.map((_, i) => i).filter(i => !q.correctAnswer.includes(i));
    }

    if (incorrectIndices.length < 2) return null;

    // Shuffle and pick 2 incorrect indices to eliminate
    const shuffledIncorrect = this.shuffleArray([...incorrectIndices]);
    const toEliminate = shuffledIncorrect.slice(0, 2);
    toEliminate.forEach(idx => this.eliminatedIndices.add(idx));

    this.lifelines.fiftyFifty--;
    return toEliminate;
  }

  // Lifeline: Hint
  applyHint() {
    if (this.lifelines.hint <= 0) return null;
    const q = this.getCurrentQuestion();
    if (!q || !q.hint) return null;

    this.lifelines.hint--;
    this.hintUsedForCurrent = true;
    return q.hint;
  }

  /**
   * Submit and evaluate answer
   * @param {number|number[]|string|null} userAnswer
   * @returns {Object} evaluation result
   */
  submitAnswer(userAnswer) {
    if (this.isAnswerSubmitted) return null;
    this.isAnswerSubmitted = true;
    this.stopTimer();

    const q = this.getCurrentQuestion();
    const timeSpent = Math.max(1, Math.round((Date.now() - this.questionStartTime) / 1000));
    let isCorrect = false;
    let feedbackText = '';

    if (userAnswer === null || userAnswer === undefined || userAnswer === '') {
      isCorrect = false;
      feedbackText = 'Time out or skipped.';
    } else if (q.type === 'single' || q.type === 'boolean') {
      isCorrect = (Number(userAnswer) === Number(q.correctAnswer));
    } else if (q.type === 'multi') {
      // userAnswer is an array of selected indices
      const selected = Array.isArray(userAnswer) ? userAnswer.map(Number).sort() : [];
      const correct = [...q.correctAnswer].sort();
      isCorrect = selected.length === correct.length && selected.every((val, idx) => val === correct[idx]);
    } else if (q.type === 'blank') {
      const cleanUser = String(userAnswer).trim().toLowerCase();
      const acceptable = q.acceptableAnswers.map(a => String(a).trim().toLowerCase());
      isCorrect = acceptable.some(ans => cleanUser === ans);
    }

    // Points calculation
    let pointsEarned = 0;
    if (isCorrect) {
      this.streak++;
      if (this.streak > this.maxStreak) {
        this.maxStreak = this.streak;
      }
      this.totalCorrect++;

      // Base points based on difficulty
      const basePoints = q.difficulty === 'hard' ? 300 : (q.difficulty === 'medium' ? 200 : 100);

      // Streak multiplier: 1x, 1.2x, 1.5x, 2.0x
      let multiplier = 1.0;
      if (this.streak >= 4) multiplier = 2.0;
      else if (this.streak === 3) multiplier = 1.5;
      else if (this.streak === 2) multiplier = 1.25;

      // Time bonus (up to 50 pts if answered fast in timed mode)
      let timeBonus = 0;
      if (this.config.mode === 'timed') {
        const ratio = Math.max(0, this.timeRemaining / this.config.timeLimit);
        timeBonus = Math.round(ratio * 50);
      }

      pointsEarned = Math.round((basePoints * multiplier) + timeBonus);
      this.score += pointsEarned;
    } else {
      this.streak = 0;
    }

    const answerRecord = {
      questionIndex: this.currentIndex,
      question: q.question,
      codeSnippet: q.codeSnippet || null,
      type: q.type,
      category: q.category,
      difficulty: q.difficulty,
      options: q.options || null,
      userAnswer: userAnswer,
      correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : q.acceptableAnswers,
      isCorrect: isCorrect,
      timeSpent: timeSpent,
      pointsEarned: pointsEarned,
      explanation: q.explanation || 'No explanation provided.'
    };

    this.userAnswers.push(answerRecord);

    return {
      isCorrect,
      pointsEarned,
      streak: this.streak,
      score: this.score,
      explanation: q.explanation,
      correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : q.acceptableAnswers,
      record: answerRecord
    };
  }

  nextQuestion() {
    this.currentIndex++;
    return this.currentIndex < this.questions.length;
  }

  isLastQuestion() {
    return this.currentIndex >= this.questions.length - 1;
  }

  getResultsSummary() {
    const total = this.questions.length;
    const accuracy = total > 0 ? Math.round((this.totalCorrect / total) * 100) : 0;
    const totalTimeSpent = this.userAnswers.reduce((sum, a) => sum + (a.timeSpent || 0), 0);
    const avgTime = total > 0 ? (totalTimeSpent / total).toFixed(1) : 0;

    // Performance title & tier
    let tier = { title: 'Quiz Novice', badge: '🌱', color: '#94a3b8' };
    if (accuracy === 100) {
      tier = { title: 'Grandmaster Champion', badge: '👑', color: '#f59e0b' };
    } else if (accuracy >= 80) {
      tier = { title: 'Tech Prodigy', badge: '⚡', color: '#8b5cf6' };
    } else if (accuracy >= 60) {
      tier = { title: 'Sharp Thinker', badge: '🎯', color: '#06b6d4' };
    } else if (accuracy >= 40) {
      tier = { title: 'Steadfast Learner', badge: '📘', color: '#10b981' };
    }

    // Save to persistent leaderboard/history
    this.saveGameStats(accuracy);

    return {
      totalQuestions: total,
      totalCorrect: this.totalCorrect,
      totalIncorrect: total - this.totalCorrect,
      accuracy,
      score: this.score,
      maxStreak: this.maxStreak,
      totalTimeSpent,
      avgTime,
      tier,
      answers: this.userAnswers
    };
  }

  saveGameStats(accuracy) {
    try {
      const stats = JSON.parse(localStorage.getItem('quizpulse_stats') || '{}');
      stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
      stats.highScore = Math.max(stats.highScore || 0, this.score);
      stats.totalQuestionsAnswered = (stats.totalQuestionsAnswered || 0) + this.questions.length;
      stats.totalCorrectAnswers = (stats.totalCorrectAnswers || 0) + this.totalCorrect;
      stats.bestStreak = Math.max(stats.bestStreak || 0, this.maxStreak);
      localStorage.setItem('quizpulse_stats', JSON.stringify(stats));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  static getGlobalStats() {
    try {
      return JSON.parse(localStorage.getItem('quizpulse_stats') || '{"highScore": 0, "gamesPlayed": 0}');
    } catch {
      return { highScore: 0, gamesPlayed: 0 };
    }
  }
}
