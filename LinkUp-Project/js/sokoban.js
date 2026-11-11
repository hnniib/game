// Sokoban Grammar Adventure Engine
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 60;
const GRID_SIZE = 10; // 10x10 Grid

// Level Data
const levels = [
  {
    level: 1,
    question: "The road was flooded. ______, the match was cancelled.",
    correct: "Consequently",
    hint: "Menunjukkan hubungan sebab-akibat (Consequence).",
    // Map Legend: 1=Wall, 0=Floor, 2=Exit Breach, 3=Player Spawn, C=Crate Spawn
    map: [
      [1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 3, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    crates: [
      { x: 3, y: 2, text: "For example" },
      { x: 5, y: 4, text: "Consequently" },
      { x: 7, y: 6, text: "Moreover" },
    ],
  },
  {
    level: 2,
    question: "She studied hard for the test; ______, she got an A.",
    correct: "Therefore",
    hint: "Kata hubung kesimpulan (Result).",
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 3, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    ],
    crates: [
      { x: 2, y: 3, text: "However" },
      { x: 4, y: 4, text: "Therefore" },
      { x: 6, y: 5, text: "In contrast" },
    ],
  },
];

let currentLevelIdx = 0;
let map = [];
let player = { x: 0, y: 0 };
let crates = [];
let exitTile = { x: 0, y: 0 };
let history = [];
let animatingCrate = null;

// Sound Effects (Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
  if (audioCtx.state === "suspended") audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === "move") {
    osc.frequency.setValueAtTime(180, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } else if (type === "push") {
    osc.type = "square";
    osc.frequency.setValueAtTime(110, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } else if (type === "bounce") {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  } else if (type === "win") {
    osc.type = "triangle";
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  }
}

// Load Level
function loadLevel(idx) {
  const lvlData = levels[idx];
  document.getElementById("level-badge").innerText =
    `LEVEL ${lvlData.level} / ${levels.length}`;
  document.getElementById("question-text").innerText = lvlData.question;

  map = JSON.parse(JSON.stringify(lvlData.map));
  crates = JSON.parse(JSON.stringify(lvlData.crates));
  history = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (map[r][c] === 3) {
        player = { x: c, y: r };
        map[r][c] = 0;
      }
      if (map[r][c] === 2) {
        exitTile = { x: c, y: r };
      }
    }
  }
  draw();
}

// Render Logic
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw Floor & Walls
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const x = c * TILE_SIZE;
      const y = r * TILE_SIZE;

      if (map[r][c] === 1) {
        // Tembok Slate Gelap
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
      } else if (map[r][c] === 2) {
        // Exit Hole di Tembok
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = "#10b981";
        ctx.font = "bold 12px Nunito";
        ctx.textAlign = "center";
        ctx.fillText("EXIT", x + TILE_SIZE / 2, y + TILE_SIZE / 2 + 4);
      } else {
        // Lantai Slate
        ctx.fillStyle = "#334155";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  // 2. Draw Crates
  crates.forEach((crate) => {
    const cx = crate.x * TILE_SIZE;
    const cy = crate.y * TILE_SIZE;

    ctx.fillStyle = "#d97706";
    ctx.fillRect(cx + 4, cy + 4, TILE_SIZE - 8, TILE_SIZE - 8);
    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 3;
    ctx.strokeRect(cx + 4, cy + 4, TILE_SIZE - 8, TILE_SIZE - 8);

    // Dynamic Text Inside Crate
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px Nunito";
    ctx.textAlign = "center";
    ctx.fillText(
      crate.text,
      cx + TILE_SIZE / 2,
      cy + TILE_SIZE / 2 + 4,
      TILE_SIZE - 12,
    );
  });

  // 3. Draw Knight Character
  const px = player.x * TILE_SIZE;
  const py = player.y * TILE_SIZE;

  // Body Knight
  ctx.fillStyle = "#3b82f6";
  ctx.beginPath();
  ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 18, 0, Math.PI * 2);
  ctx.fill();

  // Helmet Plume/Crown
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(px + TILE_SIZE / 2 - 4, py + 8, 8, 6);
}

// Move Player Logic
function move(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;

  if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) return;

  const crateIdx = crates.findIndex((c) => c.x === newX && c.y === newY);

  // Push Crate
  if (crateIdx !== -1) {
    const crateNextX = newX + dx;
    const crateNextY = newY + dy;

    // Hit Wall or Target Exit
    if (map[crateNextY][crateNextX] === 1) return; // Blocked by wall

    // Another Crate Blocking
    if (crates.some((c) => c.x === crateNextX && c.y === crateNextY)) return;

    // Check if pushed into Exit
    if (map[crateNextY][crateNextX] === 2) {
      const pushedCrate = crates[crateIdx];
      const currentLevel = levels[currentLevelIdx];

      if (pushedCrate.text === currentLevel.correct) {
        // Jawaban Benar -> Lolos Exit
        playSound("win");
        setTimeout(() => {
          alert("Jawaban Benar! 🎉");
          currentLevelIdx = (currentLevelIdx + 1) % levels.length;
          loadLevel(currentLevelIdx);
        }, 150);
        return;
      } else {
        // Jawaban Salah -> Memantul Balik
        playSound("bounce");
        pushedCrate.x = newX; // Crate stays in front of exit
        pushedCrate.y = newY;
        draw();
        return;
      }
    }

    // Normal Crate Push
    history.push(JSON.stringify({ player, crates }));
    crates[crateIdx].x = crateNextX;
    crates[crateIdx].y = crateNextY;
    player.x = newX;
    player.y = newY;
    playSound("push");
  } else if (map[newY][newX] === 0) {
    // Empty floor move
    history.push(JSON.stringify({ player, crates }));
    player.x = newX;
    player.y = newY;
    playSound("move");
  }

  draw();
}

// Input Listeners
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "w") move(0, -1);
  if (e.key === "ArrowDown" || e.key === "s") move(0, 1);
  if (e.key === "ArrowLeft" || e.key === "a") move(-1, 0);
  if (e.key === "ArrowRight" || e.key === "d") move(1, 0);
});

// Controls & Buttons
document.getElementById("btn-up").onclick = () => move(0, -1);
document.getElementById("btn-down").onclick = () => move(0, 1);
document.getElementById("btn-left").onclick = () => move(-1, 0);
document.getElementById("btn-right").onclick = () => move(1, 0);

document.getElementById("btn-undo").onclick = () => {
  if (history.length > 0) {
    const lastState = JSON.parse(history.pop());
    player = lastState.player;
    crates = lastState.crates;
    draw();
  }
};

document.getElementById("btn-reset").onclick = () => loadLevel(currentLevelIdx);
document.getElementById("btn-hint").onclick = () => {
  alert("Hint: " + levels[currentLevelIdx].hint);
};

// Initialize Game
loadLevel(0);
