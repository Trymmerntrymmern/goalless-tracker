const ROUNDS_COLLECTION = "rounds";
const PLAYER_STORAGE_KEY = "goalless_player_names";
const DRAFT_STORAGE_KEY = "goalless_draft";
const LEGACY_STORAGE_KEY = "goalless_rounds";
const DEFAULT_PLAYERS = ["Trym", "Nicolai"];
const ANSWERS_PER_PLAYER = 5;
const DUPLICATE_PLAYER_ERROR = "duplicate-player";
const HISTORICAL_SEASONS = [
  {
    year: 2025,
    source: "Excel import",
    rounds: 52,
    draws: 0,
    players: {
      Nicolai: {
        total: 17947,
        wins: 12,
        average: 345.13461538461536,
        median: 360.5,
        best: 119,
        bestLabel: "Round 38",
        worst: 500,
        worstLabel: "Round 27",
      },
      Trym: {
        total: 14107,
        wins: 40,
        average: 271.28846153846155,
        median: 296,
        best: 24,
        bestLabel: "Round 49",
        worst: 464,
        worstLabel: "Round 50",
      },
    },
  },
  {
    year: 2026,
    source: "Excel import",
    rounds: 83,
    draws: 1,
    players: {
      Nicolai: {
        total: 29553,
        wins: 15,
        average: 356.06024096385545,
        median: 353,
        best: 150,
        bestLabel: "27 Feb 2026",
        worst: 500,
        worstLabel: "7 Jan 2026",
        changeFrom2025: 0.031656128050397546,
      },
      Trym: {
        total: 23208,
        wins: 67,
        average: 279.6144578313253,
        median: 277,
        best: 89,
        bestLabel: "31 Mar 2026",
        worst: 500,
        worstLabel: "9 Feb 2026",
        changeFrom2025: 0.030690565480181113,
      },
    },
  },
];
const HISTORICAL_ROUND_SOURCE = `
2025,,405,334
2025,,244,127
2025,,259,270
2025,,224,152
2025,,217,264
2025,,465,207
2025,,344,357
2025,,313,415
2025,,335,184
2025,,331,232
2025,,320,328
2025,,390,408
2025,,366,223
2025,,358,307
2025,,237,64
2025,,360,308
2025,,394,163
2025,,467,416
2025,,376,279
2025,,424,134
2025,,179,311
2025,,369,156
2025,,373,326
2025,,302,225
2025,,334,413
2025,,459,408
2025,,500,365
2025,,395,326
2025,,430,352
2025,,361,314
2025,,344,302
2025,,382,373
2025,,300,126
2025,,370,290
2025,,388,320
2025,,345,244
2025,,461,352
2025,,119,163
2025,,388,352
2025,,446,185
2025,,369,373
2025,,360,84
2025,,462,427
2025,,238,132
2025,,365,386
2025,,369,257
2025,,322,175
2025,,249,197
2025,,215,24
2025,,488,464
2025,,143,109
2025,,293,404
2026,2026-01-02,173,266
2026,2026-01-05,366,242
2026,2026-01-06,349,387
2026,2026-01-07,500,384
2026,2026-01-08,286,191
2026,2026-01-09,465,389
2026,2026-01-12,349,215
2026,2026-01-13,312,306
2026,2026-01-14,449,286
2026,2026-01-16,460,424
2026,2026-01-17,353,191
2026,2026-01-19,299,416
2026,2026-01-20,468,279
2026,2026-01-21,417,357
2026,2026-01-22,276,178
2026,2026-01-23,357,252
2026,2026-01-26,298,156
2026,2026-01-27,428,381
2026,2026-01-28,281,212
2026,2026-01-29,257,277
2026,2026-01-30,288,115
2026,2026-02-02,273,227
2026,2026-02-03,447,190
2026,2026-02-04,369,251
2026,2026-02-05,285,307
2026,2026-02-06,253,106
2026,2026-02-09,405,500
2026,2026-02-10,354,383
2026,2026-02-11,247,172
2026,2026-02-12,387,316
2026,2026-02-13,342,240
2026,2026-02-16,276,173
2026,2026-02-17,292,267
2026,2026-02-18,500,346
2026,2026-02-19,366,246
2026,2026-02-20,349,333
2026,2026-02-23,290,374
2026,2026-02-24,424,300
2026,2026-02-25,257,173
2026,2026-02-26,402,338
2026,2026-02-27,150,145
2026,2026-03-02,305,305
2026,2026-03-03,500,474
2026,2026-03-04,372,191
2026,2026-03-05,365,273
2026,2026-03-06,341,182
2026,2026-03-09,372,254
2026,2026-03-10,234,245
2026,2026-03-11,406,333
2026,2026-03-12,500,304
2026,2026-03-13,365,232
2026,2026-03-16,432,355
2026,2026-03-17,398,306
2026,2026-03-18,254,129
2026,2026-03-19,491,376
2026,2026-03-20,348,369
2026,2026-03-23,500,424
2026,2026-03-24,276,203
2026,2026-03-25,297,165
2026,2026-03-26,185,131
2026,2026-03-27,373,276
2026,2026-03-30,381,422
2026,2026-03-31,323,89
2026,2026-04-08,281,443
2026,2026-04-09,449,318
2026,2026-04-10,467,358
2026,2026-04-13,345,314
2026,2026-04-14,390,245
2026,2026-04-15,403,292
2026,2026-04-16,496,370
2026,2026-04-17,326,398
2026,2026-04-19,303,254
2026,2026-04-20,323,348
2026,2026-04-21,368,304
2026,2026-04-22,460,251
2026,2026-04-23,350,167
2026,2026-04-24,347,147
2026,2026-04-27,380,340
2026,2026-04-28,365,399
2026,2026-04-29,482,353
2026,2026-04-30,283,242
2026,2026-04-03,272,178
2026,2026-05-04,346,158
`;
const HISTORICAL_ROUNDS = parseHistoricalRounds(HISTORICAL_ROUND_SOURCE);
const HISTORICAL_ROUND_DATES = new Set(
  HISTORICAL_ROUNDS.filter((round) => round.date).map((round) => round.date),
);

const firebase = window.goallessFirebase;
const savedPlayers = loadPlayers();
const state = {
  players: savedPlayers,
  draft: loadDraft(savedPlayers),
  rounds: [],
  loading: true,
  savingPlayer: null,
};

const roundForm = document.querySelector("#roundForm");
const roundDate = document.querySelector("#roundDate");
const roundCategory = document.querySelector("#roundCategory");
const playerForms = document.querySelector("#playerForms");
const leaderboard = document.querySelector("#leaderboard");
const historicalSummary = document.querySelector("#historicalSummary");
const seasonStats = document.querySelector("#seasonStats");
const trendLegend = document.querySelector("#trendLegend");
const trendChart = document.querySelector("#trendChart");
const gapChart = document.querySelector("#gapChart");
const trendInsights = document.querySelector("#trendInsights");
const historyList = document.querySelector("#historyList");
const roundCount = document.querySelector("#roundCount");
const saveMessage = document.querySelector("#saveMessage");
const appStatus = document.querySelector("#appStatus");
const clearFormButton = document.querySelector("#clearFormButton");
const playerTemplate = document.querySelector("#playerFormTemplate");

init();

async function init() {
  roundDate.value = state.draft?.date || getToday();
  roundCategory.value = state.draft?.category || "";
  renderPlayerForms();
  render();

  roundForm.addEventListener("input", persistDraft);
  roundDate.addEventListener("input", updateDateAvailability);
  roundDate.addEventListener("change", updateDateAvailability);
  roundForm.addEventListener("submit", (event) => {
    event.preventDefault();
    showMessage("Use the save button inside each player's card.");
  });
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

function parseHistoricalRounds(source) {
  const yearCounts = new Map();

  return source
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [yearValue, date, nicolaiValue, trymValue] = line.split(",");
      const year = Number(yearValue);
      const yearRound = (yearCounts.get(year) || 0) + 1;
      yearCounts.set(year, yearRound);

      return {
        id: `imported-${index + 1}`,
        source: "Excel import",
        year,
        date: date || null,
        label: date ? formatDate(date) : `${year} round ${yearRound}`,
        nicolai: parsePoints(nicolaiValue),
        trym: parsePoints(trymValue),
      };
    });
}

function normalizePlayers(players) {
  const cleanPlayers = Array.isArray(players)
    ? players.map((name) => canonicalizePlayerName(name)).filter(Boolean).slice(0, 2)
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
        name: canonicalizePlayerName(draftPlayer.name) || playerName,
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
    const saveButton = fragment.querySelector(".player-save-button");
    const draftPlayer = state.draft?.players?.[playerIndex];

    card.dataset.playerIndex = String(playerIndex);
    nameInput.value = draftPlayer?.name || playerName;
    saveButton.dataset.playerIndex = String(playerIndex);
    saveButton.textContent = `Save ${nameInput.value || playerName}`;
    nameInput.addEventListener("input", () => {
      state.players[playerIndex] =
        canonicalizePlayerName(nameInput.value) || DEFAULT_PLAYERS[playerIndex];
      saveButton.textContent = `Save ${state.players[playerIndex]}`;
      savePlayers();
      renderLeaderboard();
      updateDateAvailability();
    });

    for (let answerIndex = 0; answerIndex < ANSWERS_PER_PLAYER; answerIndex += 1) {
      answersList.appendChild(createAnswerRow(answerIndex, draftPlayer?.answers?.[answerIndex]));
    }

    total.textContent = String(calculateCardTotal(card));

    card.addEventListener("input", () => {
      total.textContent = String(calculateCardTotal(card));
    });
    saveButton.addEventListener("click", () => {
      handleSavePlayer(playerIndex);
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
    state.rounds = await fetchFirestoreRounds();
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

async function fetchFirestoreRounds() {
  const roundsQuery = firebase.query(
    firebase.collection(firebase.db, ROUNDS_COLLECTION),
    firebase.orderBy("date", "desc"),
  );
  const snapshot = await firebase.getDocs(roundsQuery);

  return snapshot.docs.map((roundDoc) =>
    normalizeRound({
      id: roundDoc.id,
      ...roundDoc.data(),
    }),
  );
}

async function savePlayerOnce(date, category, playerEntry) {
  const roundRef = firebase.doc(firebase.db, ROUNDS_COLLECTION, date);
  const savedAt = new Date().toISOString();
  let savedRound = null;

  await firebase.runTransaction(firebase.db, async (transaction) => {
    const existingRound = await transaction.get(roundRef);

    if (existingRound.exists()) {
      const currentData = existingRound.data();
      const currentPlayers = Array.isArray(currentData.players) ? currentData.players : [];
      const playerAlreadySaved = currentPlayers.some(
        (player) => canonicalizePlayerName(player.name) === playerEntry.name,
      );

      if (playerAlreadySaved) {
        throw new Error(DUPLICATE_PLAYER_ERROR);
      }

      savedRound = {
        ...currentData,
        id: date,
        date,
        category: currentData.category || category,
        players: [...currentPlayers, playerEntry],
        createdAt: currentData.createdAt || savedAt,
        updatedAt: savedAt,
      };
      transaction.update(roundRef, {
        category: savedRound.category,
        players: savedRound.players,
        createdAt: savedRound.createdAt,
        updatedAt: savedAt,
      });
      return;
    }

    savedRound = {
      id: date,
      date,
      category,
      players: [playerEntry],
      createdAt: savedAt,
      updatedAt: savedAt,
    };
    transaction.set(roundRef, {
      date,
      category,
      players: [playerEntry],
      createdAt: savedAt,
      updatedAt: savedAt,
    });
  });

  return normalizeRound(savedRound);
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

async function handleSavePlayer(playerIndex) {
  const selectedDate = roundDate.value || getToday();
  const existingDateRound = state.rounds.find((round) => round.date === selectedDate);
  const category = roundCategory.value.trim() || existingDateRound?.category || "";
  if (!category) {
    showMessage("Add a category before saving.");
    roundCategory.focus();
    return;
  }

  if (!firebase?.db || typeof firebase.runTransaction !== "function") {
    showMessage("Firebase is not ready.");
    return;
  }

  const card = document.querySelector(`.player-card[data-player-index="${playerIndex}"]`);
  if (!card) {
    return;
  }

  const playerEntry = getPlayerEntryFromCard(card, playerIndex);
  const existingEntry = getExistingPlayerEntryForDate(selectedDate, playerEntry.name);
  if (existingEntry) {
    showDuplicatePlayerMessage(selectedDate, playerEntry.name, existingEntry);
    return;
  }

  setSaving(playerEntry.name);
  showMessage(`Checking ${playerEntry.name}'s score...`);

  try {
    state.rounds = await fetchFirestoreRounds();
    sortRounds();

    const refreshedDateRound = state.rounds.find((round) => round.date === selectedDate);
    const savedCategory = category || refreshedDateRound?.category || "";
    const latestExistingEntry = getExistingPlayerEntryForDate(selectedDate, playerEntry.name);
    if (latestExistingEntry) {
      render();
      showDuplicatePlayerMessage(selectedDate, playerEntry.name, latestExistingEntry);
      return;
    }

    showMessage(`Saving ${playerEntry.name}'s score...`);
    const savedRound = await savePlayerOnce(selectedDate, savedCategory, playerEntry);

    state.players[playerIndex] = playerEntry.name;
    savePlayers();
    upsertRound(savedRound);
    sortRounds();
    clearPlayerInputs(playerIndex);
    persistDraft();
    render();
    showMessage(`${playerEntry.name}'s score saved.`);
  } catch (error) {
    if (error?.message === DUPLICATE_PLAYER_ERROR) {
      state.rounds = await fetchFirestoreRounds();
      sortRounds();
      render();
      showDuplicatePlayerMessage(selectedDate, playerEntry.name, { source: "Firestore" });
      return;
    }

    console.error("Unable to save player score.", error);
    showMessage(`Could not save ${playerEntry.name}'s score.`);
  } finally {
    setSaving(null);
  }
}

function getPlayerEntryFromCard(card, playerIndex) {
  const nameInput = card.querySelector(".player-name");
  const name = canonicalizePlayerName(nameInput.value) || DEFAULT_PLAYERS[playerIndex];
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
    savedAt: new Date().toISOString(),
  };
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

function clearPlayerInputs(playerIndex) {
  const card = document.querySelector(`.player-card[data-player-index="${playerIndex}"]`);
  if (!card) {
    return;
  }

  card.querySelectorAll(".answer-input, .points-input").forEach((input) => {
    input.value = "";
  });
  card.querySelector(".player-total strong").textContent = "0";
}

function upsertRound(round) {
  const existingIndex = state.rounds.findIndex((item) => item.id === round.id);

  if (existingIndex >= 0) {
    state.rounds[existingIndex] = round;
    return;
  }

  state.rounds.push(round);
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
  renderHistoricalStats();
  renderVisualisations();
  renderHistory();
  const trackedRounds = getHistoricalRoundCount() + state.rounds.length;
  roundCount.textContent = `${trackedRounds} tracked ${trackedRounds === 1 ? "round" : "rounds"}`;
  updateDateAvailability();
}

function renderLeaderboard() {
  const rows = buildLeaderboard();
  leaderboard.innerHTML = "";

  if (!rows.length) {
    leaderboard.innerHTML = '<div class="empty-state">Save a round to start the table.</div>';
    return;
  }

  rows.forEach((row, index) => {
    const rankLabel = index === 0 ? "1ST" : "2ND";
    const nextRow = rows[index + 1];
    const leaderCopy =
      index === 0
        ? nextRow
          ? `🏆 Leading by ${formatNumber(nextRow.total - row.total)} points`
          : "🏆 Current leader"
        : `👀 ${formatNumber(row.total - rows[0].total)} points behind`;
    const card = document.createElement("article");
    card.className = `leader-card ${index === 0 ? "is-first" : "is-second"}`;
    card.innerHTML = `
      <div class="rank">${rankLabel}</div>
      <div class="leader-title-row">
        <div>
          <p class="leader-kicker">${index === 0 ? "Current leader" : "Second place"}</p>
          <h3 class="leader-name">${escapeHtml(row.name)}</h3>
        </div>
        <div class="leader-badge">${leaderCopy}</div>
      </div>
      <div class="leader-stats">
        <div class="stat">
          <span>Total</span>
          <strong>${formatNumber(row.total)}</strong>
        </div>
        <div class="stat">
          <span>Wins</span>
          <strong>${row.wins}</strong>
        </div>
        <div class="stat">
          <span>Average</span>
          <strong>${formatAverage(row.average)}</strong>
        </div>
        <div class="stat">
          <span>Best streak</span>
          <strong>${row.longestStreak}</strong>
        </div>
        <div class="stat">
          <span>Current streak</span>
          <strong>${row.currentStreak}</strong>
        </div>
      </div>
    `;
    leaderboard.appendChild(card);
  });
}

function buildLeaderboard() {
  const table = new Map();
  const streakStats = getStreakStatsByPlayer(getVisualRounds());

  [...new Set([...state.players, ...getHistoricalPlayerNames()])].forEach((name) => {
    table.set(name, {
      name,
      total: 0,
      wins: 0,
      rounds: 0,
      average: 0,
    });
  });

  getHistoricalPlayerStats().forEach((historicalRow) => {
    const row = table.get(historicalRow.name) || {
      name: historicalRow.name,
      total: 0,
      wins: 0,
      rounds: 0,
      average: 0,
    };

    row.total += historicalRow.total;
    row.wins += historicalRow.wins;
    row.rounds += historicalRow.rounds;
    table.set(row.name, row);
  });

  getCompletedFirestoreRounds().forEach((round) => {
    const winnerName = getUniqueWinnerName(round.players);

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

      if (player.name === winnerName) {
        row.wins += 1;
      }
    });
  });

  return [...table.values()]
    .map((row) => ({
      ...row,
      average: row.rounds ? row.total / row.rounds : 0,
      longestStreak: streakStats[row.name]?.longest || 0,
      currentStreak: streakStats[row.name]?.current || 0,
    }))
    .sort((a, b) => a.total - b.total || b.wins - a.wins || a.name.localeCompare(b.name));
}

function renderHistoricalStats() {
  const importedRounds = getHistoricalRoundCount();
  const importedDraws = HISTORICAL_SEASONS.reduce((total, season) => total + season.draws, 0);
  const seasonSummaries = getSeasonSummaries();
  const completedFirestoreRounds = getCompletedFirestoreRounds().length;

  historicalSummary.innerHTML = `
    <div>
      <p class="eyebrow">Imported Excel record</p>
      <h3>Historical stats</h3>
    </div>
    <p>${importedRounds} imported rounds from 2025-2026, ${importedDraws} draw, plus ${completedFirestoreRounds} completed Firestore ${completedFirestoreRounds === 1 ? "round" : "rounds"}.</p>
  `;

  seasonStats.innerHTML = seasonSummaries
    .sort((a, b) => b.year - a.year)
    .map(renderSeasonCard)
    .join("");
}

function renderSeasonCard(season) {
  return `
    <article class="season-card">
      <div class="season-card-top">
        <div>
          <p class="eyebrow">Season breakdown</p>
          <h3>${season.year}</h3>
        </div>
        <div class="season-meta">
          <strong>${season.rounds}</strong>
          <span>${season.draws ? `${season.draws} draw` : "No draws"}</span>
        </div>
      </div>
      <div class="season-player-table">
        ${season.players
          .map((stats, index) => renderSeasonPlayer(stats, season.rounds, index))
          .join("")}
      </div>
    </article>
  `;
}

function renderSeasonPlayer(stats, seasonRounds, index) {
  return `
    <section class="season-player ${index === 0 ? "is-season-leader" : ""}">
      <div class="season-player-rank">${index + 1}</div>
      <div class="season-player-main">
        <h4>${escapeHtml(stats.name)}</h4>
        <span>${stats.wins} wins · ${formatPercent(stats.wins / seasonRounds)} win rate</span>
      </div>
      <div class="season-stat-grid">
        <div><span>Total</span><strong>${formatNumber(stats.total)}</strong></div>
        <div><span>Average</span><strong>${formatAverage(stats.average)}</strong></div>
        <div><span>Median</span><strong>${formatAverage(stats.median)}</strong></div>
        <div><span>Best score</span><strong>${stats.best}</strong><small>${escapeHtml(stats.bestLabel)}</small></div>
        <div><span>Worst score</span><strong>${stats.worst}</strong><small>${escapeHtml(stats.worstLabel)}</small></div>
        <div><span>Best streak</span><strong>${stats.longestStreak}</strong></div>
        <div><span>Current streak</span><strong>${stats.currentStreak}</strong></div>
      </div>
    </section>
  `;
}

function renderVisualisations() {
  const rounds = getVisualRounds();

  if (rounds.length < 2) {
    trendLegend.innerHTML = "";
    trendChart.innerHTML = '<div class="empty-state">Add more rounds to draw trends.</div>';
    gapChart.innerHTML = '<div class="empty-state">Add more rounds to draw the score gap.</div>';
    trendInsights.innerHTML = '<div class="empty-state">Recent form appears after 20 rounds.</div>';
    return;
  }

  trendLegend.innerHTML = Object.entries(getPlayerColors())
    .map(
      ([name, color]) => `
        <span class="legend-item">
          <span style="background:${color}"></span>
          ${escapeHtml(name)}
        </span>
      `,
    )
    .join("");

  trendChart.innerHTML = renderRollingAverageChart(rounds);
  gapChart.innerHTML = renderScoreGapChart(rounds);
  trendInsights.innerHTML = renderTrendInsights(rounds);
}

function getVisualRounds() {
  const importedRounds = [
    ...HISTORICAL_ROUNDS.filter((round) => !round.date),
    ...HISTORICAL_ROUNDS.filter((round) => round.date).sort((a, b) =>
      String(a.date).localeCompare(String(b.date)),
    ),
  ].map((round, index) => ({
    id: round.id,
    source: round.source,
    year: round.year,
    label: round.label,
    date: round.date,
    order: index,
    scores: {
      Nicolai: round.nicolai,
      Trym: round.trym,
    },
  }));

  const usedDates = new Set(importedRounds.map((round) => round.date).filter(Boolean));
  const firestoreRounds = state.rounds
    .filter((round) => isRoundComplete(round) && round.date && !usedDates.has(round.date))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .map((round, index) => ({
      id: `firestore-${round.id}`,
      source: "Firestore",
      year: Number(round.date.slice(0, 4)),
      label: formatDate(round.date),
      date: round.date,
      order: importedRounds.length + index,
      scores: getRoundScoreMap(round),
    }))
    .filter((round) => Number.isFinite(round.scores.Nicolai) && Number.isFinite(round.scores.Trym));

  return [...importedRounds, ...firestoreRounds];
}

function getRoundScoreMap(round) {
  return round.players.reduce(
    (scores, player) => {
      const playerName = canonicalizePlayerName(player.name);
      if (playerName === "Nicolai" || playerName === "Trym") {
        scores[playerName] = player.total;
      }

      return scores;
    },
    {
      Nicolai: null,
      Trym: null,
    },
  );
}

function getSeasonSummaries() {
  const seasons = new Map();

  getVisualRounds().forEach((round) => {
    if (!seasons.has(round.year)) {
      seasons.set(round.year, []);
    }

    seasons.get(round.year).push(round);
  });

  return [...seasons.entries()].map(([year, rounds]) => {
    const streaks = getStreakStatsByPlayer(rounds);
    const draws = rounds.filter((round) => getWinnerFromScores(round.scores) === null).length;
    const players = Object.keys(getPlayerColors())
      .map((name) => {
        const scores = rounds.map((round) => round.scores[name]);
        const best = Math.min(...scores);
        const worst = Math.max(...scores);
        const bestRound = rounds.find((round) => round.scores[name] === best);
        const worstRound = rounds.find((round) => round.scores[name] === worst);

        return {
          name,
          total: scores.reduce((total, score) => total + score, 0),
          wins: rounds.filter((round) => getWinnerFromScores(round.scores) === name).length,
          average: average(scores),
          median: median(scores),
          best,
          bestLabel: bestRound?.label || "",
          worst,
          worstLabel: worstRound?.label || "",
          longestStreak: streaks[name]?.longest || 0,
          currentStreak: streaks[name]?.current || 0,
        };
      })
      .sort((a, b) => a.total - b.total || b.wins - a.wins);

    return {
      year,
      rounds: rounds.length,
      draws,
      players,
    };
  });
}

function getStreakStatsByPlayer(rounds) {
  const players = Object.keys(getPlayerColors());
  const streaks = Object.fromEntries(
    players.map((name) => [
      name,
      {
        longest: 0,
        current: 0,
      },
    ]),
  );

  rounds.forEach((round) => {
    const winner = getWinnerFromScores(round.scores);

    players.forEach((name) => {
      if (winner === name) {
        streaks[name].current += 1;
        streaks[name].longest = Math.max(streaks[name].longest, streaks[name].current);
        return;
      }

      streaks[name].current = 0;
    });
  });

  return streaks;
}

function getWinnerFromScores(scores) {
  if (!Number.isFinite(scores.Trym) || !Number.isFinite(scores.Nicolai)) {
    return null;
  }

  if (scores.Trym < scores.Nicolai) {
    return "Trym";
  }

  if (scores.Nicolai < scores.Trym) {
    return "Nicolai";
  }

  return null;
}

function renderRollingAverageChart(rounds) {
  const colors = getPlayerColors();
  const windowSize = 10;
  const series = Object.keys(colors).map((name) => ({
    name,
    color: colors[name],
    points: getRollingAveragePoints(rounds, name, windowSize),
  }));
  const values = series.flatMap((item) => item.points.map((point) => point.value));

  return renderLineChart({
    className: "trend-svg",
    height: 340,
    maxX: rounds.length - 1,
    values,
    xLabels: getChartXLabels(rounds),
    yLabel: "Avg score",
    series,
    trendSeries: series.map((item) => ({
      name: item.name,
      color: item.color,
      points: getTrendLine(item.points),
    })),
  });
}

function renderScoreGapChart(rounds) {
  const points = getRollingGapPoints(rounds, 10);
  const maxAbs = Math.max(40, ...points.map((point) => Math.abs(point.value)));

  return renderLineChart({
    className: "gap-svg",
    height: 260,
    maxX: rounds.length - 1,
    minY: -maxAbs,
    maxY: maxAbs,
    values: [-maxAbs, maxAbs],
    xLabels: getChartXLabels(rounds),
    yLabel: "Trym - Nicolai",
    zeroLine: true,
    series: [
      {
        name: "Score gap",
        color: "#f0c040",
        points,
      },
    ],
  });
}

function renderLineChart({
  className,
  height,
  maxX,
  values,
  xLabels,
  yLabel,
  series,
  trendSeries = [],
  minY = null,
  maxY = null,
  zeroLine = false,
}) {
  const width = 920;
  const padding = {
    top: 26,
    right: 28,
    bottom: 48,
    left: 58,
  };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const yMin = minY ?? roundDown(Math.min(...values), 25);
  const yMax = maxY ?? roundUp(Math.max(...values), 25);
  const yRange = yMax - yMin || 1;
  const xRange = maxX || 1;
  const yTicks = getYAxisTicks(yMin, yMax, zeroLine ? 5 : 4);

  const xScale = (x) => padding.left + (x / xRange) * plotWidth;
  const yScale = (value) => padding.top + ((value - yMin) / yRange) * plotHeight;

  const gridLines = yTicks
    .map(
      (tick) => `
        <line class="chart-grid-line" x1="${padding.left}" x2="${width - padding.right}" y1="${yScale(tick)}" y2="${yScale(tick)}"></line>
        <text class="chart-axis-text" x="${padding.left - 10}" y="${yScale(tick) + 4}" text-anchor="end">${formatAverage(tick)}</text>
      `,
    )
    .join("");
  const xAxisLabels = xLabels
    .map(
      (label) => `
        <text class="chart-axis-text" x="${xScale(label.index)}" y="${height - 15}" text-anchor="${label.anchor}">${escapeHtml(label.text)}</text>
      `,
    )
    .join("");
  const zero = zeroLine
    ? `<line class="chart-zero-line" x1="${padding.left}" x2="${width - padding.right}" y1="${yScale(0)}" y2="${yScale(0)}"></line>`
    : "";
  const linePaths = series
    .map(
      (item) => `
        <path class="chart-line" d="${getSvgPath(item.points, xScale, yScale)}" stroke="${item.color}"></path>
      `,
    )
    .join("");
  const trendPaths = trendSeries
    .filter((item) => item.points.length)
    .map(
      (item) => `
        <path class="chart-line chart-line-trend" d="${getSvgPath(item.points, xScale, yScale)}" stroke="${item.color}"></path>
      `,
    )
    .join("");

  return `
    <svg class="${className}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(yLabel)} trend chart">
      <rect class="chart-plot-bg" x="${padding.left}" y="${padding.top}" width="${plotWidth}" height="${plotHeight}" rx="6"></rect>
      ${gridLines}
      ${zero}
      ${trendPaths}
      ${linePaths}
      ${xAxisLabels}
      <text class="chart-axis-title" x="14" y="${padding.top + 10}" transform="rotate(-90 14 ${padding.top + 10})">${escapeHtml(yLabel)}</text>
    </svg>
  `;
}

function renderTrendInsights(rounds) {
  const players = Object.keys(getPlayerColors());

  return players
    .map((name) => {
      const scores = rounds.map((round) => round.scores[name]);
      const recent = scores.slice(-10);
      const previous = scores.slice(-20, -10);
      const recentAverage = average(recent);
      const previousAverage = average(previous);
      const change = previous.length ? previousAverage - recentAverage : 0;
      const trendClass = change >= 0 ? "is-good" : "is-bad";

      return `
        <section class="insight-card ${trendClass}">
          <div>
            <p class="eyebrow">${escapeHtml(name)}</p>
            <h4>${formatAverage(recentAverage)}</h4>
          </div>
          <div>
            <span>Last 10 avg</span>
            <strong>${change >= 0 ? "Improved" : "Worse"} ${formatAverage(Math.abs(change))}</strong>
          </div>
        </section>
      `;
    })
    .join("");
}

function getRollingAveragePoints(rounds, playerName, windowSize) {
  return rounds.map((round, index) => {
    const window = rounds
      .slice(Math.max(0, index - windowSize + 1), index + 1)
      .map((item) => item.scores[playerName]);

    return {
      index,
      label: round.label,
      value: average(window),
    };
  });
}

function getRollingGapPoints(rounds, windowSize) {
  return rounds.map((round, index) => {
    const window = rounds.slice(Math.max(0, index - windowSize + 1), index + 1);

    return {
      index,
      label: round.label,
      value: average(window.map((item) => item.scores.Trym - item.scores.Nicolai)),
    };
  });
}

function getTrendLine(points) {
  if (points.length < 2) {
    return [];
  }

  const n = points.length;
  const sumX = points.reduce((total, point) => total + point.index, 0);
  const sumY = points.reduce((total, point) => total + point.value, 0);
  const sumXY = points.reduce((total, point) => total + point.index * point.value, 0);
  const sumXX = points.reduce((total, point) => total + point.index * point.index, 0);
  const denominator = n * sumXX - sumX * sumX;

  if (!denominator) {
    return [];
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;
  const first = points[0].index;
  const last = points[points.length - 1].index;

  return [
    {
      index: first,
      value: slope * first + intercept,
    },
    {
      index: last,
      value: slope * last + intercept,
    },
  ];
}

function getSvgPath(points, xScale, yScale) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${xScale(point.index).toFixed(2)} ${yScale(point.value).toFixed(2)}`)
    .join(" ");
}

function getChartXLabels(rounds) {
  const lastIndex = rounds.length - 1;
  const middleIndex = Math.round(lastIndex / 2);

  return [
    {
      index: 0,
      text: rounds[0].label,
      anchor: "start",
    },
    {
      index: middleIndex,
      text: rounds[middleIndex].label,
      anchor: "middle",
    },
    {
      index: lastIndex,
      text: rounds[lastIndex].label,
      anchor: "end",
    },
  ];
}

function getPlayerColors() {
  return {
    Trym: "#f0c040",
    Nicolai: "#64d2ff",
  };
}

function renderHistory() {
  historyList.innerHTML = "";

  if (state.loading) {
    historyList.innerHTML = '<div class="empty-state">Fetching Firestore rounds...</div>';
    return;
  }

  if (!state.rounds.length) {
    historyList.innerHTML = '<div class="empty-state">No new Firestore rounds saved yet. Imported Excel stats are shown above.</div>';
    return;
  }

  state.rounds.forEach((round) => {
    const winnerName = getUniqueWinnerName(round.players);
    const isComplete = isRoundComplete(round);
    const card = document.createElement("article");
    card.className = "history-card";
    card.innerHTML = `
      <div class="history-top">
        <div>
          <p class="round-date">${formatDate(round.date)}</p>
          <h3 class="round-category">${escapeHtml(round.category)}</h3>
        </div>
        <div class="history-actions">
          <span class="submission-badge">${round.players.length}/2 saved</span>
          <button class="delete-button" type="button" data-delete-round="${round.id}">Delete</button>
        </div>
      </div>
      ${
        isComplete
          ? `<div class="history-players">
              ${round.players
                .map((player) => renderHistoryPlayer(player, player.name === winnerName))
                .join("")}
            </div>`
          : renderPrivateRoundState(round)
      }
    `;
    historyList.appendChild(card);
  });
}

function renderPrivateRoundState(round) {
  const missingPlayers = state.players.filter(
    (playerName) => !round.players.some((player) => player.name === playerName),
  );

  return `
    <div class="private-round-state">
      <div>
        <p class="eyebrow">Scores hidden</p>
        <h3>Waiting for ${escapeHtml(missingPlayers.join(" and ") || "the other player")}</h3>
      </div>
      <p>Answers and points unlock when both players have saved their score for this date.</p>
    </div>
  `;
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
        name: canonicalizePlayerName(player.name) || DEFAULT_PLAYERS[playerIndex],
        answers: normalizedAnswers,
        total: Number.isFinite(Number(player.total))
          ? Number(player.total)
          : sumAnswers(normalizedAnswers),
      };
    }),
  };
}

function getHistoricalPlayerNames() {
  return [
    ...new Set(
      HISTORICAL_SEASONS.flatMap((season) => Object.keys(season.players)),
    ),
  ];
}

function getHistoricalRoundCount() {
  return HISTORICAL_SEASONS.reduce((total, season) => total + season.rounds, 0);
}

function getHistoricalPlayerStats() {
  const table = new Map();

  HISTORICAL_SEASONS.forEach((season) => {
    Object.entries(season.players).forEach(([name, stats]) => {
      const row = table.get(name) || {
        name,
        total: 0,
        wins: 0,
        rounds: 0,
      };

      row.total += stats.total;
      row.wins += stats.wins;
      row.rounds += season.rounds;
      table.set(name, row);
    });
  });

  return [...table.values()];
}

function getUniqueWinnerName(players) {
  if (players.length < 2) {
    return null;
  }

  const lowestTotal = Math.min(...players.map((player) => player.total));
  const winners = players.filter((player) => player.total === lowestTotal);

  return winners.length === 1 ? winners[0].name : null;
}

function isRoundComplete(round) {
  const submittedPlayers = new Set(round.players.map((player) => player.name));
  return DEFAULT_PLAYERS.every((playerName) => submittedPlayers.has(playerName));
}

function getCompletedFirestoreRounds() {
  return state.rounds.filter(isRoundComplete);
}

function getExistingPlayerEntryForDate(date, playerName) {
  if (HISTORICAL_ROUND_DATES.has(date)) {
    return {
      source: "imported Excel history",
    };
  }

  const firestoreRound = state.rounds.find((round) => round.date === date);
  const firestorePlayer = firestoreRound?.players.find(
    (player) => canonicalizePlayerName(player.name) === playerName,
  );

  if (firestorePlayer) {
    return {
      source: "Firestore",
      round: firestoreRound,
      player: firestorePlayer,
    };
  }

  return null;
}

function updateDateAvailability() {
  const selectedDate = roundDate.value || getToday();
  const buttons = document.querySelectorAll(".player-save-button");
  const existingDateRound = state.rounds.find((round) => round.date === selectedDate);
  let blockedPlayers = 0;

  if (existingDateRound?.category && !roundCategory.value.trim()) {
    roundCategory.value = existingDateRound.category;
    persistDraft();
  }

  buttons.forEach((button) => {
    const card = button.closest(".player-card");
    const playerIndex = Number(card?.dataset.playerIndex || 0);
    const playerName =
      canonicalizePlayerName(card?.querySelector(".player-name")?.value) ||
      DEFAULT_PLAYERS[playerIndex];
    const existingEntry = getExistingPlayerEntryForDate(selectedDate, playerName);
    const isSavingThisPlayer = state.savingPlayer === playerName;
    const isSavingAnotherPlayer = Boolean(state.savingPlayer) && !isSavingThisPlayer;

    if (existingEntry) {
      clearPlayerInputs(playerIndex);
    }
    card.classList.toggle("is-submitted", Boolean(existingEntry));
    card.querySelectorAll(".answer-input, .points-input").forEach((input) => {
      input.disabled = Boolean(existingEntry);
    });
    button.disabled = isSavingAnotherPlayer || isSavingThisPlayer || Boolean(existingEntry);
    button.textContent = isSavingThisPlayer ? "Saving..." : `Save ${playerName}`;
    button.title = existingEntry
      ? `${playerName} already has a score for ${formatDate(selectedDate)}.`
      : "";

    if (existingEntry) {
      blockedPlayers += 1;
    }
  });

  const dateIsImported = HISTORICAL_ROUND_DATES.has(selectedDate);
  if (dateIsImported) {
    showMessage(`${formatDate(selectedDate)} is already in the imported Excel history.`, {
      kind: "date",
      persist: true,
    });
    return;
  }

  if (buttons.length && blockedPlayers === buttons.length) {
    showMessage(`${formatDate(selectedDate)} already has both scores saved.`, {
      kind: "date",
      persist: true,
    });
    return;
  }

  if (saveMessage.dataset.kind === "date") {
    showMessage("");
  }
}

function showDuplicatePlayerMessage(date, playerName, existingEntry) {
  showMessage(
    `${playerName} already has a score for ${formatDate(date)} from ${existingEntry.source}.`,
    {
      kind: "date",
      persist: true,
    },
  );
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

function average(values) {
  const cleanValues = values.filter((value) => Number.isFinite(value));
  return cleanValues.reduce((total, value) => total + value, 0) / cleanValues.length || 0;
}

function median(values) {
  const cleanValues = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  const middle = Math.floor(cleanValues.length / 2);

  if (!cleanValues.length) {
    return 0;
  }

  return cleanValues.length % 2
    ? cleanValues[middle]
    : (cleanValues[middle - 1] + cleanValues[middle]) / 2;
}

function roundDown(value, size) {
  return Math.floor(value / size) * size;
}

function roundUp(value, size) {
  return Math.ceil(value / size) * size;
}

function getYAxisTicks(min, max, count) {
  const step = (max - min) / Math.max(1, count - 1);

  return Array.from({ length: count }, (_, index) => min + step * index);
}

function canonicalizePlayerName(name) {
  const cleanName = String(name || "").trim();
  return cleanName.toLowerCase() === "friend" ? "Nicolai" : cleanName;
}

function setSaving(playerName) {
  state.savingPlayer = playerName;
  updateDateAvailability();
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

function formatNumber(value) {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
}

function formatSignedPercent(value) {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 1,
    signDisplay: "always",
    style: "percent",
  });
}

function formatPercent(value) {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 1,
    style: "percent",
  });
}

function showMessage(message, options = {}) {
  window.clearTimeout(showMessage.timeout);
  saveMessage.textContent = message;
  saveMessage.dataset.kind = options.kind || "";

  if (!message || options.persist) {
    return;
  }

  showMessage.timeout = window.setTimeout(() => {
    saveMessage.textContent = "";
    saveMessage.dataset.kind = "";
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
