/**
 * QuizPulse - Application UI Controller & Orchestration
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Audio & Storage Init ---
  const sound = window.soundCtrl;
  let quizEngine = null;
  let currentSelectedMulti = new Set();
  let confettiAnimationId = null;

  // --- DOM Elements Cache ---
  const el = {
    // Screens
    setupScreen: document.getElementById('setup-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    resultsScreen: document.getElementById('results-screen'),

    // Global Header
    logoHomeBtn: document.getElementById('logo-home-btn'),
    headerHighScore: document.getElementById('header-high-score'),
    audioToggleBtn: document.getElementById('audio-toggle-btn'),
    audioOnIcon: document.getElementById('audio-on-icon'),
    audioOffIcon: document.getElementById('audio-off-icon'),
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    sunIcon: document.getElementById('sun-icon'),
    moonIcon: document.getElementById('moon-icon'),

    // Setup / Lobby
    configForm: document.getElementById('quiz-config-form'),
    categorySelect: document.getElementById('category-select'),
    difficultySelect: document.getElementById('difficulty-select'),
    typeSelect: document.getElementById('type-select'),
    questionCountSlider: document.getElementById('question-count-slider'),
    questionCountVal: document.getElementById('question-count-val'),
    lobbyGamesPlayed: document.getElementById('lobby-games-played'),
    lobbyAccuracy: document.getElementById('lobby-accuracy'),
    lobbyBestStreak: document.getElementById('lobby-best-streak'),

    // Quiz HUD
    progressBarFill: document.getElementById('progress-bar-fill'),
    hudCurrentNum: document.getElementById('hud-current-num'),
    hudTotalNum: document.getElementById('hud-total-num'),
    hudCategoryBadge: document.getElementById('hud-category-badge'),
    hudDifficultyBadge: document.getElementById('hud-difficulty-badge'),
    hudStreakBadge: document.getElementById('hud-streak-badge'),
    hudStreakText: document.getElementById('hud-streak-text'),
    hudScoreVal: document.getElementById('hud-score-val'),
    timerContainer: document.getElementById('hud-timer-container'),
    timerRingPath: document.getElementById('timer-ring-path'),
    timerSecondsVal: document.getElementById('timer-seconds-val'),

    // Lifelines
    lifeline5050: document.getElementById('lifeline-5050'),
    lifeline5050Count: document.getElementById('lifeline-5050-count'),
    lifelineHint: document.getElementById('lifeline-hint'),
    lifelineHintCount: document.getElementById('lifeline-hint-count'),

    // Question Area
    questionCard: document.getElementById('question-card'),
    questionTypeTag: document.getElementById('question-type-tag'),
    questionPointsTag: document.getElementById('question-points-tag'),
    questionText: document.getElementById('question-text'),
    codeBlock: document.getElementById('question-code-block'),
    codeContent: document.getElementById('question-code-content'),
    answersContainer: document.getElementById('answers-container'),
    blankContainer: document.getElementById('blank-input-container'),
    blankInput: document.getElementById('blank-answer-input'),
    blankSubmitBtn: document.getElementById('blank-submit-btn'),
    hintBox: document.getElementById('hint-box'),
    hintText: document.getElementById('hint-text'),
    feedbackBanner: document.getElementById('feedback-banner'),
    feedbackIcon: document.getElementById('feedback-icon'),
    feedbackPoints: document.getElementById('feedback-points'),
    feedbackExplanation: document.getElementById('feedback-explanation'),

    // Navigation Controls
    skipQuestionBtn: document.getElementById('skip-question-btn'),
    confirmMultiBtn: document.getElementById('confirm-multi-btn'),
    nextQuestionBtn: document.getElementById('next-question-btn'),
    nextBtnText: document.getElementById('next-btn-text'),

    // Results Dashboard
    resultsTierBadge: document.getElementById('results-tier-badge'),
    resultsTierTitle: document.getElementById('results-tier-title'),
    resultsTierMsg: document.getElementById('results-tier-msg'),
    resultsGaugePath: document.getElementById('results-gauge-path'),
    resultsAccuracyVal: document.getElementById('results-accuracy-val'),
    resultsPointsVal: document.getElementById('results-points-val'),
    resultsNewHighBadge: document.getElementById('results-new-high-badge'),
    metricCorrect: document.getElementById('metric-correct'),
    metricIncorrect: document.getElementById('metric-incorrect'),
    metricStreak: document.getElementById('metric-streak'),
    metricTime: document.getElementById('metric-time'),
    retakeQuizBtn: document.getElementById('retake-quiz-btn'),
    toggleReviewBtn: document.getElementById('toggle-review-btn'),
    shareScoreBtn: document.getElementById('share-score-btn'),
    shareBtnLabel: document.getElementById('share-btn-label'),
    reviewDrawer: document.getElementById('answers-review-drawer'),
    reviewItemsContainer: document.getElementById('review-items-container'),
    countReviewAll: document.getElementById('count-review-all'),
    countReviewCorrect: document.getElementById('count-review-correct'),
    countReviewIncorrect: document.getElementById('count-review-incorrect'),

    // Canvas & Toast
    confettiCanvas: document.getElementById('confetti-canvas'),
    toast: document.getElementById('toast')
  };

  // --- Confetti Engine ---
  class ConfettiGenerator {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.animationId = null;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    start(count = 90) {
      this.stop();
      this.particles = [];
      const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];

      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * -this.canvas.height * 0.5,
          size: Math.random() * 8 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 4 + 2,
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 6,
          opacity: 1
        });
      }

      const animate = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let active = 0;

        for (const p of this.particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vRot;
          p.vy += 0.05; // gravity

          if (p.y > this.canvas.height - 50) {
            p.opacity -= 0.02;
          }

          if (p.opacity > 0) {
            active++;
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = Math.max(0, p.opacity);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            this.ctx.restore();
          }
        }

        if (active > 0) {
          this.animationId = requestAnimationFrame(animate);
        } else {
          this.stop();
        }
      };

      this.animationId = requestAnimationFrame(animate);
    }

    stop() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  const confetti = new ConfettiGenerator(el.confettiCanvas);

  // --- Toast Helper ---
  let toastTimer = null;
  function showToast(msg) {
    if (toastTimer) clearTimeout(toastTimer);
    el.toast.textContent = msg;
    el.toast.classList.add('show');
    toastTimer = setTimeout(() => {
      el.toast.classList.remove('show');
    }, 2400);
  }

  // --- Theme Management ---
  function initTheme() {
    const saved = localStorage.getItem('quizpulse_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcons(saved);
  }

  function updateThemeIcons(theme) {
    if (theme === 'dark') {
      el.sunIcon.classList.remove('hidden');
      el.moonIcon.classList.add('hidden');
    } else {
      el.sunIcon.classList.add('hidden');
      el.moonIcon.classList.remove('hidden');
    }
  }

  el.themeToggleBtn.addEventListener('click', () => {
    sound.playClick();
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('quizpulse_theme', next);
    updateThemeIcons(next);
  });

  // --- Audio Management ---
  function initAudioState() {
    if (sound.isMuted) {
      el.audioOnIcon.classList.add('hidden');
      el.audioOffIcon.classList.remove('hidden');
    } else {
      el.audioOnIcon.classList.remove('hidden');
      el.audioOffIcon.classList.add('hidden');
    }
  }

  el.audioToggleBtn.addEventListener('click', () => {
    const muted = sound.toggleMute();
    initAudioState();
    if (!muted) sound.playClick();
    showToast(muted ? 'Sound Effects Muted' : 'Sound Effects Enabled');
  });

  // --- Stats in Lobby ---
  function refreshGlobalStats() {
    const stats = QuizEngine.getGlobalStats();
    el.headerHighScore.textContent = stats.highScore || 0;
    el.lobbyGamesPlayed.textContent = stats.gamesPlayed || 0;
    el.lobbyBestStreak.textContent = `${stats.bestStreak || 0} 🔥`;

    if (stats.totalQuestionsAnswered > 0) {
      const acc = Math.round((stats.totalCorrectAnswers / stats.totalQuestionsAnswered) * 100);
      el.lobbyAccuracy.textContent = `${acc}%`;
    } else {
      el.lobbyAccuracy.textContent = '0%';
    }
  }

  // Question count slider listener
  el.questionCountSlider.addEventListener('input', (e) => {
    el.questionCountVal.textContent = `${e.target.value} Questions`;
  });

  // Home logo click returns to setup
  el.logoHomeBtn.addEventListener('click', () => {
    sound.playClick();
    if (quizEngine) quizEngine.stopTimer();
    showScreen('setup');
    refreshGlobalStats();
  });

  // --- Navigation & Screen Switcher ---
  function showScreen(screenKey) {
    el.setupScreen.classList.remove('active');
    el.quizScreen.classList.remove('active');
    el.resultsScreen.classList.remove('active');
    confetti.stop();

    if (screenKey === 'setup') {
      el.setupScreen.classList.add('active');
    } else if (screenKey === 'quiz') {
      el.quizScreen.classList.add('active');
    } else if (screenKey === 'results') {
      el.resultsScreen.classList.add('active');
    }
  }

  // --- Quiz Setup Submission ---
  el.configForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sound.playClick();

    const selectedMode = document.querySelector('input[name="gameMode"]:checked').value;
    const config = {
      category: el.categorySelect.value,
      difficulty: el.difficultySelect.value,
      typeFilter: el.typeSelect.value,
      questionCount: el.questionCountSlider.value,
      mode: selectedMode
    };

    quizEngine = new QuizEngine(config);
    const available = quizEngine.initQuestions();

    if (available === 0) {
      alert('No questions matched your specific criteria. Try selecting All Topics or All Formats.');
      return;
    }

    startQuizSession();
  });

  // --- Start Quiz Session ---
  function startQuizSession() {
    showScreen('quiz');
    updateLifelineButtons();
    renderCurrentQuestion();
  }

  function updateLifelineButtons() {
    el.lifeline5050Count.textContent = quizEngine.lifelines.fiftyFifty;
    el.lifelineHintCount.textContent = quizEngine.lifelines.hint;

    const currentQ = quizEngine.getCurrentQuestion();
    const isSingleOrMulti = currentQ && (currentQ.type === 'single' || currentQ.type === 'multi');

    el.lifeline5050.disabled = quizEngine.lifelines.fiftyFifty <= 0 || !isSingleOrMulti;
    el.lifelineHint.disabled = quizEngine.lifelines.hint <= 0 || !currentQ.hint;
  }

  // --- Lifelines Click Handlers ---
  el.lifeline5050.addEventListener('click', () => {
    sound.playLifeline();
    const eliminated = quizEngine.applyFiftyFifty();
    if (eliminated) {
      updateLifelineButtons();
      eliminated.forEach(idx => {
        const optCard = el.answersContainer.querySelector(`[data-index="${idx}"]`);
        if (optCard) {
          optCard.classList.add('eliminated');
        }
      });
      showToast('50:50 Activated: 2 options eliminated!');
    }
  });

  el.lifelineHint.addEventListener('click', () => {
    sound.playLifeline();
    const hint = quizEngine.applyHint();
    if (hint) {
      updateLifelineButtons();
      el.hintText.textContent = hint;
      el.hintBox.classList.remove('hidden');
      showToast('Strategic Hint revealed!');
    }
  });

  // --- Render Question in Viewport ---
  function renderCurrentQuestion() {
    const q = quizEngine.getCurrentQuestion();
    if (!q) return;

    currentSelectedMulti.clear();
    el.hintBox.classList.add('hidden');
    el.feedbackBanner.classList.add('hidden');
    el.feedbackBanner.classList.remove('correct', 'wrong');
    el.nextQuestionBtn.classList.add('hidden');
    el.confirmMultiBtn.classList.add('hidden');
    el.skipQuestionBtn.classList.remove('hidden');

    // Update Next button label for last question
    el.nextBtnText.textContent = quizEngine.isLastQuestion() ? 'Finish Quiz' : 'Next Question';

    // HUD Updates
    const totalQ = quizEngine.questions.length;
    const currIdx = quizEngine.currentIndex + 1;
    el.hudCurrentNum.textContent = currIdx;
    el.hudTotalNum.textContent = totalQ;

    // Progress bar fill
    const progressPercent = ((currIdx - 1) / totalQ) * 100;
    el.progressBarFill.style.width = `${progressPercent}%`;

    // Category & Difficulty Badges
    const catObj = CATEGORIES.find(c => c.id === q.category);
    el.hudCategoryBadge.textContent = catObj ? catObj.name : q.category;
    el.hudDifficultyBadge.textContent = q.difficulty.toUpperCase();
    el.hudDifficultyBadge.className = `hud-pill difficulty-pill ${q.difficulty}`;

    // Score & Streak
    el.hudScoreVal.textContent = quizEngine.score;
    if (quizEngine.streak >= 2) {
      el.hudStreakBadge.classList.remove('hidden');
      let mult = quizEngine.streak >= 4 ? 'x2.0' : (quizEngine.streak === 3 ? 'x1.5' : 'x1.25');
      el.hudStreakText.textContent = `Streak ${quizEngine.streak} (${mult})`;
    } else {
      el.hudStreakBadge.classList.add('hidden');
    }

    // Question Meta
    const formatLabels = {
      single: 'Single Choice (MCQ)',
      multi: 'Multi-Select (Select all that apply)',
      blank: 'Fill in the Blank',
      boolean: 'True / False'
    };
    el.questionTypeTag.textContent = formatLabels[q.type] || q.type;

    const basePts = q.difficulty === 'hard' ? 300 : (q.difficulty === 'medium' ? 200 : 100);
    el.questionPointsTag.textContent = `+${basePts} pts`;

    // Question Text & Code Snippet
    el.questionText.textContent = q.question;

    if (q.codeSnippet) {
      el.codeContent.textContent = q.codeSnippet;
      el.codeBlock.classList.remove('hidden');
    } else {
      el.codeBlock.classList.add('hidden');
    }

    // Dynamic Answer Container Rendering
    el.answersContainer.innerHTML = '';
    el.blankContainer.classList.add('hidden');
    el.answersContainer.classList.remove('hidden');

    if (q.type === 'single' || q.type === 'boolean') {
      renderSingleChoice(q);
    } else if (q.type === 'multi') {
      renderMultiSelect(q);
    } else if (q.type === 'blank') {
      renderBlankInput(q);
    }

    updateLifelineButtons();

    // Start Timer (in timed mode)
    if (quizEngine.config.mode === 'timed') {
      el.timerContainer.classList.remove('hidden');
      quizEngine.startQuestionTimer(
        (remaining, percent) => updateTimerUI(remaining, percent),
        () => handleTimeOut()
      );
    } else {
      el.timerContainer.classList.add('hidden');
    }
  }

  // --- Renderers for Question Formats ---
  function renderSingleChoice(q) {
    const letters = ['A', 'B', 'C', 'D', 'E'];

    q.options.forEach((optText, idx) => {
      const card = document.createElement('div');
      card.className = 'option-card';
      card.dataset.index = idx;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <span class="option-index-badge">${letters[idx] || (idx + 1)}</span>
        <span class="option-text">${escapeHtml(optText)}</span>
        <span class="option-status-icon"></span>
      `;

      card.addEventListener('click', () => {
        if (quizEngine.isAnswerSubmitted) return;
        sound.playSelect();
        evaluateAnswer(idx);
      });

      el.answersContainer.appendChild(card);
    });
  }

  function renderMultiSelect(q) {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    el.confirmMultiBtn.classList.remove('hidden');

    q.options.forEach((optText, idx) => {
      const card = document.createElement('div');
      card.className = 'option-card';
      card.dataset.index = idx;
      card.setAttribute('role', 'checkbox');
      card.setAttribute('aria-checked', 'false');
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <span class="option-index-badge">${letters[idx] || (idx + 1)}</span>
        <span class="option-text">${escapeHtml(optText)}</span>
        <span class="option-status-icon">⬜</span>
      `;

      card.addEventListener('click', () => {
        if (quizEngine.isAnswerSubmitted) return;
        sound.playSelect();

        if (currentSelectedMulti.has(idx)) {
          currentSelectedMulti.delete(idx);
          card.classList.remove('selected');
          card.querySelector('.option-status-icon').textContent = '⬜';
          card.setAttribute('aria-checked', 'false');
        } else {
          currentSelectedMulti.add(idx);
          card.classList.add('selected');
          card.querySelector('.option-status-icon').textContent = '☑️';
          card.setAttribute('aria-checked', 'true');
        }
      });

      el.answersContainer.appendChild(card);
    });
  }

  function renderBlankInput(q) {
    el.answersContainer.classList.add('hidden');
    el.blankContainer.classList.remove('hidden');
    el.blankInput.value = '';
    el.blankInput.disabled = false;
    el.blankSubmitBtn.disabled = false;
    setTimeout(() => el.blankInput.focus(), 80);
  }

  // --- Timer UI ---
  function updateTimerUI(seconds, percent) {
    el.timerSecondsVal.textContent = seconds;
    const strokeDash = `${percent}, 100`;
    el.timerRingPath.setAttribute('stroke-dasharray', strokeDash);

    el.timerRingPath.classList.remove('warning', 'danger');
    if (seconds <= 4) {
      el.timerRingPath.classList.add('danger');
      sound.playUrgent();
    } else if (seconds <= 8) {
      el.timerRingPath.classList.add('warning');
    }
  }

  function handleTimeOut() {
    if (quizEngine.isAnswerSubmitted) return;
    evaluateAnswer(null);
    showToast("⏰ Time's up for this question!");
  }

  // --- Confirm Multi Select Submission ---
  el.confirmMultiBtn.addEventListener('click', () => {
    if (quizEngine.isAnswerSubmitted) return;
    const selectedArr = Array.from(currentSelectedMulti);
    evaluateAnswer(selectedArr);
  });

  // --- Fill in the Blank Submission ---
  el.blankSubmitBtn.addEventListener('click', () => {
    if (quizEngine.isAnswerSubmitted) return;
    const val = el.blankInput.value.trim();
    if (!val) {
      showToast('Please type an answer before submitting.');
      el.blankInput.focus();
      return;
    }
    evaluateAnswer(val);
  });

  el.blankInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      el.blankSubmitBtn.click();
    }
  });

  // --- Skip Question ---
  el.skipQuestionBtn.addEventListener('click', () => {
    if (quizEngine.isAnswerSubmitted) return;
    sound.playClick();
    evaluateAnswer(null);
  });

  // --- Evaluate Answer & Show Feedback ---
  function evaluateAnswer(userAnswer) {
    const result = quizEngine.submitAnswer(userAnswer);
    if (!result) return;

    const q = quizEngine.getCurrentQuestion();
    el.skipQuestionBtn.classList.add('hidden');
    el.confirmMultiBtn.classList.add('hidden');
    el.nextQuestionBtn.classList.remove('hidden');
    el.lifeline5050.disabled = true;
    el.lifelineHint.disabled = true;

    // Play Sound & Visual cues
    if (result.isCorrect) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }

    // Render Option States (for single / multi / boolean)
    if (q.type === 'single' || q.type === 'boolean') {
      const allCards = el.answersContainer.querySelectorAll('.option-card');
      allCards.forEach(card => {
        const idx = Number(card.dataset.index);
        card.classList.add('disabled');

        if (idx === q.correctAnswer) {
          card.classList.add('correct');
          card.querySelector('.option-status-icon').textContent = '✓';
        } else if (idx === userAnswer && !result.isCorrect) {
          card.classList.add('wrong');
          card.querySelector('.option-status-icon').textContent = '✗';
        }
      });
    } else if (q.type === 'multi') {
      const allCards = el.answersContainer.querySelectorAll('.option-card');
      const correctIndices = q.correctAnswer;
      const userSelected = Array.isArray(userAnswer) ? userAnswer : [];

      allCards.forEach(card => {
        const idx = Number(card.dataset.index);
        card.classList.add('disabled');

        if (correctIndices.includes(idx)) {
          card.classList.add('correct');
          card.querySelector('.option-status-icon').textContent = '✓';
        } else if (userSelected.includes(idx) && !correctIndices.includes(idx)) {
          card.classList.add('wrong');
          card.querySelector('.option-status-icon').textContent = '✗';
        }
      });
    } else if (q.type === 'blank') {
      el.blankInput.disabled = true;
      el.blankSubmitBtn.disabled = true;
      if (result.isCorrect) {
        el.blankInput.style.borderColor = 'var(--success)';
      } else {
        el.blankInput.style.borderColor = 'var(--error)';
      }
    }

    // Feedback banner reveal
    el.feedbackBanner.classList.remove('hidden');
    if (result.isCorrect) {
      el.feedbackBanner.classList.add('correct');
      el.feedbackIcon.textContent = '✓ Correct Answer!';
      el.feedbackPoints.textContent = `+${result.pointsEarned} pts`;
      el.feedbackPoints.classList.remove('hidden');
    } else {
      el.feedbackBanner.classList.add('wrong');
      el.feedbackIcon.textContent = '✗ Incorrect / Missed';
      el.feedbackPoints.classList.add('hidden');
    }

    // Formulate clean explanation text
    let expMsg = result.explanation;
    if (!result.isCorrect) {
      let correctDisplay = '';
      if (q.type === 'single' || q.type === 'boolean') {
        correctDisplay = q.options[q.correctAnswer];
      } else if (q.type === 'multi') {
        correctDisplay = q.correctAnswer.map(i => q.options[i]).join(', ');
      } else if (q.type === 'blank') {
        correctDisplay = q.acceptableAnswers[0];
      }
      expMsg = `Correct answer: <strong>${escapeHtml(correctDisplay)}</strong>.<br>${result.explanation}`;
    }
    el.feedbackExplanation.innerHTML = expMsg;

    // Update HUD Score & Streak
    el.hudScoreVal.textContent = quizEngine.score;
  }

  // --- Next Question or Finish ---
  el.nextQuestionBtn.addEventListener('click', () => {
    sound.playClick();
    if (quizEngine.nextQuestion()) {
      renderCurrentQuestion();
    } else {
      finishQuiz();
    }
  });

  // --- Finish Quiz & Render Results Dashboard ---
  function finishQuiz() {
    quizEngine.stopTimer();
    const results = quizEngine.getResultsSummary();
    showScreen('results');

    // Victory sound
    sound.playVictory();

    // Trigger Confetti if accuracy >= 60%
    if (results.accuracy >= 60) {
      confetti.start(results.accuracy === 100 ? 120 : 80);
    }

    // Performance Tier Details
    el.resultsTierBadge.textContent = results.tier.badge;
    el.resultsTierTitle.textContent = results.tier.title;

    if (results.accuracy === 100) {
      el.resultsTierMsg.textContent = 'Flawless execution! You scored 100% and demonstrated complete mastery.';
    } else if (results.accuracy >= 80) {
      el.resultsTierMsg.textContent = 'Outstanding work! Your knowledge and speed placed you in the top tier.';
    } else if (results.accuracy >= 60) {
      el.resultsTierMsg.textContent = 'Well done! A solid performance across challenging questions.';
    } else {
      el.resultsTierMsg.textContent = 'Good attempt! Review your answers below to learn and beat your score.';
    }

    // Points & New High Score
    el.resultsPointsVal.textContent = results.score;
    const globalStats = QuizEngine.getGlobalStats();
    if (results.score > 0 && results.score >= (globalStats.highScore || 0)) {
      el.resultsNewHighBadge.classList.remove('hidden');
    } else {
      el.resultsNewHighBadge.classList.add('hidden');
    }

    // Radial Gauge Animation
    // Circumference = 2 * PI * 52 ≈ 326.72
    const circumference = 326.72;
    el.resultsGaugePath.style.strokeDasharray = `${circumference}`;
    el.resultsGaugePath.style.strokeDashoffset = `${circumference}`;

    setTimeout(() => {
      const offset = circumference - (results.accuracy / 100) * circumference;
      el.resultsGaugePath.style.strokeDashoffset = `${offset}`;
      el.resultsAccuracyVal.textContent = `${results.accuracy}%`;
    }, 150);

    // Metric Cards
    el.metricCorrect.textContent = `${results.totalCorrect} / ${results.totalQuestions}`;
    el.metricIncorrect.textContent = `${results.totalIncorrect}`;
    el.metricStreak.textContent = `${results.maxStreak} 🔥`;
    el.metricTime.textContent = `${results.avgTime}s`;

    // Populate Review Drawer
    buildReviewDrawer(results.answers);
  }

  // --- Build Review Drawer ---
  function buildReviewDrawer(answers) {
    el.reviewItemsContainer.innerHTML = '';
    const correctCount = answers.filter(a => a.isCorrect).length;
    const incorrectCount = answers.length - correctCount;

    el.countReviewAll.textContent = answers.length;
    el.countReviewCorrect.textContent = correctCount;
    el.countReviewIncorrect.textContent = incorrectCount;

    answers.forEach((ans, idx) => {
      const card = document.createElement('div');
      card.className = `review-card ${ans.isCorrect ? 'correct-item' : 'wrong-item'}`;
      card.dataset.status = ans.isCorrect ? 'correct' : 'incorrect';

      // Format user's answer
      let userAnsText = 'No answer (Skipped / Time out)';
      if (ans.userAnswer !== null && ans.userAnswer !== undefined && ans.userAnswer !== '') {
        if (ans.type === 'single' || ans.type === 'boolean') {
          userAnsText = ans.options[ans.userAnswer] || String(ans.userAnswer);
        } else if (ans.type === 'multi') {
          userAnsText = ans.userAnswer.map(i => ans.options[i]).join(', ');
        } else if (ans.type === 'blank') {
          userAnsText = ans.userAnswer;
        }
      }

      // Format correct answer
      let correctAnsText = '';
      if (ans.type === 'single' || ans.type === 'boolean') {
        correctAnsText = ans.options[ans.correctAnswer];
      } else if (ans.type === 'multi') {
        correctAnsText = ans.correctAnswer.map(i => ans.options[i]).join(', ');
      } else if (ans.type === 'blank') {
        correctAnsText = Array.isArray(ans.correctAnswer) ? ans.correctAnswer[0] : ans.correctAnswer;
      }

      card.innerHTML = `
        <div class="review-q-meta">
          <span class="review-badge ${ans.isCorrect ? 'correct' : 'wrong'}">
            ${ans.isCorrect ? '✓ Correct' : '✗ Missed'} (+${ans.pointsEarned} pts)
          </span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Q${idx + 1} • ${ans.timeSpent}s spent</span>
        </div>
        <div class="review-q-title">${escapeHtml(ans.question)}</div>
        ${ans.codeSnippet ? `<pre class="code-container" style="padding:0.75rem;margin-bottom:0.75rem;"><code style="font-size:0.85rem;">${escapeHtml(ans.codeSnippet)}</code></pre>` : ''}
        <div class="review-answer-box">
          <div class="review-row">
            <span class="review-lbl">Your Answer:</span>
            <span class="review-val ${ans.isCorrect ? 'correct-text' : 'wrong-text'}">${escapeHtml(userAnsText)}</span>
          </div>
          ${!ans.isCorrect ? `
          <div class="review-row">
            <span class="review-lbl">Correct Answer:</span>
            <span class="review-val correct-text">${escapeHtml(correctAnsText)}</span>
          </div>
          ` : ''}
        </div>
        <div class="review-explanation">
          <strong>Explanation:</strong> ${ans.explanation}
        </div>
      `;

      el.reviewItemsContainer.appendChild(card);
    });
  }

  // --- Review Filter Pills ---
  const filterPills = document.querySelectorAll('.filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      sound.playClick();
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter;
      const reviewCards = el.reviewItemsContainer.querySelectorAll('.review-card');

      reviewCards.forEach(card => {
        if (filter === 'all' || card.dataset.status === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --- Toggle Review Drawer ---
  el.toggleReviewBtn.addEventListener('click', () => {
    sound.playClick();
    const isHidden = el.reviewDrawer.classList.contains('hidden');
    if (isHidden) {
      el.reviewDrawer.classList.remove('hidden');
      el.reviewDrawer.scrollIntoView({ behavior: 'smooth' });
    } else {
      el.reviewDrawer.classList.add('hidden');
    }
  });

  // --- Retake Quiz Action ---
  el.retakeQuizBtn.addEventListener('click', () => {
    sound.playClick();
    showScreen('setup');
    refreshGlobalStats();
  });

  // --- Share Score to Clipboard ---
  el.shareScoreBtn.addEventListener('click', () => {
    sound.playClick();
    const results = quizEngine.getResultsSummary();
    const shareText = `🎯 QuizPulse Challenge Results:\n` +
      `🏆 Score: ${results.score} PTS\n` +
      `📊 Accuracy: ${results.accuracy}% (${results.totalCorrect}/${results.totalQuestions})\n` +
      `🔥 Longest Streak: ${results.maxStreak}\n` +
      `⚡ Rank: ${results.tier.title} ${results.tier.badge}\n` +
      `Challenge yourself on QuizPulse!`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(() => {
        showToast('Result summary copied to clipboard! 📋');
        el.shareBtnLabel.textContent = 'Copied!';
        setTimeout(() => el.shareBtnLabel.textContent = 'Share Score', 2000);
      }).catch(() => {
        fallbackCopyText(shareText);
      });
    } else {
      fallbackCopyText(shareText);
    }
  });

  function fallbackCopyText(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Result summary copied to clipboard! 📋');
  }

  // --- Global Keyboard Shortcuts ---
  window.addEventListener('keydown', (e) => {
    // Ignore keystrokes when typing in an active text input or on other screens
    if (e.target.tagName === 'INPUT' && e.target.type === 'text') return;
    if (!el.quizScreen.classList.contains('active')) return;

    // Keys 1 - 5 or A - E
    const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4 };
    const lowerKey = e.key.toLowerCase();

    if (keyMap[lowerKey] !== undefined) {
      const idx = keyMap[lowerKey];
      const optCard = el.answersContainer.querySelector(`[data-index="${idx}"]`);
      if (optCard && !optCard.classList.contains('disabled') && !optCard.classList.contains('eliminated')) {
        optCard.click();
      }
    } else if (e.key === 'Enter') {
      if (!el.confirmMultiBtn.classList.contains('hidden')) {
        el.confirmMultiBtn.click();
      } else if (!el.nextQuestionBtn.classList.contains('hidden')) {
        el.nextQuestionBtn.click();
      }
    }
  });

  // --- Utility Functions ---
  function escapeHtml(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }

  // --- Initialize App ---
  initTheme();
  initAudioState();
  refreshGlobalStats();
});
