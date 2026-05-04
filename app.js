const ROUNDS_COLLECTION = "rounds";
const PLAYER_STORAGE_KEY = "goalless_player_names";
const DRAFT_STORAGE_KEY = "goalless_draft";
const LEGACY_STORAGE_KEY = "goalless_rounds";
const DEFAULT_PLAYERS = ["Trym", "Friend"];
const ANSWERS_PER_PLAYER = 5;

const firebase = window.goallessFirebase;
const savedPlayers = loadPlayers();
const state = {
  players: savedPlayers,
  draft: loadDraft(savedPlayers),
  rounds: [],
  loading: true,
  saving: false,
};

const roundForm = document.querySelector("#roundForm");
const roundDate = document.querySelector("#roundDate");
const roundCategory = document.querySelector("#roundCategory");
const playerForms = document.querySelector("#playerForms");
const leaderboard = document.querySelector("#leaderboard");
const historyList = document.querySelector("#historyList");
const roundCount = document.querySelector("#roundCount");
const saveMessage = document.querySelector("#saveMessage");
const appStatus = document.querySelector("#appStatus");
const saveRoundButton = document.querySelector("#saveRoundButton");
const clearFormButton = document.querySelector("#clearFormButton");
const playerTemplate = document.querySelector("#playerFormTemplate");

init();

async function init() {
  roundDate.value = state.draft?.date || getToday();
  roundCategory.value = state.draft?.category || "";
  renderPlayerForms();
  render();

  roundForm.addEventListener("input", persistDraft);
  roundForm.addEventListener("submit", handleSaveRound);
  clearFormButton.addEventListener("click", resetRoundInputs);
  historyList.addEventListener("click", handleHistoryClick);

  if (!firebase?.db) {
    state.loading = false;
    showStatus("Firebase did not initialize.", true);
    render();
    return;
  }

  await loadRounds();
}

function loadPlayers() {
  const saved = readJson(PLAYER_STORAGE_KEY);
  if (Array.isArray(saved)) {
    return normalizePlayers(saved);
  }

  const legacy = readJson(LEGACY_STORAGE_KEY);
  if (legacy && typeof legacy === "object" && Array.isArray(legacy.players)) {
    return normalizePlayers(legacy.players);
  }

  return [...DEFAULT_PLAYERS];
}

function savePlayers() {
  localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(state.players));
}

function loadDraft(players) {
  const saved = readJson(DRAFT_STORAGE_KEY);
  return normalizeDraft(saved, players);
}

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn(`Unable to read ${key}.`, error);
    return null;
  }
}

function normalizePlayers(players) {
  const cleanPlayers = Array.isArray(players)
    ? players.map((name) => String(name || "").trim()).filter(Boolean).slice(0, 2)
    : [];

  return [
    cleanPlayers[0] || DEFAULT_PLAYERS[0],
    cleanPlayers[1] || DEFAULT_PLAYERS[1],
  ];
}

function normalizeDraft(draft, players) {
  if (!draft || typeof draft !== "object") {
    return null;
  }

  const draftPlayers = Array.isArray(draft.players) ? draft.players : [];

  return {
    date: String(draft.date || getToday()),
    category: String(draft.category || ""),
    players: players.map((playerName, playerIndex) => {
      const draftPlayer = draftPlayers[playerIndex] || {};
      const answers = Array.isArray(draftPlayer.answers) ? draftPlayer.answers : [];

      return {
        name: String(draftPlayer.name || playerName),
        answers: Array.from({ length: ANSWERS_PER_PLAYER }, (_, answerIndex) => {
          const savedAnswer = answers[answerIndex] || {};

          return {
            answer: String(savedAnswer.answer || ""),
            points: savedAnswer.points === undefined ? "" : String(savedAnswer.points),
          };
        }),
      };
    }),
  };
}

function renderPlayerForms() {
  playerForms.innerHTML = "";

  state.players.forEach((playerName, playerIndex) => {
    const fragment = playerTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".player-card");
    const nameInput = fragment.querySelector(".player-name");
    const total = fragment.querySelector(".player-total strong");
    const answersList = fragment.querySelector(".answers-list");
    const draftPlayer = state.draft?.players?.[playerIndex];

    card.dataset.playerIndex = String(playerIndex);
    nameInput.value = draftPlayer?.name || playerName;
    nameInput.addEventListener("input", () => {
      state.players[playerIndex] = nameInput.value.trim() || DEFAULT_PLAYERS[playerIndex];
      savePlayers();
      renderLeaderboard();
    });

    for (let answerIndex = 0; answerIndex < ANSWERS_PER_PLAYER; answerIndex += 1) {
      answersList.appendChild(createAnswerRow(answerIndex, draftPlayer?.answers?.[answerIndex]));
    }

    total.textContent = String(calculateCardTotal(card));

    card.addEventListener("input", () => {
      total.textContent = String(calculateCardTotal(card));
    });

    playerForms.appendChild(fragment);
  });
}

function createAnswerRow(answerIndex, savedAnswer = null) {
  const row = document.createElement("div");
  row.className = "answer-row";

  const answerInput = document.createElement("input");
  answerInput.type = "text";
  answerInput.placeholder = `Answer ${answerIndex + 1}`;
  answerInput.autocomplete = "off";
  answerInput.className = "answer-input";
  answerInput.value = savedAnswer?.answer || "";

  const pointsInput = document.createElement("input");
  pointsInput.type = "number";
  pointsInput.placeholder = "Pts";
  pointsInput.min = "0";
  pointsInput.step = "1";
  pointsInput.inputMode = "numeric";
  pointsInput.className = "points-input";
  pointsInput.value = savedAnswer?.points || "";

  row.append(answerInput, pointsInput);
  return row;
}

async function loadRounds() {
  state.loading = true;
  showStatus("Loading rounds...");
  render();

  try {
    const roundsQuery = firebase.query(
      firebase.collection(firebase.db, ROUNDS_COLLECTION),
      firebase.orderBy("date", "desc"),
    );
    const snapshot = await firebase.getDocs(roundsQuery);

    state.rounds = snapshot.docs.map((roundDoc) =>
      normalizeRound({
        id: roundDoc.id,
        ...roundDoc.data(),
      }),
    );
    sortRounds();
    showStatus("");
  } catch (error) {
    console.error("Unable to load rounds.", error);
    showStatus("Could not load Firestore rounds.", true);
  } finally {
    state.loading = false;
    render();
  }
}

function persistDraft() {
  const draft = {
    date: roundDate.value || getToday(),
    category: roundCategory.value,
    players: [...document.querySelectorAll(".player-card")].map((card) => ({
      name: card.querySelector(".player-name").value,
      answers: [...card.querySelectorAll(".answer-row")].map((row) => ({
        answer: row.querySelector(".answer-input").value,
        points: row.querySelector(".points-input").value,
      })),
    })),
  };

  state.draft = draft;
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

async function handleSaveRound(event) {
  event.preventDefault();

  const category = roundCategory.value.trim();
  if (!category) {
    showMessage("Add a category before saving.");
    roundCategory.focus();
    return;
  }

  if (!firebase?.db) {
    showMessage("Firebase is not ready.");
    return;
  }

  const players = [...document.querySelectorAll(".player-card")].map((card, playerIndex) => {
    const nameInput = card.querySelector(".player-name");
    const name = nameInput.value.trim() || DEFAULT_PLAYERS[playerIndex];
    const answers = [...card.querySelectorAll(".answer-row")].map((row, answerIndex) => {
      const answer = row.querySelector(".answer-input").value.trim();
      const points = parsePoints(row.querySelector(".points-input").value);

      return {
        answer: answer || `Answer ${answerIndex + 1}`,
        points,
      };
    });

    return {
      name,
      answers,
      total: sumAnswers(answers),
    };
  });

  const round = {
    date: roundDate.value || getToday(),
    category,
    players,
    createdAt: new Date().toISOString(),
  };

  setSaving(true);
  showMessage("Saving round...");

  try {
    const savedRound = await firebase.addDoc(
      firebase.collection(firebase.db, ROUNDS_COLLECTION),
      round,
    );

    state.players = players.map((player) => player.name);
    savePlayers();
    state.rounds.push({
      id: savedRound.id,
      ...round,
    });
    sortRounds();
    clearDraft();
    resetRoundInputs();
    render();
    showMessage("Round saved.");
  } catch (error) {
    console.error("Unable to save round.", error);
    showMessage("Could not save round.");
  } finally {
    setSaving(false);
  }
}

function resetRoundInputs() {
  roundDate.value = getToday();
  roundCategory.value = "";

  document.querySelectorAll(".player-card").forEach((card) => {
    card.querySelectorAll(".answer-input, .points-input").forEach((input) => {
      input.value = "";
    });
    card.querySelector(".player-total strong").textContent = "0";
  });

  persistDraft();
}

async function handleHistoryClick(event) {
  const deleteButton = event.target.closest("[data-delete-round]");
  if (!deleteButton) {
    return;
  }

  const roundId = deleteButton.dataset.deleteRound;
  const round = state.rounds.find((item) => item.id === roundId);
  const label = round ? `${formatDate(round.date)} - ${round.category}` : "this round";

  if (!confirm(`Delete ${label}?`)) {
    return;
  }

  deleteButton.disabled = true;
  deleteButton.textContent = "Deleting...";

  try {
    await firebase.deleteDoc(firebase.doc(firebase.db, ROUNDS_COLLECTION, roundId));
    state.rounds = state.rounds.filter((item) => item.id !== roundId);
    render();
    showStatus("Round deleted.");
    window.setTimeout(() => showStatus(""), 1800);
  } catch (error) {
    console.error("Unable to delete round.", error);
    deleteButton.disabled = false;
    deleteButton.textContent = "Delete";
    showStatus("Could not delete round.", true);
  }
}

function render() {
  renderLeaderboard();
  renderHistory();
  roundCount.textContent = `${state.rounds.length} ${state.rounds.length === 1 ? "round" : "rounds"}`;
}

function renderLeaderboard() {
  const rows = buildLeaderboard();
  leaderboard.innerHTML = "";

  if (!rows.length) {
    leaderboard.innerHTML = '<div class="empty-state">Save a round to start the table.</div>';
    return;
  }

  rows.forEach((row, index) => {
    const card = document.createElement("article");
    card.className = "leader-card";
    card.innerHTML = `
      <div class="rank">${index + 1}</div>
      <h3 class="leader-name">${escapeHtml(row.name)}</h3>
      <div class="leader-stats">
        <div class="stat">
          <span>Total</span>
          <strong>${row.total}</strong>
        </div>
        <div class="stat">
          <span>Wins</span>
          <strong>${row.wins}</strong>
        </div>
        <div class="stat">
          <span>Average</span>
          <strong>${formatAverage(row.average)}</strong>
        </div>
      </div>
    `;
    leaderboard.appendChild(card);
  });
}

function buildLeaderboard() {
  const table = new Map();

  state.players.forEach((name) => {
    table.set(name, {
      name,
      total: 0,
      wins: 0,
      rounds: 0,
      average: 0,
    });
  });

  state.rounds.forEach((round) => {
    const winningTotal = Math.min(...round.players.map((player) => player.total));

    round.players.forEach((player) => {
      if (!table.has(player.name)) {
        table.set(player.name, {
          name: player.name,
          total: 0,
          wins: 0,
          rounds: 0,
          average: 0,
        });
      }

      const row = table.get(player.name);
      row.total += player.total;
      row.rounds += 1;

      if (player.total === winningTotal) {
        row.wins += 1;
      }
    });
  });

  return [...table.values()]
    .map((row) => ({
      ...row,
      average: row.rounds ? row.total / row.rounds : 0,
    }))
    .sort((a, b) => a.total - b.total || b.wins - a.wins || a.name.localeCompare(b.name));
}

function renderHistory() {
  historyList.innerHTML = "";

  if (state.loading) {
    historyList.innerHTML = '<div class="empty-state">Fetching Firestore rounds...</div>';
    return;
  }

  if (!state.rounds.length) {
    historyList.innerHTML = '<div class="empty-state">No rounds saved yet.</div>';
    return;
  }

  state.rounds.forEach((round) => {
    const winningTotal = Math.min(...round.players.map((player) => player.total));
    const card = document.createElement("article");
    card.className = "history-card";
    card.innerHTML = `
      <div class="history-top">
        <div>
          <p class="round-date">${formatDate(round.date)}</p>
          <h3 class="round-category">${escapeHtml(round.category)}</h3>
        </div>
        <button class="delete-button" type="button" data-delete-round="${round.id}">Delete</button>
      </div>
      <div class="history-players">
        ${round.players
          .map((player) => renderHistoryPlayer(player, player.total === winningTotal))
          .join("")}
      </div>
    `;
    historyList.appendChild(card);
  });
}

function renderHistoryPlayer(player, isWinner) {
  return `
    <section class="history-player ${isWinner ? "is-winner" : ""}">
      <div class="history-player-header">
        <h3 class="history-player-name">${escapeHtml(player.name)}</h3>
        ${isWinner ? '<span class="winner-badge">Winner</span>' : ""}
      </div>
      <ul class="answer-history">
        ${player.answers
          .map(
            (answer) => `
              <li>
                <span>${escapeHtml(answer.answer)}</span>
                <span>${answer.points}</span>
              </li>
            `,
          )
          .join("")}
      </ul>
      <div class="history-total">
        <span>Total</span>
        <strong>${player.total}</strong>
      </div>
    </section>
  `;
}

function normalizeRound(round) {
  const players = Array.isArray(round.players) ? round.players : [];

  return {
    id: String(round.id),
    date: String(round.date || getToday()),
    category: String(round.category || "Untitled round"),
    createdAt: String(round.createdAt || ""),
    players: players.slice(0, 2).map((player, playerIndex) => {
      const answers = Array.isArray(player.answers) ? player.answers : [];
      const normalizedAnswers = Array.from({ length: ANSWERS_PER_PLAYER }, (_, answerIndex) => {
        const answer = answers[answerIndex] || {};

        return {
          answer: String(answer.answer || `Answer ${answerIndex + 1}`),
          points: parsePoints(answer.points),
        };
      });

      return {
        name: String(player.name || DEFAULT_PLAYERS[playerIndex]),
        answers: normalizedAnswers,
        total: Number.isFinite(Number(player.total))
          ? Number(player.total)
          : sumAnswers(normalizedAnswers),
      };
    }),
  };
}

function sortRounds() {
  state.rounds.sort((a, b) => {
    const dateDifference = new Date(`${b.date}T00:00:00`) - new Date(`${a.date}T00:00:00`);
    if (dateDifference !== 0) {
      return dateDifference;
    }

    return String(b.createdAt).localeCompare(String(a.createdAt));
  });
}

function calculateCardTotal(card) {
  return [...card.querySelectorAll(".points-input")].reduce(
    (total, input) => total + parsePoints(input.value),
    0,
  );
}

function sumAnswers(answers) {
  return answers.reduce((total, answer) => total + answer.points, 0);
}

function parsePoints(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function setSaving(isSaving) {
  state.saving = isSaving;
  saveRoundButton.disabled = isSaving;
  saveRoundButton.textContent = isSaving ? "Saving..." : "Save round";
}

function clearDraft() {
  state.draft = null;
  localStorage.removeItem(DRAFT_STORAGE_KEY);
}

function getToday() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatAverage(value) {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  });
}

function showMessage(message) {
  saveMessage.textContent = message;

  if (!message) {
    return;
  }

  window.clearTimeout(showMessage.timeout);
  showMessage.timeout = window.setTimeout(() => {
    saveMessage.textContent = "";
  }, 2600);
}

function showStatus(message, isError = false) {
  appStatus.textContent = message;
  appStatus.classList.toggle("is-error", isError);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
