const SYMBOLS = ['🍎', '🌟', '🎈', '🐱', '🌈', '🎵', '🚀', '🌻', '🐶', '🍕', '⚡', '🎯'];

// Effets sonores (Avec Web Audio API)
let audioCtx = null;
let soundMuted = false;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function playTone(freq, duration, type = 'sine', gain = 0.15) {
  if (soundMuted) return;
  const c = getAudioCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}
function sfxFlip() { playTone(600, 0.08, 'sine', 0.1); }
function sfxMatch() {
  playTone(523, 0.12, 'triangle', 0.12);
  setTimeout(() => playTone(659, 0.12, 'triangle', 0.12), 80);
  setTimeout(() => playTone(784, 0.18, 'triangle', 0.12), 160);
}
function sfxWin() {
  [523, 659, 784, 880, 1047].forEach((n, i) =>
    setTimeout(() => playTone(n, 0.25, 'triangle', 0.12), i * 120)
  );
}

// Définition de la grille de jeu
const GRID_CONFIG = {
    easy: { cols: 4, rows: 3 },
    medium: { cols: 4, rows: 4 },
    hard: { cols: 4, rows: 6 },
};

const LABELS = { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' };

// DOM
const menuScreen = document.getElementById('menu');
const gameScreen = document.getElementById('game');
const winScreen = document.getElementById('win');
const grid = document.getElementById('grid');
const diffLabel = document.getElementById('difficulty-label');
const movesLabel = document.getElementById('moves-label');
const winMoves = document.getElementById('win-moves');
const backBtn = document.getElementById('back-btn');
const replayBtn = document.getElementById('replay-btn');
const changeBtn = document.getElementById('change-btn');
const soundBtn   = document.getElementById('sound-btn');

let currentDifficulty = null;
let cards = [];
let selected = [];
let moves = 0;
let locked = false;

// Afficher / Masquer les écrans
function showScreen(screen) {
    [menuScreen, gameScreen, winScreen].forEach(s => s.classList.add('hidden'));
    screen.classList.remove('hidden');
}

// Algorithme de mélange de Fisher-Yates
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Création de la plateforme
function createDeck(difficulty) {
    const { cols, rows } = GRID_CONFIG[difficulty];
    const pairCount = (cols * rows) / 2;
    const picked = SYMBOLS.slice(0, pairCount);
    const pairs = shuffle([...picked, ...picked]);

    return pairs.map((symbol, i) => ({
        id: i,
        symbol,
        isFlipped: false,
        isMatched: false,
    }));
}

// Affichage de la grille ("el" est un nom choisi pour désigner un élément créé)
function renderGrid() {
    const { cols } = GRID_CONFIG[currentDifficulty];
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.innerHTML = '';

    cards.forEach(card => {
        const el = document.createElement('div');
        el.className = 'card-flip';
        el.dataset.id = card.id;

        el.innerHTML = `
      <div class="card-inner${card.isFlipped || card.isMatched ? ' flipped' : ''}">
        <div class="card-face card-back">
          <span class="card-back-label">?</span>
        </div>
        <div class="card-face card-front">
          <span class="card-emoji">${card.symbol}</span>
        </div>
      </div>
    `;

        if (card.isMatched) el.classList.add('card-matched');

        el.addEventListener('click', () => handleClick(card.id));
        grid.appendChild(el);
    });
}

function updateMovesLabel() {
    movesLabel.textContent = `${moves} coup${moves !== 1 ? 's' : ''}`;
}

// Gérer le clic de la carte
function handleClick(id) {
    if (locked) return;

    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;
    if (selected.includes(id)) return;

    card.isFlipped = true;
    selected.push(id);
    sfxFlip();
    renderGrid();

    if (selected.length === 2) {
        locked = true;
        moves++;
        updateMovesLabel();

        const [aId, bId] = selected;
        const a = cards.find(c => c.id === aId);
        const b = cards.find(c => c.id === bId);

        if (a.symbol === b.symbol) {
            // Correspondance
            setTimeout(() => {
                a.isMatched = true;
                b.isMatched = true;
                selected = [];
                locked = false;
                sfxMatch();
                renderGrid();

                if (cards.every(c => c.isMatched)) {
                    setTimeout(() => showWin(), 300);
                }
            }, 300);
        } else {
            // Différence
            // Ajouter un shake
            const els = grid.querySelectorAll(`[data-id="${aId}"], [data-id="${bId}"]`);
            setTimeout(() => {
                els.forEach(el => el.classList.add('card-wrong'));
            }, 50);

            setTimeout(() => {
                a.isFlipped = false;
                b.isFlipped = false;
                selected = [];
                locked = false;
                renderGrid();
            }, 600);
        }
    }
}

// Démarrer le jeu
function startGame(difficulty) {
    currentDifficulty = difficulty;
    cards = createDeck(difficulty);
    selected = [];
    moves = 0;
    locked = false;

    diffLabel.textContent = LABELS[difficulty];
    updateMovesLabel();
    renderGrid();
    showScreen(gameScreen);
}

// Affichage de l'écran de victoire
function showWin() {
    winMoves.textContent = moves;
    showScreen(winScreen);
    sfxWin();
}

// Événements - boutons de menu
document.querySelectorAll('[data-difficulty]').forEach(btn => {
    btn.addEventListener('click', () => startGame(btn.dataset.difficulty));
});

backBtn.addEventListener('click', () => showScreen(menuScreen));
replayBtn.addEventListener('click', () => startGame(currentDifficulty));
changeBtn.addEventListener('click', () => showScreen(menuScreen));
soundBtn.addEventListener('click', () => {
  soundMuted = !soundMuted;
  soundBtn.textContent = soundMuted ? '🔇' : '🔊';
  soundBtn.setAttribute('aria-label', soundMuted ? 'Activer le son' : 'Couper le son');
});