const SYMBOLS = ['🍎', '🌟', '🎈', '🐱', '🌈', '🎵', '🚀', '🌻', '🐶', '🍕', '⚡', '🎯'];

const GRID_CONFIG = {
    easy: { cols: 4, rows: 3 },
    medium: { cols: 4, rows: 4 },
    hard: { cols: 4, rows: 6 },
};

const LABELS = { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' };

// DOM
const menuScreen = document.getElementById('menu');
const gameScreen = document.getElementById('game');
const grid = document.getElementById('grid');
const diffLabel = document.getElementById('difficulty-label');


let currentDifficulty = null;
let cards = [];
let locked = false;

// Afficher / Masquer les écrans
function showScreen(screen) {
    [menuScreen, gameScreen].forEach(s => s.classList.add('hidden'));
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

// Affichage de la grille
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

// Gérer le clic de la carte
function handleClick() {
    
}

// Démarrer le jeu
function startGame(difficulty) {
    currentDifficulty = difficulty;
    cards = createDeck(difficulty);
    selected = [];
    moves = 0;
    locked = false;

     diffLabel.textContent = LABELS[difficulty];
      renderGrid();
      showScreen(gameScreen);
}

// Événements - boutons de menu
document.querySelectorAll('[data-difficulty]').forEach(btn => {
    btn.addEventListener('click', () => startGame(btn.dataset.difficulty));
});