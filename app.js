const ROUNDS_COLLECTION = "rounds";
const MAIL_COLLECTION = "mail";
const PLAYER_STORAGE_KEY = "goalless_player_names";
const PLAYER_EMAIL_STORAGE_KEY = "goalless_player_emails";
const DRAFT_STORAGE_KEY = "goalless_draft";
const LEGACY_STORAGE_KEY = "goalless_rounds";
const DEFAULT_PLAYERS = ["Trym", "Nicolai"];
const ANSWERS_PER_PLAYER = 5;
const DUPLICATE_PLAYER_ERROR = "duplicate-player";
const TESSERACT_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
const OCR_LANGUAGE = "eng";
const OCR_WRONG_PATTERN = /\b(wrong|incorrect|invalid|missed|not found|no answer)\b/i;
const SCORE_SCREENSHOT_SCALE = 4;
const SCORE_SCREENSHOT_TEXT_PADDING = 18;
const SCORE_SCREENSHOT_ANSWER_COLUMN_RATIO = 0.82;
const SCORE_SCREENSHOT_SCORE_COLUMN_RATIO = 0.65;
const SCORE_SCREENSHOT_MAX_BYTES = 8 * 1024 * 1024;
const SCORE_SCREENSHOT_MAX_DIMENSION = 2400;
const SCORE_SCREENSHOT_MAX_PIXELS = 4_000_000;
const SCORE_SCREENSHOT_HARD_MAX_PIXELS = 24_000_000;
let tesseractLoadPromise = null;
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
  playerEmails: loadPlayerEmails(savedPlayers),
  draft: loadDraft(savedPlayers),
  rounds: [],
  loading: true,
  savingPlayer: null,
  importingPlayerIndex: null,
  categoryDate: null,
  statsPeriod: "all",
};

const roundForm = document.querySelector("#roundForm");
const roundDate = document.querySelector("#roundDate");
const roundCategory = document.querySelector("#roundCategory");
const playerForms = document.querySelector("#playerForms");
const todayRound = document.querySelector("#todayRound");
const leaderboard = document.querySelector("#leaderboard");
const historicalSummary = document.querySelector("#historicalSummary");
const seasonStats = document.querySelector("#seasonStats");
const trendLegend = document.querySelector("#trendLegend");
const trendChart = document.querySelector("#trendChart");
const marginChart = document.querySelector("#marginChart");
const trendInsights = document.querySelector("#trendInsights");
const statsPeriodDock = document.querySelector("#statsPeriodDock");
const statsSummary = document.querySelector("#statsSummary");
const statsBreakdown = document.querySelector("#statsBreakdown");
const statsRecords = document.querySelector("#statsRecords");
const statsRecordsLabel = document.querySelector("#statsRecordsLabel");
const historyList = document.querySelector("#historyList");
const roundCount = document.querySelector("#roundCount");
const saveMessage = document.querySelector("#saveMessage");
const appStatus = document.querySelector("#appStatus");
const clearFormButton = document.querySelector("#clearFormButton");
const playerTemplate = document.querySelector("#playerFormTemplate");
const pageTitle = document.querySelector("#pageTitle");
const sidebarRoundCount = document.querySelector("#sidebarRoundCount");
const navButtons = [...document.querySelectorAll("[data-view]")];
const viewPanels = [...document.querySelectorAll("[data-view-panel]")];
const VIEW_TITLES = {
  dashboard: "Dashboard",
  "new-round": "New round",
  trends: "Stats",
  history: "Round history",
};
let seasonSlideshowTimer = null;

init();

async function init() {
  initNavigation();
  const initialDate = getInitialRoundDate();
  resetDraftForDateIfNeeded(initialDate);
  roundDate.value = initialDate;
  roundCategory.value = getDraftCategoryForDate(roundDate.value);
  state.categoryDate = roundDate.value;
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
  statsPeriodDock?.addEventListener("click", handleStatsPeriodClick);

  if (!firebase?.db) {
    state.loading = false;
    state.rounds = loadLegacyRounds();
    sortRounds();
    showStatus(
      state.rounds.length
        ? "Firebase did not initialize. Showing local rounds only."
        : "Firebase did not initialize.",
      true,
    );
    render();
    return;
  }

  await loadRounds();
}

function initNavigation() {
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view;
      if (!VIEW_TITLES[view]) {
        return;
      }

      window.history.pushState(null, "", `#${view}`);
      setActiveView(view);
    });
  });

  window.addEventListener("popstate", () => {
    setActiveView(getViewFromHash());
  });
  window.addEventListener("hashchange", () => {
    setActiveView(getViewFromHash());
  });
  setActiveView(getViewFromHash());
}

function getViewFromHash() {
  const view = window.location.hash.replace("#", "");
  return VIEW_TITLES[view] ? view : "dashboard";
}

function setActiveView(view) {
  const activeView = VIEW_TITLES[view] ? view : "dashboard";

  navButtons.forEach((button) => {
    const isActive = button.dataset.view === activeView;
    button.classList.toggle("is-active", isActive);
    if (isActive) {
      button.setAttribute("aria-current", "page");
      if (window.matchMedia("(max-width: 980px)").matches) {
        button.scrollIntoView({ block: "nearest", inline: "center" });
      }
    } else {
      button.removeAttribute("aria-current");
    }
  });

  viewPanels.forEach((panel) => {
    const isActive = panel.dataset.viewPanel === activeView;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });

  if (pageTitle) {
    pageTitle.textContent = VIEW_TITLES[activeView];
  }
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

function loadPlayerEmails(players) {
  const saved = readJson(PLAYER_EMAIL_STORAGE_KEY);
  const playerEmails = {};

  players.forEach((playerName) => {
    playerEmails[playerName] = typeof saved?.[playerName] === "string" ? saved[playerName] : "";
  });

  return playerEmails;
}

function savePlayerEmails() {
  localStorage.setItem(PLAYER_EMAIL_STORAGE_KEY, JSON.stringify(state.playerEmails));
}

function loadDraft(players) {
  const saved = readJson(DRAFT_STORAGE_KEY);
  return normalizeDraft(saved, players);
}

function getInitialRoundDate() {
  return getToday();
}

function resetDraftForDateIfNeeded(date) {
  if (!state.draft || normalizeDateValue(state.draft.date) === date) {
    return;
  }

  const categories =
    state.draft.categories && typeof state.draft.categories === "object"
      ? state.draft.categories
      : {};

  state.draft = normalizeDraft(
    {
      date,
      categories,
      players: state.players.map((playerName, playerIndex) => ({
        name: state.draft?.players?.[playerIndex]?.name || playerName,
      })),
    },
    state.players,
  );
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(state.draft));
}

function normalizeDateValue(value) {
  const date = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "";
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

  const date = String(draft.date || getToday());
  const categories = {};
  const savedCategories =
    draft.categories && typeof draft.categories === "object" ? draft.categories : {};

  Object.entries(savedCategories).forEach(([categoryDate, category]) => {
    const cleanDate = String(categoryDate || "").trim();
    const cleanCategory = String(category || "").trim();

    if (cleanDate && cleanCategory) {
      categories[cleanDate] = cleanCategory;
    }
  });

  const legacyCategory = String(draft.category || "").trim();
  if (legacyCategory && !categories[date]) {
    categories[date] = legacyCategory;
  }

  const draftPlayers = Array.isArray(draft.players) ? draft.players : [];

  return {
    date,
    category: categories[date] || "",
    categories,
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
            wrong: Boolean(savedAnswer.wrong),
            perfect: Boolean(savedAnswer.perfect),
          };
        }),
        screenshotTotal: Number.isFinite(Number(draftPlayer.screenshotTotal))
          ? Number(draftPlayer.screenshotTotal)
          : null,
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
    const emailInput = fragment.querySelector(".player-email");
    const total = fragment.querySelector(".player-total strong");
    const answersList = fragment.querySelector(".answers-list");
    const saveButton = fragment.querySelector(".player-save-button");
    const screenshotInput = fragment.querySelector(".screenshot-input");
    const screenshotButton = fragment.querySelector(".screenshot-pick-button");
    const screenshotDropzone = fragment.querySelector(".screenshot-dropzone");
    const draftPlayer = state.draft?.players?.[playerIndex];
    const initialPlayerName = canonicalizePlayerName(draftPlayer?.name) || playerName;

    card.dataset.playerIndex = String(playerIndex);
    nameInput.value = initialPlayerName;
    emailInput.value = state.playerEmails[initialPlayerName] || "";
    saveButton.dataset.playerIndex = String(playerIndex);
    saveButton.textContent = `Save ${initialPlayerName}`;
    nameInput.addEventListener("input", () => {
      const previousName = state.players[playerIndex];
      const nextName = canonicalizePlayerName(nameInput.value) || DEFAULT_PLAYERS[playerIndex];

      if (previousName !== nextName && state.playerEmails[previousName] && !state.playerEmails[nextName]) {
        state.playerEmails[nextName] = state.playerEmails[previousName];
        emailInput.value = state.playerEmails[nextName];
      }

      state.players[playerIndex] = nextName;
      saveButton.textContent = `Save ${nextName}`;
      savePlayers();
      savePlayerEmails();
      renderLeaderboard();
      updateDateAvailability();
    });
    emailInput.addEventListener("input", () => {
      const playerName = canonicalizePlayerName(nameInput.value) || DEFAULT_PLAYERS[playerIndex];
      state.playerEmails[playerName] = emailInput.value.trim();
      savePlayerEmails();
    });

    for (let answerIndex = 0; answerIndex < ANSWERS_PER_PLAYER; answerIndex += 1) {
      answersList.appendChild(createAnswerRow(answerIndex, draftPlayer?.answers?.[answerIndex]));
    }

    if (Number.isFinite(Number(draftPlayer?.screenshotTotal))) {
      card.dataset.screenshotTotal = String(Number(draftPlayer.screenshotTotal));
    }

    total.textContent = String(calculateCardTotal(card));

    card.addEventListener("input", (event) => {
      if (event.target.classList.contains("points-input")) {
        clearScreenshotTotalOverride(card);
        clearPerfectAnswerState(event.target.closest(".answer-row"));
      }
      updatePlayerCardTotal(card);
    });
    saveButton.addEventListener("click", () => {
      handleSavePlayer(playerIndex);
    });
    wireScreenshotImport({
      card,
      playerIndex,
      screenshotInput,
      screenshotButton,
      screenshotDropzone,
    });

    playerForms.appendChild(fragment);
  });
}

function createAnswerRow(answerIndex, savedAnswer = null) {
  const row = document.createElement("div");
  row.className = "answer-row";
  row.dataset.answerNumber = String(answerIndex + 1);

  const answerInput = document.createElement("input");
  answerInput.type = "text";
  answerInput.placeholder = `Answer ${answerIndex + 1}`;
  answerInput.autocomplete = "off";
  answerInput.className = "answer-input";
  answerInput.setAttribute("aria-label", `Answer ${answerIndex + 1}`);
  answerInput.value = savedAnswer?.answer || "";

  const statusButton = document.createElement("button");
  statusButton.type = "button";
  statusButton.className = "answer-status-toggle";
  statusButton.addEventListener("click", () => {
    clearScreenshotTotalOverride(row.closest(".player-card"));
    setAnswerWrongState(row, !isAnswerWrong(row));
    updatePlayerCardTotal(row.closest(".player-card"));
    persistDraft();
  });

  const pointsInput = document.createElement("input");
  pointsInput.type = "number";
  pointsInput.placeholder = "Pts";
  pointsInput.min = "0";
  pointsInput.step = "1";
  pointsInput.inputMode = "numeric";
  pointsInput.className = "points-input";
  pointsInput.setAttribute("aria-label", `Points for answer ${answerIndex + 1}`);
  pointsInput.value = savedAnswer?.points || "";

  row.append(answerInput, statusButton, pointsInput);
  setAnswerWrongState(row, Boolean(savedAnswer?.wrong), { initial: true });
  if (savedAnswer?.perfect && !savedAnswer?.wrong) {
    row.dataset.perfect = "true";
    row.classList.add("is-perfect");
  }
  return row;
}

function wireScreenshotImport({
  card,
  playerIndex,
  screenshotInput,
  screenshotButton,
  screenshotDropzone,
}) {
  if (!card || !screenshotInput || !screenshotButton || !screenshotDropzone) {
    return;
  }

  screenshotButton.addEventListener("click", () => {
    if (!isScreenshotImportDisabled(card)) {
      screenshotInput.click();
    }
  });

  screenshotDropzone.addEventListener("click", () => {
    if (!isScreenshotImportDisabled(card)) {
      screenshotInput.click();
    }
  });

  screenshotInput.addEventListener("change", () => {
    handleScreenshotFile(screenshotInput.files?.[0], playerIndex, card);
  });

  screenshotDropzone.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    if (!isScreenshotImportDisabled(card)) {
      screenshotInput.click();
    }
  });

  screenshotDropzone.addEventListener("paste", (event) => {
    const file = getImageFileFromDataTransfer(event.clipboardData);
    if (!file || isScreenshotImportDisabled(card)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    handleScreenshotFile(file, playerIndex, card);
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    screenshotDropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      if (!isScreenshotImportDisabled(card)) {
        screenshotDropzone.classList.add("is-dragging");
      }
    });
  });

  screenshotDropzone.addEventListener("dragleave", () => {
    screenshotDropzone.classList.remove("is-dragging");
  });

  screenshotDropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    screenshotDropzone.classList.remove("is-dragging");

    const file = getImageFileFromDataTransfer(event.dataTransfer);
    if (file && !isScreenshotImportDisabled(card)) {
      handleScreenshotFile(file, playerIndex, card);
    }
  });

  card.addEventListener("paste", (event) => {
    const file = getImageFileFromDataTransfer(event.clipboardData);
    if (!file || isScreenshotImportDisabled(card)) {
      return;
    }

    event.preventDefault();
    handleScreenshotFile(file, playerIndex, card);
  });
}

async function handleScreenshotFile(file, playerIndex, card) {
  if (!file || !card) {
    return;
  }

  const screenshotInput = card.querySelector(".screenshot-input");
  if (!file.type.startsWith("image/")) {
    setScreenshotStatus(card, "Choose an image file.", true);
    if (screenshotInput) {
      screenshotInput.value = "";
    }
    return;
  }

  if (file.size > SCORE_SCREENSHOT_MAX_BYTES) {
    setScreenshotStatus(card, "Screenshot is too large. Crop it or choose an image under 8 MB.", true);
    if (screenshotInput) {
      screenshotInput.value = "";
    }
    return;
  }

  const playerName =
    canonicalizePlayerName(card.querySelector(".player-name")?.value) ||
    DEFAULT_PLAYERS[playerIndex];

  if (isScreenshotImportDisabled(card) && state.importingPlayerIndex !== playerIndex) {
    return;
  }

  state.importingPlayerIndex = playerIndex;
  setScreenshotBusy(card, true);
  setScreenshotStatus(card, "Loading OCR...");
  updateDateAvailability();

  try {
    const parsed = await readScoreScreenshot(file, playerName, card);

    if (!parsed.answers.length) {
      setScreenshotStatus(card, "No answers found. Try a tighter crop.", true);
      return;
    }

    const importedCount = applyScreenshotAnswersToCard(card, parsed.answers);
    if (Number.isFinite(parsed.total)) {
      card.dataset.screenshotTotal = String(parsed.total);
    } else {
      clearScreenshotTotalOverride(card);
    }
    persistDraft();
    updatePlayerCardTotal(card);
    setScreenshotStatus(
      card,
      `Imported ${importedCount} ${importedCount === 1 ? "answer" : "answers"}. Review before saving.`,
    );
    showMessage(`Imported ${playerName}'s screenshot. Review before saving.`);
  } catch (error) {
    console.error("Unable to read score screenshot.", error);
    setScreenshotStatus(card, getScreenshotErrorMessage(error), true);
  } finally {
    state.importingPlayerIndex = null;
    setScreenshotBusy(card, false);
    if (screenshotInput) {
      screenshotInput.value = "";
    }
    updateDateAvailability();
  }
}

async function readScoreScreenshot(file, playerName, card) {
  try {
    return await recognizeStructuredScoreScreenshot(file, card);
  } catch (error) {
    if (error?.message !== "score-layout-not-found") {
      throw error;
    }

    setScreenshotStatus(card, "Trying whole-image OCR...");
    const text = await recognizeScreenshotText(file, card);
    return parseScoreScreenshotText(text, playerName);
  }
}

async function recognizeStructuredScoreScreenshot(file, card) {
  setScreenshotStatus(card, "Finding answer rows...");
  const sourceCanvas = await createImageCanvas(file);
  const layout = detectScoreScreenshotLayout(sourceCanvas);

  if (layout.rows.length < ANSWERS_PER_PLAYER) {
    throw new Error("score-layout-not-found");
  }

  const ocr = await createScreenshotOcrSession(card);

  try {
    const answers = [];
    for (let index = 0; index < ANSWERS_PER_PLAYER; index += 1) {
      const row = layout.rows[index];
      setScreenshotStatus(card, `Reading answer ${index + 1} of ${ANSWERS_PER_PLAYER}...`);

      const answerText = await recognizeScoreCrop(
        sourceCanvas,
        getScoreAnswerCrop(sourceCanvas, row),
        ocr,
      );
      const answer = cleanStructuredAnswerText(answerText) || `Answer ${index + 1}`;
      const wrong = row.kind === "wrong";
      const perfect = row.kind === "perfect";
      let points = wrong ? 100 : perfect ? 0 : null;

      if (!wrong && !perfect) {
        const scoreText = await recognizeScoreDigits(
          sourceCanvas,
          getScoreValueCrop(sourceCanvas, row),
          ocr,
        );
        points = parseScreenshotScoreValue(scoreText, { max: 100 });
      }

      answers.push({
        answer,
        wrong,
        perfect,
        points,
      });
    }

    const totalText = await recognizeScoreDigits(
      sourceCanvas,
      getScoreTotalCrop(sourceCanvas, layout.rows[0]),
      ocr,
    );
    let total = parseScreenshotScoreValue(totalText, { max: 500, preferLargest: true });

    if (!Number.isFinite(total)) {
      const bottomText = await recognizeScoreDigits(
        sourceCanvas,
        getScoreBottomTotalCrop(sourceCanvas, layout.rows[layout.rows.length - 1]),
        ocr,
      );
      total = parseScreenshotScoreValue(bottomText, { max: 500, preferLargest: true });
    }
    const reconciled = reconcileStructuredScores(answers, total);

    return {
      answers: reconciled.answers,
      total: reconciled.total,
    };
  } finally {
    await ocr.terminate();
  }
}

async function recognizeScreenshotText(file, card) {
  const Tesseract = await loadTesseract();
  const result = await Tesseract.recognize(file, OCR_LANGUAGE, {
    logger(message) {
      const status = getOcrStatusLabel(message);
      if (status) {
        setScreenshotStatus(card, status);
      }
    },
  });

  return String(result?.data?.text || "").trim();
}

async function recognizeScoreCrop(sourceCanvas, crop, ocr) {
  const textCanvas = createWhiteTextMaskCanvas(sourceCanvas, crop);
  return ocr.recognize(textCanvas);
}

async function recognizeScoreDigits(sourceCanvas, crop, ocr) {
  const textCanvas = createWhiteTextMaskCanvas(sourceCanvas, crop);
  return typeof ocr.recognizeDigits === "function"
    ? ocr.recognizeDigits(textCanvas)
    : ocr.recognize(textCanvas);
}

async function createScreenshotOcrSession(card) {
  const Tesseract = await loadTesseract();
  const logger = (message) => {
    const status = getOcrStatusLabel(message);
    if (status) {
      setScreenshotStatus(card, status);
    }
  };

  const fallbackSession = {
    async recognize(image) {
      const result = await Tesseract.recognize(image, OCR_LANGUAGE, { logger });
      return String(result?.data?.text || "").trim();
    },
    async recognizeDigits(image) {
      return this.recognize(image);
    },
    async terminate() {},
  };

  if (typeof Tesseract.createWorker !== "function") {
    return fallbackSession;
  }

  let worker = null;
  try {
    worker = await Tesseract.createWorker(OCR_LANGUAGE, 1, { logger });
  } catch (error) {
    console.warn("Unable to create reusable OCR worker.", error);
    return fallbackSession;
  }

  const setTextParams = async () => {
    if (typeof worker.setParameters === "function") {
      try {
        await worker.setParameters({
          tessedit_char_whitelist: "",
          preserve_interword_spaces: "1",
          tessedit_pageseg_mode: "7",
        });
      } catch (e) { /* ignore */ }
    }
  };

  await setTextParams();

  return {
    async recognize(image) {
      const result = await worker.recognize(image);
      return String(result?.data?.text || "").trim();
    },
    async recognizeDigits(image) {
      if (typeof worker.setParameters === "function") {
        try {
          await worker.setParameters({
            tessedit_char_whitelist: "0123456789",
            tessedit_pageseg_mode: "7",
          });
        } catch (e) { /* ignore */ }
      }
      const result = await worker.recognize(image);
      await setTextParams();
      return String(result?.data?.text || "").trim();
    },
    async terminate() {
      if (typeof worker.terminate === "function") {
        await worker.terminate();
      }
    },
  };
}

async function createImageCanvas(file) {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    const size = getConstrainedScreenshotSize(bitmap.width, bitmap.height);
    canvas.width = size.width;
    canvas.height = size.height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, size.width, size.height);

    if (typeof bitmap.close === "function") {
      bitmap.close();
    }

    return canvas;
  }

  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      const size = getConstrainedScreenshotSize(
        image.naturalWidth || image.width,
        image.naturalHeight || image.height,
      );
      canvas.width = size.width;
      canvas.height = size.height;
      canvas.getContext("2d").drawImage(image, 0, 0, size.width, size.height);
      resolve(canvas);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image-load-failed"));
    };
    image.src = url;
  });
}

function getConstrainedScreenshotSize(sourceWidth, sourceHeight) {
  const width = Number(sourceWidth);
  const height = Number(sourceHeight);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error("image-load-failed");
  }

  if (width * height > SCORE_SCREENSHOT_HARD_MAX_PIXELS) {
    throw new Error("image-too-large");
  }

  const scale = Math.min(
    1,
    SCORE_SCREENSHOT_MAX_DIMENSION / width,
    SCORE_SCREENSHOT_MAX_DIMENSION / height,
    Math.sqrt(SCORE_SCREENSHOT_MAX_PIXELS / (width * height)),
  );

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function detectScoreScreenshotLayout(canvas) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const { width, height } = canvas;
  const image = context.getImageData(0, 0, width, height);
  const minimumColoredPixels = Math.max(6, Math.round(width * 0.008));
  const rowStats = Array.from({ length: height }, () => ({
    colored: 0,
    red: 0,
    green: 0,
    perfect: 0,
  }));

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const kind = getScorePixelKind(
        image.data[offset],
        image.data[offset + 1],
        image.data[offset + 2],
        image.data[offset + 3],
      );

      if (!kind) {
        continue;
      }

      rowStats[y].colored += 1;
      rowStats[y][kind] += 1;
    }
  }

  const segments = [];
  let activeSegment = null;

  rowStats.forEach((stats, y) => {
    if (stats.colored >= minimumColoredPixels) {
      if (!activeSegment) {
        activeSegment = {
          yMin: y,
          yMax: y,
        };
      }

      activeSegment.yMax = y;
      return;
    }

    if (activeSegment) {
      segments.push(activeSegment);
      activeSegment = null;
    }
  });

  if (activeSegment) {
    segments.push(activeSegment);
  }

  const rows = mergeCloseScoreSegments(segments)
    .map((segment) => getScoreRowBounds(image, segment))
    .filter((row) => row.height >= Math.max(8, height * 0.025) && row.coloredPixels > 0)
    .slice(0, ANSWERS_PER_PLAYER)
    .sort((a, b) => a.yMin - b.yMin);

  return {
    rows,
  };
}

function mergeCloseScoreSegments(segments) {
  const merged = [];

  segments.forEach((segment) => {
    const previous = merged[merged.length - 1];
    if (previous && segment.yMin - previous.yMax <= 6) {
      previous.yMax = segment.yMax;
      return;
    }

    merged.push({ ...segment });
  });

  return merged;
}

function getScoreRowBounds(image, segment) {
  const { width, height, data } = image;
  let xMin = width;
  let xMax = 0;
  let redPixels = 0;
  let greenPixels = 0;
  let perfectPixels = 0;

  for (let y = segment.yMin; y <= segment.yMax; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const kind = getScorePixelKind(
        data[offset],
        data[offset + 1],
        data[offset + 2],
        data[offset + 3],
      );

      if (!kind) {
        continue;
      }

      xMin = Math.min(xMin, x);
      xMax = Math.max(xMax, x);
      if (kind === "red") {
        redPixels += 1;
      } else if (kind === "perfect") {
        perfectPixels += 1;
      } else {
        greenPixels += 1;
      }
    }
  }

  const yMargin = Math.max(3, Math.round((segment.yMax - segment.yMin + 1) * 0.12));

  return {
    xMin: Math.max(0, xMin),
    xMax: Math.min(width - 1, xMax),
    yMin: Math.max(0, segment.yMin - yMargin),
    yMax: Math.min(height - 1, segment.yMax + yMargin),
    contentYMin: segment.yMin,
    contentYMax: segment.yMax,
    height: segment.yMax - segment.yMin + 1,
    coloredPixels: redPixels + greenPixels + perfectPixels,
    kind: getScoreRowKind({ redPixels, greenPixels, perfectPixels }),
  };
}

function getScoreRowKind({ redPixels, greenPixels, perfectPixels }) {
  if (redPixels > greenPixels && redPixels > perfectPixels) {
    return "wrong";
  }

  if (perfectPixels > redPixels && perfectPixels >= greenPixels * 0.8) {
    return "perfect";
  }

  return "correct";
}

function getScorePixelKind(red, green, blue, alpha) {
  if (alpha < 120) {
    return "";
  }

  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const saturation = maximum - minimum;

  if (green >= 90 && green > red * 1.15 && green > blue * 1.05 && saturation >= 30) {
    return "green";
  }

  if (red >= 110 && red > green * 1.2 && red > blue * 1.05 && saturation >= 30) {
    return "red";
  }

  if (
    maximum >= 120 &&
    minimum >= 55 &&
    saturation >= 22 &&
    red <= 230 &&
    (blue >= 120 || green >= 120) &&
    (blue > red + 4 || green > red + 10 || blue > green + 20)
  ) {
    return "perfect";
  }

  return "";
}

function getScoreAnswerCrop(canvas, row) {
  const x = Math.max(0, row.xMin + Math.round(canvas.width * 0.015));
  const rightEdge = Math.min(
    canvas.width,
    Math.max(x + 80, Math.round(canvas.width * SCORE_SCREENSHOT_ANSWER_COLUMN_RATIO)),
  );
  const verticalCrop = getScoreRowInnerVerticalCrop(row);

  return normalizeCropBox({
    x,
    y: verticalCrop.y,
    width: rightEdge - x,
    height: verticalCrop.height,
  }, canvas);
}

function getScoreValueCrop(canvas, row) {
  const x = Math.max(0, Math.round(canvas.width * SCORE_SCREENSHOT_SCORE_COLUMN_RATIO));
  const verticalCrop = getScoreRowInnerVerticalCrop(row);

  return normalizeCropBox({
    x,
    y: verticalCrop.y,
    width: canvas.width - x,
    height: verticalCrop.height,
  }, canvas);
}

function getScoreRowInnerVerticalCrop(row) {
  const contentHeight = row.contentYMax - row.contentYMin + 1;
  const inset = Math.max(1, Math.round(contentHeight * 0.08));

  return {
    y: row.contentYMin + inset,
    height: Math.max(1, contentHeight - inset * 2),
  };
}

function getScoreTotalCrop(canvas, firstRow) {
  const yMax = Math.max(1, firstRow.yMin - 2);
  const x = Math.round(canvas.width * 0.1);

  return normalizeCropBox({
    x,
    y: 0,
    width: Math.round(canvas.width * 0.8),
    height: yMax,
  }, canvas);
}

function getScoreBottomTotalCrop(canvas, lastRow) {
  const yMin = Math.min(canvas.height - 1, lastRow.yMax + 2);
  const x = Math.round(canvas.width * 0.1);

  return normalizeCropBox({
    x,
    y: yMin,
    width: Math.round(canvas.width * 0.8),
    height: Math.max(1, canvas.height - yMin),
  }, canvas);
}

function normalizeCropBox(box, canvas) {
  const x = Math.max(0, Math.min(canvas.width - 1, Math.round(box.x)));
  const y = Math.max(0, Math.min(canvas.height - 1, Math.round(box.y)));
  const width = Math.max(1, Math.min(canvas.width - x, Math.round(box.width)));
  const height = Math.max(1, Math.min(canvas.height - y, Math.round(box.height)));

  return {
    x,
    y,
    width,
    height,
  };
}

function createWhiteTextMaskCanvas(sourceCanvas, crop) {
  const scaledWidth = Math.max(1, crop.width * SCORE_SCREENSHOT_SCALE);
  const scaledHeight = Math.max(1, crop.height * SCORE_SCREENSHOT_SCALE);
  const rawCanvas = document.createElement("canvas");
  rawCanvas.width = scaledWidth;
  rawCanvas.height = scaledHeight;

  const rawContext = rawCanvas.getContext("2d", { willReadFrequently: true });
  rawContext.imageSmoothingEnabled = true;
  rawContext.drawImage(
    sourceCanvas,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    scaledWidth,
    scaledHeight,
  );

  const rawImage = rawContext.getImageData(0, 0, scaledWidth, scaledHeight);
  const textMask = createWhiteTextMask(rawImage);
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = scaledWidth + SCORE_SCREENSHOT_TEXT_PADDING * 2;
  outputCanvas.height = scaledHeight + SCORE_SCREENSHOT_TEXT_PADDING * 2;

  const outputContext = outputCanvas.getContext("2d", { willReadFrequently: true });
  const outputImage = outputContext.createImageData(outputCanvas.width, outputCanvas.height);
  outputImage.data.fill(255);

  for (let y = 0; y < scaledHeight; y += 1) {
    for (let x = 0; x < scaledWidth; x += 1) {
      const destinationX = x + SCORE_SCREENSHOT_TEXT_PADDING;
      const destinationY = y + SCORE_SCREENSHOT_TEXT_PADDING;
      const destinationOffset = (destinationY * outputCanvas.width + destinationX) * 4;
      const isText = textMask[y * scaledWidth + x];

      outputImage.data[destinationOffset] = isText ? 0 : 255;
      outputImage.data[destinationOffset + 1] = isText ? 0 : 255;
      outputImage.data[destinationOffset + 2] = isText ? 0 : 255;
      outputImage.data[destinationOffset + 3] = 255;
    }
  }

  outputContext.putImageData(outputImage, 0, 0);
  return outputCanvas;
}

function createWhiteTextMask(image) {
  const { width, height, data } = image;
  const baseMask = new Uint8Array(width * height);
  const dilatedMask = new Uint8Array(width * height);

  for (let index = 0; index < width * height; index += 1) {
    const offset = index * 4;
    baseMask[index] = isWhiteTextPixel(
      data[offset],
      data[offset + 1],
      data[offset + 2],
      data[offset + 3],
    )
      ? 1
      : 0;
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      if (!baseMask[index]) {
        continue;
      }

      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          const nextX = x + offsetX;
          const nextY = y + offsetY;
          if (nextX >= 0 && nextX < width && nextY >= 0 && nextY < height) {
            dilatedMask[nextY * width + nextX] = 1;
          }
        }
      }
    }
  }

  return dilatedMask;
}

function isWhiteTextPixel(red, green, blue, alpha) {
  if (alpha < 100) {
    return false;
  }

  const brightness = (red + green + blue) / 3;
  const spread = Math.max(red, green, blue) - Math.min(red, green, blue);
  const minimum = Math.min(red, green, blue);

  return brightness >= 175 && minimum >= 148 && spread <= 120;
}

function reconcileStructuredScores(answers, total) {
  const normalizedAnswers = answers.map((answer) => ({
    ...answer,
    points: answer.wrong ? 100 : answer.points,
  }));
  const missingIndexes = normalizedAnswers
    .map((answer, index) => (!answer.wrong && !Number.isFinite(answer.points) ? index : -1))
    .filter((index) => index >= 0);

  if (Number.isFinite(total) && missingIndexes.length === 1) {
    const perfectBonus = normalizedAnswers.filter((answer) => answer.perfect).length * 100;
    const knownTotal = normalizedAnswers.reduce(
      (sum, answer) => sum + (Number.isFinite(answer.points) ? answer.points : 0),
      0,
    );
    const missingScore = total + perfectBonus - knownTotal;

    if (missingScore >= 0 && missingScore <= 100) {
      normalizedAnswers[missingIndexes[0]].points = missingScore;
    }
  }

  const finalAnswers = normalizedAnswers.map((answer) => ({
    ...answer,
    points: Number.isFinite(answer.points) ? answer.points : 0,
  }));

  return {
    answers: finalAnswers,
    total: Number.isFinite(total) ? total : calculateStructuredTotal(finalAnswers),
  };
}

function calculateStructuredTotal(answers) {
  const visibleScore = answers.reduce(
    (sum, answer) => sum + (Number.isFinite(answer.points) ? answer.points : 0),
    0,
  );
  const perfectBonus = answers.filter((answer) => answer.perfect).length * 100;

  return Math.max(0, visibleScore - perfectBonus);
}

function parseScreenshotScoreValue(text, options = {}) {
  const max = Number.isFinite(options.max) ? options.max : 100;
  const normalized = normalizeOcrDigits(text);
  const matches = normalized.match(/\d{1,3}/g) || [];
  const valid = [];

  for (const match of matches) {
    const value = Number.parseInt(match, 10);
    if (Number.isFinite(value) && value >= 0 && value <= max) {
      valid.push(value);
    }
  }

  if (!valid.length) {
    return null;
  }

  return options.preferLargest ? Math.max(...valid) : valid[0];
}

function normalizeOcrDigits(text) {
  return String(text || "")
    .replace(/[oO]/g, "0")
    .replace(/[iIlL|]/g, "1")
    .replace(/[zZ]/g, "2")
    .replace(/[sS]/g, "5")
    .replace(/[gq]/g, "9")
    .replace(/[bB]/g, "8");
}

function cleanStructuredAnswerText(text) {
  return cleanOcrLine(text)
    .replace(/\b\d{1,3}\b/g, " ")
    .replace(/[^\p{L}\s.'-]/gu, " ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function loadTesseract() {
  if (window.Tesseract?.recognize) {
    return Promise.resolve(window.Tesseract);
  }

  if (tesseractLoadPromise) {
    return tesseractLoadPromise;
  }

  tesseractLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TESSERACT_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      if (window.Tesseract?.recognize) {
        resolve(window.Tesseract);
        return;
      }

      reject(new Error("ocr-unavailable"));
    };
    script.onerror = () => reject(new Error("ocr-load-failed"));
    document.head.appendChild(script);
  }).catch((error) => {
    tesseractLoadPromise = null;
    throw error;
  });

  return tesseractLoadPromise;
}

function getOcrStatusLabel(message) {
  if (!message || typeof message !== "object") {
    return "";
  }

  if (message.status === "recognizing text") {
    const progress = Number.isFinite(message.progress)
      ? Math.round(message.progress * 100)
      : 0;
    return progress ? `Reading screenshot ${progress}%...` : "Reading screenshot...";
  }

  if (message.status === "loading language traineddata") {
    return "Loading OCR language...";
  }

  if (message.status === "initializing tesseract") {
    return "Starting OCR...";
  }

  return "";
}

function getScreenshotErrorMessage(error) {
  if (error?.message === "ocr-load-failed" || error?.message === "ocr-unavailable") {
    return "Screenshot OCR could not load.";
  }

  if (error?.message === "image-too-large") {
    return "Screenshot dimensions are too large. Crop the image and try again.";
  }

  if (error?.message === "image-load-failed") {
    return "Could not load that screenshot.";
  }

  return "Could not read screenshot.";
}

function getImageFileFromDataTransfer(dataTransfer) {
  if (!dataTransfer) {
    return null;
  }

  const item = [...(dataTransfer.items || [])].find(
    (entry) => entry.kind === "file" && entry.type.startsWith("image/"),
  );
  if (item) {
    return item.getAsFile();
  }

  return [...(dataTransfer.files || [])].find((entry) => entry.type.startsWith("image/")) || null;
}

function parseScoreScreenshotText(text, preferredPlayerName) {
  const allLines = getOcrLines(text);
  const scopedLines = getOcrLinesForPlayer(allLines, preferredPlayerName);
  const primaryAnswers = extractOcrAnswerCandidates(scopedLines);

  if (primaryAnswers.length >= ANSWERS_PER_PLAYER || scopedLines.length === allLines.length) {
    return {
      answers: primaryAnswers.slice(0, ANSWERS_PER_PLAYER),
    };
  }

  return {
    answers: uniqueOcrAnswers([
      ...primaryAnswers,
      ...extractOcrAnswerCandidates(allLines),
    ]).slice(0, ANSWERS_PER_PLAYER),
  };
}

function getOcrLines(text) {
  return String(text || "")
    .replace(/\r/g, "\n")
    .split("\n")
    .flatMap(splitOcrLine)
    .map(cleanOcrLine)
    .filter(Boolean);
}

function splitOcrLine(line) {
  const segments = String(line || "")
    .split(/\t+|\s{3,}/)
    .map(cleanOcrLine)
    .filter(Boolean);

  return segments.length ? segments : [line];
}

function getOcrLinesForPlayer(lines, playerName) {
  const target = canonicalizePlayerName(playerName).toLowerCase();
  if (!target) {
    return lines;
  }

  const otherPlayerNames = state.players
    .map(canonicalizePlayerName)
    .map((name) => name.toLowerCase())
    .filter((name) => name && name !== target);
  const targetIndex = lines.findIndex((line) => line.toLowerCase().includes(target));

  if (targetIndex < 0) {
    return lines;
  }

  const scopedLines = [];
  const sameLineRemainder = cleanOcrLine(
    lines[targetIndex].replace(new RegExp(escapeRegExp(target), "i"), ""),
  );
  if (sameLineRemainder) {
    scopedLines.push(sameLineRemainder);
  }

  for (let index = targetIndex + 1; index < lines.length; index += 1) {
    const lowerLine = lines[index].toLowerCase();
    if (otherPlayerNames.some((name) => lowerLine.includes(name))) {
      break;
    }

    scopedLines.push(lines[index]);
  }

  return scopedLines.length ? scopedLines : lines;
}

function extractOcrAnswerCandidates(lines) {
  const candidates = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = cleanOcrLine(lines[index]);
    const parsedLine = parseOcrAnswerLine(line);

    if (parsedLine) {
      candidates.push(parsedLine);
      continue;
    }

    const nextLine = cleanOcrLine(lines[index + 1]);
    if (isLikelyAnswerOnlyLine(line) && isStandalonePointLine(nextLine)) {
      const wrong = OCR_WRONG_PATTERN.test(`${line} ${nextLine}`);
      candidates.push({
        answer: cleanOcrAnswerText(line),
        wrong,
        points: wrong ? 100 : parseStandalonePoints(nextLine),
      });
      index += 1;
    }
  }

  return uniqueOcrAnswers(candidates);
}

function parseOcrAnswerLine(line) {
  if (!line || isOcrIgnoredLine(line)) {
    return null;
  }

  const wrong = OCR_WRONG_PATTERN.test(line);
  const pointMatch = line.match(/(?:^|[\s:([{\-])(\d{1,3})(?:\s*(?:pts?|points?|%)?)?$/i);

  if (!pointMatch) {
    if (!wrong) {
      return null;
    }

    const wrongAnswer = cleanOcrAnswerText(line);
    return wrongAnswer
      ? {
          answer: wrongAnswer,
          wrong: true,
          points: 100,
        }
      : null;
  }

  const answer = cleanOcrAnswerText(line.slice(0, pointMatch.index));
  if (!answer || isOcrIgnoredLine(answer)) {
    return null;
  }

  return {
    answer,
    wrong,
    points: wrong ? 100 : parsePoints(pointMatch[1]),
  };
}

function uniqueOcrAnswers(candidates) {
  const seen = new Set();
  const uniqueAnswers = [];

  candidates.forEach((candidate) => {
    const answer = cleanOcrAnswerText(candidate.answer);
    if (!answer || isOcrIgnoredLine(answer)) {
      return;
    }

    const wrong = Boolean(candidate.wrong);
    const points = wrong ? 100 : parsePoints(candidate.points);
    const key = `${answer.toLowerCase()}::${points}`;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    uniqueAnswers.push({
      answer,
      wrong,
      points,
    });
  });

  return uniqueAnswers;
}

function applyScreenshotAnswersToCard(card, answers) {
  const rows = [...card.querySelectorAll(".answer-row")];
  const answersToApply = answers.slice(0, ANSWERS_PER_PLAYER);

  answersToApply.forEach((answer, answerIndex) => {
    const row = rows[answerIndex];
    if (!row) {
      return;
    }

    const answerInput = row.querySelector(".answer-input");
    const pointsInput = row.querySelector(".points-input");
    const wrong = Boolean(answer.wrong);
    const perfect = Boolean(answer.perfect);

    answerInput.value = answer.answer;
    setAnswerWrongState(row, wrong, { initial: true });
    pointsInput.value = String(wrong ? 100 : parsePoints(answer.points));
    row.dataset.perfect = String(perfect);
    row.classList.toggle("is-perfect", perfect);
  });

  return answersToApply.length;
}

function isLikelyAnswerOnlyLine(line) {
  const answer = cleanOcrAnswerText(line);
  return Boolean(answer) && !isStandalonePointLine(answer) && !isOcrIgnoredLine(answer);
}

function isStandalonePointLine(line) {
  return /^\d{1,3}\s*(?:pts?|points?|%)?$/i.test(cleanOcrLine(line));
}

function parseStandalonePoints(line) {
  const match = cleanOcrLine(line).match(/\d{1,3}/);
  return match ? parsePoints(match[0]) : 0;
}

function isOcrIgnoredLine(line) {
  const normalized = cleanOcrLine(line)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();

  return (
    !normalized ||
    /^(answers?|category|correct|date|goalless|leaderboard|overall|player|players|points?|rank|result|results|score|share)$/.test(
      normalized,
    ) ||
    /^(final score|game over|overall score|total)\b/.test(normalized) ||
    /\b(final score|overall score|total)\b/.test(normalized)
  );
}

function cleanOcrAnswerText(text) {
  return cleanOcrLine(text)
    .replace(OCR_WRONG_PATTERN, " ")
    .replace(/\b(?:answer|correct|pts?|points?)\b/gi, " ")
    .replace(/^\d{1,2}\s*[).:-]?\s+/, "")
    .replace(/^[\s:;,.|_\-\u2013\u2014]+/, "")
    .replace(/[\s:;,.|_\-\u2013\u2014]+$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanOcrLine(line) {
  return String(line || "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[|*_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function setScreenshotBusy(card, isBusy) {
  card.classList.toggle("is-importing-screenshot", isBusy);
  const button = card.querySelector(".screenshot-pick-button");
  if (button) {
    button.textContent = isBusy ? "Reading..." : "Choose screenshot";
  }
}

function setScreenshotStatus(card, message, isError = false) {
  const status = card.querySelector(".screenshot-status");
  if (!status) {
    return;
  }

  status.textContent = message;
  status.classList.toggle("is-error", Boolean(isError));
}

function updateScreenshotImportAvailability(card, isDisabled) {
  const input = card.querySelector(".screenshot-input");
  const button = card.querySelector(".screenshot-pick-button");
  const dropzone = card.querySelector(".screenshot-dropzone");

  if (input) {
    input.disabled = isDisabled;
  }

  if (button) {
    button.disabled = isDisabled;
  }

  if (dropzone) {
    dropzone.classList.toggle("is-disabled", isDisabled);
    dropzone.setAttribute("aria-disabled", String(isDisabled));
    dropzone.tabIndex = isDisabled ? -1 : 0;
  }
}

function isScreenshotImportDisabled(card) {
  return (
    card.classList.contains("is-submitted") ||
    Boolean(state.savingPlayer) ||
    state.importingPlayerIndex !== null
  );
}

async function loadRounds() {
  state.loading = true;
  showStatus("Loading rounds...");
  render();

  try {
    state.rounds = mergeRounds(loadLegacyRounds(), await fetchFirestoreRounds());
    sortRounds();
    syncCategoryForSelectedDate({ force: true });
    showStatus("");
  } catch (error) {
    console.error("Unable to load rounds.", error);
    state.rounds = loadLegacyRounds();
    sortRounds();
    showStatus(`Firebase error: ${error?.code || error?.message || String(error)}`, true);
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
    normalizeRoundFromFirestoreDoc(roundDoc),
  );
}

function normalizeRoundFromFirestoreDoc(roundDoc) {
  const data = roundDoc.data() || {};

  return normalizeRound({
    ...data,
    id: roundDoc.id,
    date: data.date || roundDoc.id,
  });
}

function loadLegacyRounds() {
  const legacy = readJson(LEGACY_STORAGE_KEY);
  const rounds = Array.isArray(legacy)
    ? legacy
    : Array.isArray(legacy?.rounds)
      ? legacy.rounds
      : [];

  return rounds
    .filter((round) => round && typeof round === "object")
    .map((round, index) =>
      normalizeRound({
        ...round,
        id: round.id || round.date || `legacy-${index + 1}`,
        date: round.date || round.id,
      }),
    )
    .filter((round) => round.players.length);
}

function mergeRounds(...roundGroups) {
  const roundsByKey = new Map();

  roundGroups.flat().forEach((round) => {
    const key = round.id || round.date;
    if (key) {
      roundsByKey.set(key, round);
    }
  });

  return [...roundsByKey.values()];
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
  const date = roundDate.value || getToday();
  const categories = {
    ...(state.draft?.categories || {}),
  };
  const category = roundCategory.value.trim();

  if (category) {
    categories[date] = category;
  } else {
    delete categories[date];
  }

  const draft = {
    date,
    category: categories[date] || "",
    categories,
    players: [...document.querySelectorAll(".player-card")].map((card) => ({
      name: card.querySelector(".player-name").value,
      screenshotTotal: Number.isFinite(Number(card.dataset.screenshotTotal))
        ? Number(card.dataset.screenshotTotal)
        : null,
      answers: [...card.querySelectorAll(".answer-row")].map((row) => ({
        answer: row.querySelector(".answer-input").value,
        wrong: isAnswerWrong(row),
        perfect: row.dataset.perfect === "true",
        points: row.querySelector(".points-input").value,
      })),
    })),
  };

  state.draft = draft;
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

function syncCategoryForSelectedDate(options = {}) {
  const selectedDate = roundDate.value || getToday();
  const dateChanged = state.categoryDate !== selectedDate;

  if (!options.force && !dateChanged) {
    return;
  }

  roundCategory.value = getCategoryForDate(selectedDate);
  state.categoryDate = selectedDate;
  persistDraft();
}

function getCategoryForDate(date) {
  return getSavedCategoryForDate(date) || getDraftCategoryForDate(date);
}

function getSavedCategoryForDate(date) {
  const savedRound = state.rounds.find((round) => round.date === date);
  return String(savedRound?.category || "").trim();
}

function getDraftCategoryForDate(date) {
  const draftCategories =
    state.draft?.categories && typeof state.draft.categories === "object"
      ? state.draft.categories
      : {};

  if (draftCategories[date]) {
    return String(draftCategories[date]).trim();
  }

  if (state.draft?.date === date && state.draft.category) {
    return String(state.draft.category).trim();
  }

  return "";
}

function advanceFormToTodayAfterPastSave(savedDate) {
  const today = getToday();
  const cleanSavedDate = normalizeDateValue(savedDate);

  if (!cleanSavedDate || cleanSavedDate >= today) {
    return;
  }

  resetDraftForDateIfNeeded(today);
  roundDate.value = today;
  roundCategory.value = getCategoryForDate(today);
  state.categoryDate = today;
  renderPlayerForms();
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
  syncPlayerEmailsFromForm();
  const existingEntry = getExistingPlayerEntryForDate(selectedDate, playerEntry.name);
  if (existingEntry) {
    showDuplicatePlayerMessage(selectedDate, playerEntry.name, existingEntry);
    return;
  }

  setSaving(playerEntry.name);
  showMessage(`Checking ${playerEntry.name}'s score...`);

  try {
    state.rounds = mergeRounds(loadLegacyRounds(), await fetchFirestoreRounds());
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
    const notificationResult = await queueRoundNotificationEmails(savedRound, playerEntry.name);

    state.players[playerIndex] = playerEntry.name;
    savePlayers();
    upsertRound(savedRound);
    sortRounds();
    clearPlayerInputs(playerIndex);
    persistDraft();
    advanceFormToTodayAfterPastSave(selectedDate);
    render();
    showMessage(getSaveSuccessMessage(playerEntry.name, notificationResult));
  } catch (error) {
    if (error?.message === DUPLICATE_PLAYER_ERROR) {
      state.rounds = mergeRounds(loadLegacyRounds(), await fetchFirestoreRounds());
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

async function queueRoundNotificationEmails(round, savedPlayerName) {
  if (!firebase?.db || typeof firebase.addDoc !== "function") {
    return {
      queued: 0,
      skipped: "Email alerts are not available.",
    };
  }

  if (isRoundComplete(round)) {
    return queueResultsEmail(round);
  }

  return queueReminderEmail(round, savedPlayerName);
}

async function queueReminderEmail(round, savedPlayerName) {
  const missingPlayers = getMissingPlayersForRound(round);
  const recipients = getRecipientEmails(missingPlayers);

  if (!recipients.length) {
    return {
      queued: 0,
      skipped: missingPlayers.length
        ? `Add ${missingPlayers.join(" and ")}'s email to send the reminder.`
        : "No reminder recipient was found.",
    };
  }

  const dateLabel = formatDate(round.date);
  const subject = `Goalless reminder: ${savedPlayerName} has submitted`;
  const text = [
    `${savedPlayerName} has saved their Goalless score for ${dateLabel}.`,
    "",
    `Category: ${round.category}`,
    "",
    "Remember to add your five answers and score.",
  ].join("\n");
  const html = `
    <p><strong>${escapeHtml(savedPlayerName)}</strong> has saved their Goalless score for <strong>${escapeHtml(dateLabel)}</strong>.</p>
    <p><strong>Category:</strong> ${escapeHtml(round.category)}</p>
    <p>Remember to add your five answers and score.</p>
  `;

  try {
    const queued = await queueEmail({
      recipients,
      subject,
      text,
      html,
      type: "reminder",
      round,
    });

    return {
      queued,
      type: "reminder",
    };
  } catch (error) {
    console.error("Unable to queue reminder email.", error);
    return {
      queued: 0,
      failed: true,
    };
  }
}

async function queueResultsEmail(round) {
  const recipients = getRecipientEmails(state.players);

  if (!recipients.length) {
    return {
      queued: 0,
      skipped: "Add player email addresses to send the results email.",
    };
  }

  const dateLabel = formatDate(round.date);
  const winnerName = getUniqueWinnerName(round.players);
  const scoreLines = round.players.map((player) => `${player.name}: ${player.total} points`);
  const resultLine = winnerName ? `${winnerName} wins.` : "The round is a draw.";
  const subject = `Goalless results are in: ${dateLabel}`;
  const text = [
    `Today's Goalless results are in for ${dateLabel}.`,
    "",
    `Category: ${round.category}`,
    ...scoreLines,
    "",
    resultLine,
  ].join("\n");
  const html = `
    <p>Today's Goalless results are in for <strong>${escapeHtml(dateLabel)}</strong>.</p>
    <p><strong>Category:</strong> ${escapeHtml(round.category)}</p>
    <ul>
      ${round.players
        .map((player) => `<li>${escapeHtml(player.name)}: <strong>${player.total} points</strong></li>`)
        .join("")}
    </ul>
    <p><strong>${escapeHtml(resultLine)}</strong></p>
  `;

  try {
    const queued = await queueEmail({
      recipients,
      subject,
      text,
      html,
      type: "results",
      round,
    });

    return {
      queued,
      type: "results",
    };
  } catch (error) {
    console.error("Unable to queue results email.", error);
    return {
      queued: 0,
      failed: true,
    };
  }
}

async function queueEmail({ recipients, subject, text, html, type, round }) {
  const cleanRecipients = [...new Set(recipients.map(normalizeEmail).filter(Boolean))];

  if (!cleanRecipients.length) {
    return 0;
  }

  await firebase.addDoc(firebase.collection(firebase.db, MAIL_COLLECTION), {
    to: cleanRecipients,
    message: {
      subject,
      text,
      html,
    },
    notificationType: type,
    roundId: round.id,
    roundDate: round.date,
    createdAt: typeof firebase.serverTimestamp === "function"
      ? firebase.serverTimestamp()
      : new Date().toISOString(),
  });

  return cleanRecipients.length;
}

function getRecipientEmails(playerNames) {
  return playerNames
    .map((playerName) => state.playerEmails[canonicalizePlayerName(playerName)])
    .map(normalizeEmail)
    .filter(Boolean);
}

function syncPlayerEmailsFromForm() {
  document.querySelectorAll(".player-card").forEach((card) => {
    const playerIndex = Number(card.dataset.playerIndex || 0);
    const playerName =
      canonicalizePlayerName(card.querySelector(".player-name")?.value) ||
      DEFAULT_PLAYERS[playerIndex];
    const email = card.querySelector(".player-email")?.value || "";
    state.playerEmails[playerName] = email.trim();
  });
  savePlayerEmails();
}

function normalizeEmail(email) {
  const cleanEmail = String(email || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ? cleanEmail : "";
}

function getSaveSuccessMessage(playerName, notificationResult) {
  if (notificationResult?.failed) {
    return `${playerName}'s score saved. Email notification could not be queued.`;
  }

  if (notificationResult?.queued > 0) {
    const label = notificationResult.type === "results" ? "Results email" : "Reminder email";
    return `${playerName}'s score saved. ${label} queued.`;
  }

  if (notificationResult?.skipped) {
    return `${playerName}'s score saved. ${notificationResult.skipped}`;
  }

  return `${playerName}'s score saved.`;
}

function getPlayerEntryFromCard(card, playerIndex) {
  const nameInput = card.querySelector(".player-name");
  const name = canonicalizePlayerName(nameInput.value) || DEFAULT_PLAYERS[playerIndex];
  const answers = [...card.querySelectorAll(".answer-row")].map((row, answerIndex) => {
    const answer = row.querySelector(".answer-input").value.trim();
    const wrong = isAnswerWrong(row);
    const points = wrong ? 100 : parsePoints(row.querySelector(".points-input").value);

    return {
      answer: answer || `Answer ${answerIndex + 1}`,
      wrong,
      perfect: row.dataset.perfect === "true",
      points,
    };
  });

  return {
    name,
    answers,
    total: getPlayerTotalFromCard(card, answers),
    savedAt: new Date().toISOString(),
  };
}

function resetRoundInputs() {
  roundDate.value = getToday();
  roundCategory.value = "";

  document.querySelectorAll(".player-card").forEach((card) => {
    clearScreenshotTotalOverride(card);
    card.querySelectorAll(".answer-row").forEach((row) => {
      setAnswerWrongState(row, false, { initial: true });
    });
    card.querySelectorAll(".answer-input, .points-input").forEach((input) => {
      input.value = "";
      input.disabled = false;
    });
    card.querySelectorAll(".answer-status-toggle").forEach((button) => {
      button.disabled = false;
    });
    setScreenshotStatus(card, "");
    card.querySelector(".player-total strong").textContent = "0";
  });

  persistDraft();
}

function clearPlayerInputs(playerIndex) {
  const card = document.querySelector(`.player-card[data-player-index="${playerIndex}"]`);
  if (!card) {
    return;
  }

  clearScreenshotTotalOverride(card);
  card.querySelectorAll(".answer-input, .points-input").forEach((input) => {
    input.value = "";
    input.disabled = false;
  });
  card.querySelectorAll(".answer-row").forEach((row) => {
    setAnswerWrongState(row, false, { initial: true });
  });
  card.querySelectorAll(".answer-status-toggle").forEach((button) => {
    button.disabled = false;
  });
  setScreenshotStatus(card, "");
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

function handleStatsPeriodClick(event) {
  const button = event.target.closest("[data-stats-period]");
  if (!button || button.dataset.statsPeriod === state.statsPeriod) {
    return;
  }

  state.statsPeriod = button.dataset.statsPeriod;
  renderVisualisations();
}

function render() {
  renderTodayRound();
  renderLeaderboard();
  renderHistoricalStats();
  renderVisualisations();
  renderHistory();
  const trackedRounds = getTrackedRoundCount();
  roundCount.textContent = `${trackedRounds} tracked ${trackedRounds === 1 ? "round" : "rounds"}`;
  if (sidebarRoundCount) {
    sidebarRoundCount.textContent = String(trackedRounds);
  }
  updateDateAvailability();
}

function renderTodayRound() {
  if (!todayRound) {
    return;
  }

  if (state.loading) {
    todayRound.innerHTML = '<div class="empty-state">Checking today\'s round...</div>';
    return;
  }

  const today = getToday();
  const round = state.rounds.find((item) => item.date === today);
  const todayLabel = formatDate(today);

  if (!round) {
    todayRound.innerHTML = `
      <article class="today-card today-empty-card">
        <div>
          <p class="today-date">${escapeHtml(todayLabel)}</p>
          <h3>No score saved yet</h3>
          <p>Use New round to save today's category and scores.</p>
        </div>
        <span class="today-state-pill">Not started</span>
      </article>
    `;
    return;
  }

  const submittedNames = getSubmittedPlayerNames(round);
  const configuredPlayers = getConfiguredPlayers();
  const submittedCount = configuredPlayers.filter((name) =>
    submittedNames.has(canonicalizePlayerName(name)),
  ).length;
  const waitingPlayers = getMissingPlayersForRound(round);

  if (!isRoundComplete(round)) {
    todayRound.innerHTML = `
      <article class="today-card today-waiting-card">
        <div class="today-card-header">
          <div>
            <p class="today-date">${escapeHtml(todayLabel)}</p>
            <h3>${escapeHtml(round.category || "Untitled round")}</h3>
          </div>
          <span class="today-state-pill is-waiting">${submittedCount}/${configuredPlayers.length} saved</span>
        </div>
        <div class="today-waiting-copy">
          <strong>Waiting for ${escapeHtml(waitingPlayers.join(" and ") || "the other player")}</strong>
          <span>Answers and points stay hidden until both players have saved today's score.</span>
        </div>
        <div class="today-submission-list">
          ${renderTodaySubmissionRows(submittedNames)}
        </div>
      </article>
    `;
    return;
  }

  const winnerName = getUniqueWinnerName(round.players);
  const orderedPlayers = orderPlayersForDisplay(round.players);
  const scoreline = orderedPlayers
    .map(
      (player) => `
        <div class="today-score-player ${player.name === winnerName ? "is-winner" : ""}">
          <span>${escapeHtml(player.name)}</span>
          <strong>${formatNumber(player.total)}</strong>
        </div>
      `,
    )
    .join('<span class="today-versus">vs</span>');

  todayRound.innerHTML = `
    <article class="today-card is-complete">
      <div class="today-card-header">
        <div>
          <p class="today-date">${escapeHtml(todayLabel)}</p>
          <h3>${escapeHtml(round.category || "Untitled round")}</h3>
        </div>
        <span class="today-state-pill is-complete">${winnerName ? `${escapeHtml(winnerName)} wins` : "Draw"}</span>
      </div>
      <div class="today-scoreline" aria-label="Today's result">
        ${scoreline}
      </div>
      <div class="today-result-grid">
        ${orderedPlayers.map((player) => renderTodayPlayer(player, winnerName)).join("")}
      </div>
    </article>
  `;
}

function renderTodaySubmissionRows(submittedNames) {
  return getConfiguredPlayers().map((name) => {
    const isSubmitted = submittedNames.has(canonicalizePlayerName(name));
    return `
      <div class="today-submission-row ${isSubmitted ? "is-submitted" : ""}">
        <span class="today-submission-dot" aria-hidden="true"></span>
        <div>
          <strong>${escapeHtml(name)}</strong>
          <small>${isSubmitted ? "Score saved" : "Waiting"}</small>
        </div>
      </div>
    `;
  }).join("");
}

function renderTodayPlayer(player, winnerName) {
  const isWinner = player.name === winnerName;
  const isDraw = !winnerName;

  return `
    <section class="today-player-card ${isWinner ? "is-winner" : ""}">
      <div class="today-player-header">
        <div>
          <h4>${escapeHtml(player.name)}</h4>
          <span>${isWinner ? "Lowest score" : isDraw ? "Drawn result" : "Runner up"}</span>
        </div>
        ${isWinner ? '<span class="winner-badge">Winner</span>' : isDraw ? '<span class="winner-badge is-draw">Draw</span>' : ""}
      </div>
      <div class="today-total">
        <span>Total</span>
        <strong>${formatNumber(player.total)}</strong>
      </div>
      <ul class="today-answer-list">
        ${player.answers
          .map(
            (answer, index) => `
              <li class="${answer.wrong ? "is-wrong" : answer.perfect ? "is-perfect" : ""}">
                <span>${index + 1}. ${escapeHtml(answer.answer)}</span>
                <strong>${getAnswerHistoryScoreLabel(answer)}</strong>
              </li>
            `,
          )
          .join("")}
      </ul>
    </section>
  `;
}

function orderPlayersForDisplay(players) {
  const configuredPlayers = getConfiguredPlayers();

  return [...players].sort((a, b) => {
    const aIndex = configuredPlayers.indexOf(canonicalizePlayerName(a.name));
    const bIndex = configuredPlayers.indexOf(canonicalizePlayerName(b.name));
    const aOrder = aIndex >= 0 ? aIndex : Number.MAX_SAFE_INTEGER;
    const bOrder = bIndex >= 0 ? bIndex : Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder || a.name.localeCompare(b.name);
  });
}

function renderLeaderboard() {
  const rows = buildLeaderboard();
  leaderboard.innerHTML = "";

  if (!rows.length) {
    leaderboard.innerHTML = '<div class="empty-state">Save a round to start the table.</div>';
    return;
  }

  const leaderTotal = rows[0]?.total || 0;

  leaderboard.innerHTML = `
    <div class="overall-leaderboard" aria-label="Overall leaderboard">
      ${rows
        .map((row, index) => {
          const nextRow = rows[index + 1];
          const gapText =
            index === 0
              ? nextRow
                ? `${formatNumber(nextRow.total - row.total)} ahead`
                : "Leader"
              : `${formatNumber(row.total - leaderTotal)} behind`;

          return `
            <article class="overall-rank-card ${index === 0 ? "is-first" : "is-second"}">
              <div class="overall-rank-top">
                <span class="overall-rank-number">${index + 1}</span>
                <div>
                  <p class="leader-kicker">${index === 0 ? "First place" : "Second place"}</p>
                  <h3>${escapeHtml(row.name)}</h3>
                  <span>${gapText}</span>
                </div>
              </div>
              <div class="overall-rank-stats">
                <div>
                  <span>Total</span>
                  <strong>${formatNumber(row.total)}</strong>
                </div>
                <div>
                  <span>Average</span>
                  <strong>${formatAverage(row.average)}</strong>
                </div>
                <div>
                  <span>Wins</span>
                  <strong>${row.wins}</strong>
                </div>
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
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
  const seasonSummaries = getSeasonSummaries().sort((a, b) => b.year - a.year);
  const completedFirestoreRounds = getCompletedFirestoreRounds().length;

  historicalSummary.innerHTML = `
    <div>
      <p class="eyebrow">Historical stats</p>
      <h3>Season archive</h3>
    </div>
    <p>${importedRounds} imported rounds across ${seasonSummaries.length} seasons, ${importedDraws} draw${importedDraws === 1 ? "" : "s"}, plus ${completedFirestoreRounds} completed Firestore ${completedFirestoreRounds === 1 ? "round" : "rounds"}.</p>
  `;

  seasonStats.innerHTML = renderSeasonSlideshow(seasonSummaries);
  setupSeasonSlideshow();
}

function renderSeasonSlideshow(seasons) {
  if (!seasons.length) {
    return '<div class="empty-state">Historical season data is not available yet.</div>';
  }

  return `
    <section class="season-showcase" data-season-slideshow aria-label="Historical season slideshow">
      <div class="season-year-rail" role="tablist" aria-label="Historical seasons">
        ${seasons.map((season, index) => renderSeasonSlideTrigger(season, index)).join("")}
      </div>
      <div class="season-slide-stage">
        ${seasons.map((season, index) => renderSeasonSlide(season, index)).join("")}
      </div>
    </section>
  `;
}

function renderSeasonSlideTrigger(season, index) {
  const leader = season.players[0];
  const isActive = index === 0;

  return `
    <button
      class="season-slide-trigger ${isActive ? "is-active" : ""}"
      type="button"
      id="season-tab-${season.year}"
      role="tab"
      aria-selected="${isActive ? "true" : "false"}"
      aria-controls="season-slide-${season.year}"
      tabindex="${isActive ? "0" : "-1"}"
      data-season-index="${index}"
    >
      <span class="season-trigger-year" aria-label="${season.year}">
        ${renderSlideshowText(String(season.year))}
      </span>
      <span class="season-trigger-meta">${season.rounds} rounds / ${escapeHtml(leader?.name || "Leader")} led</span>
    </button>
  `;
}

function renderSlideshowText(text) {
  return [...text]
    .map(
      (char, index) =>
        `<span class="season-trigger-char" style="--char-index:${index}"><span>${escapeHtml(char)}</span><span>${escapeHtml(char)}</span></span>`,
    )
    .join("");
}

function renderSeasonSlide(season, index) {
  const leader = season.players[0];
  const runnerUp = season.players[1];
  const gap = leader && runnerUp ? runnerUp.total - leader.total : 0;
  const isActive = index === 0;

  return `
    <article
      class="season-slide ${isActive ? "is-active" : ""}"
      id="season-slide-${season.year}"
      role="tabpanel"
      aria-labelledby="season-tab-${season.year}"
      aria-hidden="${isActive ? "false" : "true"}"
      data-season-slide-panel="${index}"
    >
      <div class="season-slide-visual" aria-hidden="true">
        <div>
          <span>Season</span>
          <strong>${season.year}</strong>
        </div>
        <p>${escapeHtml(leader?.name || "Leader")}</p>
        <small>${formatNumber(Math.max(0, gap))} point lead</small>
      </div>
      <div class="season-slide-content">
        <div class="season-slide-top">
          <div>
            <p class="eyebrow">Breakdown</p>
            <h3>${season.year}</h3>
          </div>
          <div class="season-slide-meta">
            <div><span>Rounds</span><strong>${season.rounds}</strong></div>
            <div><span>Draws</span><strong>${season.draws}</strong></div>
            <div><span>Gap</span><strong>${formatNumber(Math.max(0, gap))}</strong></div>
          </div>
        </div>
        <div class="season-slide-table">
          ${season.players
            .map((stats, playerIndex) => renderSeasonSlidePlayer(stats, season.rounds, playerIndex))
            .join("")}
        </div>
      </div>
    </article>
  `;
}

function renderSeasonSlidePlayer(stats, seasonRounds, index) {
  return `
    <section class="season-slide-player ${index === 0 ? "is-season-leader" : ""}">
      <div class="season-slide-player-name">
        <span>${index + 1}</span>
        <div>
          <h4>${escapeHtml(stats.name)}</h4>
          <small>${formatPercent(stats.wins / seasonRounds)} win rate</small>
        </div>
      </div>
      <div class="season-slide-stat">
        <span>Total</span>
        <strong>${formatNumber(stats.total)}</strong>
      </div>
      <div class="season-slide-stat">
        <span>Average</span>
        <strong>${formatAverage(stats.average)}</strong>
      </div>
      <div class="season-slide-stat">
        <span>Wins</span>
        <strong>${stats.wins}</strong>
      </div>
    </section>
  `;
}

function setupSeasonSlideshow() {
  if (seasonSlideshowTimer) {
    window.clearInterval(seasonSlideshowTimer);
    seasonSlideshowTimer = null;
  }

  const slideshow = seasonStats.querySelector("[data-season-slideshow]");
  if (!slideshow) {
    return;
  }

  const triggers = [...slideshow.querySelectorAll("[data-season-index]")];
  const slides = [...slideshow.querySelectorAll("[data-season-slide-panel]")];
  let activeIndex = triggers.findIndex((trigger) => trigger.classList.contains("is-active"));

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  const setSlide = (nextIndex) => {
    activeIndex = (nextIndex + triggers.length) % triggers.length;

    triggers.forEach((trigger, index) => {
      const isActive = index === activeIndex;
      trigger.classList.toggle("is-active", isActive);
      trigger.setAttribute("aria-selected", isActive ? "true" : "false");
      trigger.tabIndex = isActive ? 0 : -1;
    });

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
  };

  triggers.forEach((trigger, index) => {
    trigger.addEventListener("mouseenter", () => setSlide(index));
    trigger.addEventListener("focus", () => setSlide(index));
    trigger.addEventListener("click", () => setSlide(index));
  });

  slideshow.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    setSlide(activeIndex + direction);
    triggers[activeIndex].focus();
  });

  const shouldAutoRotate =
    triggers.length > 1 &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!shouldAutoRotate) {
    return;
  }

  const startTimer = () => {
    if (seasonSlideshowTimer) {
      window.clearInterval(seasonSlideshowTimer);
    }
    seasonSlideshowTimer = window.setInterval(() => setSlide(activeIndex + 1), 5500);
  };
  const stopTimer = () => {
    if (seasonSlideshowTimer) {
      window.clearInterval(seasonSlideshowTimer);
      seasonSlideshowTimer = null;
    }
  };

  slideshow.addEventListener("mouseenter", stopTimer);
  slideshow.addEventListener("mouseleave", startTimer);
  slideshow.addEventListener("focusin", stopTimer);
  slideshow.addEventListener("focusout", startTimer);
  startTimer();
}

function renderVisualisations() {
  const allRounds = getVisualRounds();
  const periods = getStatsPeriods(allRounds);

  if (!periods.some((period) => period.id === state.statsPeriod)) {
    state.statsPeriod = "all";
  }

  const selectedPeriod = periods.find((period) => period.id === state.statsPeriod) || periods[0];
  const rounds = getRoundsForStatsPeriod(allRounds, state.statsPeriod);

  renderStatsPeriodDock(periods);
  renderStatsSummary(rounds, selectedPeriod);
  renderStatsBreakdown(rounds);
  renderStatsRecords(rounds, selectedPeriod);

  if (rounds.length < 2) {
    trendLegend.innerHTML = "";
    trendChart.innerHTML = '<div class="empty-state">Select a period with at least two rounds to draw trends.</div>';
    marginChart.innerHTML = '<div class="empty-state">Select a period with at least two rounds to draw winning margins.</div>';
    trendInsights.innerHTML = '<div class="empty-state">Recent form needs at least two rounds in this period.</div>';
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
  marginChart.innerHTML = renderWinningMarginChart(rounds);
  trendInsights.innerHTML = renderTrendInsights(rounds);
}

function getStatsPeriods(rounds) {
  const years = new Map();
  const months = new Map();

  rounds.forEach((round) => {
    if (Number.isFinite(round.year)) {
      years.set(round.year, (years.get(round.year) || 0) + 1);
    }

    if (round.date) {
      const monthKey = round.date.slice(0, 7);
      months.set(monthKey, (months.get(monthKey) || 0) + 1);
    }
  });

  const yearPeriods = [...years.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, count]) => ({
      id: `year-${year}`,
      type: "year",
      label: String(year),
      detail: getPeriodRoundLabel(count),
    }));

  const monthPeriods = [...months.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([monthKey, count]) => ({
      id: `month-${monthKey}`,
      type: "month",
      label: formatMonthLabel(monthKey),
      detail: getPeriodRoundLabel(count),
    }));

  return [
    {
      id: "all",
      type: "all",
      label: "All",
      detail: getPeriodRoundLabel(rounds.length),
    },
    ...yearPeriods,
    ...monthPeriods,
  ];
}

function getRoundsForStatsPeriod(rounds, periodId) {
  if (periodId === "all") {
    return rounds;
  }

  if (periodId.startsWith("year-")) {
    const year = Number(periodId.replace("year-", ""));
    return rounds.filter((round) => round.year === year);
  }

  if (periodId.startsWith("month-")) {
    const monthKey = periodId.replace("month-", "");
    return rounds.filter((round) => round.date?.startsWith(`${monthKey}-`));
  }

  return rounds;
}

function renderStatsPeriodDock(periods) {
  if (!statsPeriodDock) {
    return;
  }

  statsPeriodDock.innerHTML = periods
    .map(
      (period) => `
        <button
          class="stats-period-button ${period.id === state.statsPeriod ? "is-active" : ""}"
          type="button"
          data-stats-period="${escapeHtml(period.id)}"
          data-period-type="${escapeHtml(period.type)}"
          aria-pressed="${period.id === state.statsPeriod}"
        >
          <span>${escapeHtml(period.label)}</span>
          <small>${escapeHtml(period.detail)}</small>
        </button>
      `,
    )
    .join("");
}

function renderStatsSummary(rounds, period) {
  if (!statsSummary) {
    return;
  }

  if (!rounds.length) {
    statsSummary.innerHTML = '<div class="empty-state">No rounds in this period yet.</div>';
    return;
  }

  const snapshot = buildStatsSnapshot(rounds);
  const leader = snapshot.players[0];
  const second = snapshot.players[1];
  const averageLeader = [...snapshot.players].sort((a, b) => a.average - b.average)[0];
  const gap = leader && second ? second.total - leader.total : 0;
  const leaderDetail = gap > 0 ? `${formatNumber(gap)} points ahead` : "Level on total";

  statsSummary.innerHTML = `
    <article class="stats-summary-card">
      <span>Period</span>
      <strong>${formatNumber(rounds.length)}</strong>
      <small>${escapeHtml(period?.label || "Selected")} - ${escapeHtml(getRoundRangeLabel(rounds))}</small>
    </article>
    <article class="stats-summary-card is-leader">
      <span>Leader</span>
      <strong>${escapeHtml(leader?.name || "-")}</strong>
      <small>${escapeHtml(leaderDetail)}</small>
    </article>
    <article class="stats-summary-card">
      <span>Best average</span>
      <strong>${escapeHtml(averageLeader?.name || "-")}</strong>
      <small>${averageLeader ? formatAverage(averageLeader.average) : "-"} points per round</small>
    </article>
    <article class="stats-summary-card">
      <span>Avg margin</span>
      <strong>${formatAverage(snapshot.averageMargin)}</strong>
      <small>${snapshot.draws} draw${snapshot.draws === 1 ? "" : "s"} in period</small>
    </article>
  `;
}

function renderStatsBreakdown(rounds) {
  if (!statsBreakdown) {
    return;
  }

  if (!rounds.length) {
    statsBreakdown.innerHTML = '<div class="empty-state">No player stats in this period.</div>';
    return;
  }

  const snapshot = buildStatsSnapshot(rounds);

  statsBreakdown.innerHTML = `
    <div class="stats-player-table" role="table" aria-label="Player statistics">
      <div class="stats-player-table-head" role="row">
        <span>Rank</span>
        <span>Player</span>
        <span>Total</span>
        <span>Average</span>
        <span>Wins</span>
        <span>Win rate</span>
        <span>Best</span>
        <span>Median</span>
        <span>Streak</span>
      </div>
      ${snapshot.players
        .map(
          (player, index) => `
            <article class="stats-player-row ${index === 0 ? "is-leader" : ""}" role="row">
              <div class="stats-rank" role="cell">
                <span>#</span>
                <strong>${index + 1}</strong>
              </div>
              <div class="stats-player-main" role="cell">
                <span class="player-dot is-${player.name.toLowerCase()}"></span>
                <div>
                  <strong>${escapeHtml(player.name)}</strong>
                  <small>${index === 0 ? "First in period" : `${formatNumber(player.total - snapshot.players[0].total)} behind`}</small>
                </div>
              </div>
              ${renderStatsCell("Total", formatNumber(player.total))}
              ${renderStatsCell("Average", formatAverage(player.average))}
              ${renderStatsCell("Wins", formatNumber(player.wins))}
              ${renderStatsCell("Win rate", formatPercent(player.wins / Math.max(1, rounds.length)))}
              ${renderStatsCell("Best", formatNullableNumber(player.best))}
              ${renderStatsCell("Median", formatAverage(player.median))}
              ${renderStatsCell("Streak", `${player.currentStreak} now`, `${player.longestStreak} best`)}
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderStatsCell(label, value, detail = "") {
  return `
    <div class="stats-cell" role="cell">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      ${detail ? `<small>${escapeHtml(detail)}</small>` : ""}
    </div>
  `;
}

function renderStatsRecords(rounds, period) {
  if (!statsRecords) {
    return;
  }

  if (statsRecordsLabel) {
    statsRecordsLabel.textContent = period?.label || "Selected period";
  }

  if (!rounds.length) {
    statsRecords.innerHTML = '<div class="empty-state">No records in this period yet.</div>';
    return;
  }

  const snapshot = buildStatsSnapshot(rounds);
  const records = [
    {
      label: "Best single round",
      value: snapshot.bestScore
        ? `${snapshot.bestScore.name} ${formatNumber(snapshot.bestScore.score)}`
        : "-",
      detail: snapshot.bestScore?.round.label || "",
    },
    {
      label: "Worst single round",
      value: snapshot.worstScore
        ? `${snapshot.worstScore.name} ${formatNumber(snapshot.worstScore.score)}`
        : "-",
      detail: snapshot.worstScore?.round.label || "",
    },
    {
      label: "Biggest win",
      value: snapshot.biggestMargin
        ? getMarginRecordValue(snapshot.biggestMargin)
        : "-",
      detail: snapshot.biggestMargin ? getRoundScoreLabel(snapshot.biggestMargin.round) : "",
    },
    {
      label: "Closest win",
      value: snapshot.closestMargin
        ? getMarginRecordValue(snapshot.closestMargin)
        : "No decided rounds",
      detail: snapshot.closestMargin ? getRoundScoreLabel(snapshot.closestMargin.round) : "",
    },
  ];

  statsRecords.innerHTML = `
    <div class="stats-record-list">
      ${records
        .map(
          (record) => `
            <article class="stats-record">
              <span>${escapeHtml(record.label)}</span>
              <strong>${escapeHtml(record.value)}</strong>
              <small>${escapeHtml(record.detail)}</small>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function buildStatsSnapshot(rounds) {
  const players = Object.keys(getPlayerColors());
  const streaks = getStreakStatsByPlayer(rounds);
  const scoreEntries = rounds.flatMap((round) =>
    players
      .map((name) => ({
        name,
        round,
        score: round.scores[name],
      }))
      .filter((entry) => Number.isFinite(entry.score)),
  );
  const margins = rounds
    .map((round) => ({
      round,
      winner: getWinnerFromScores(round.scores),
      margin: Math.abs(round.scores.Trym - round.scores.Nicolai),
    }))
    .filter((item) => Number.isFinite(item.margin));
  const playerStats = players
    .map((name) => {
      const scores = rounds.map((round) => round.scores[name]).filter((score) => Number.isFinite(score));
      const best = scores.length ? Math.min(...scores) : null;
      const worst = scores.length ? Math.max(...scores) : null;

      return {
        name,
        total: scores.reduce((total, score) => total + score, 0),
        rounds: scores.length,
        average: average(scores),
        median: median(scores),
        best,
        worst,
        wins: rounds.filter((round) => getWinnerFromScores(round.scores) === name).length,
        currentStreak: streaks[name]?.current || 0,
        longestStreak: streaks[name]?.longest || 0,
      };
    })
    .sort((a, b) => a.total - b.total || a.average - b.average || b.wins - a.wins);

  return {
    players: playerStats,
    draws: rounds.filter((round) => getWinnerFromScores(round.scores) === null).length,
    averageMargin: average(margins.map((item) => item.margin)),
    bestScore: [...scoreEntries].sort((a, b) => a.score - b.score)[0] || null,
    worstScore: [...scoreEntries].sort((a, b) => b.score - a.score)[0] || null,
    biggestMargin: [...margins].sort((a, b) => b.margin - a.margin)[0] || null,
    closestMargin:
      [...margins].filter((item) => item.margin > 0).sort((a, b) => a.margin - b.margin)[0] || null,
  };
}

function getPeriodRoundLabel(count) {
  return `${formatNumber(count)} round${count === 1 ? "" : "s"}`;
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

function getRoundRangeLabel(rounds) {
  const datedRounds = rounds.filter((round) => round.date).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const importedWithoutDate = rounds.length - datedRounds.length;

  if (!datedRounds.length) {
    return "Imported history";
  }

  if (datedRounds.length === 1) {
    return formatDate(datedRounds[0].date);
  }

  const range = `${formatDate(datedRounds[0].date)} to ${formatDate(datedRounds[datedRounds.length - 1].date)}`;
  return importedWithoutDate ? `${range} + ${formatNumber(importedWithoutDate)} imported` : range;
}

function formatNullableNumber(value) {
  return Number.isFinite(value) ? formatNumber(value) : "-";
}

function getRoundScoreLabel(round) {
  return `Trym ${formatNumber(round.scores.Trym)}, Nicolai ${formatNumber(round.scores.Nicolai)}`;
}

function getMarginRecordValue(record) {
  return record.winner ? `${record.winner} by ${formatNumber(record.margin)}` : "Draw";
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

function renderWinningMarginChart(rounds) {
  const recentRounds = rounds.slice(-16);
  const colors = getPlayerColors();
  const width = 640;
  const height = 310;
  const padding = {
    top: 44,
    right: 28,
    bottom: 42,
    left: 28,
  };
  const centerX = width / 2;
  const plotWidth = width - padding.left - padding.right;
  const halfWidth = plotWidth / 2 - 16;
  const plotHeight = height - padding.top - padding.bottom;
  const rowHeight = plotHeight / recentRounds.length;
  const maxMargin = Math.max(
    10,
    ...recentRounds.map((round) => Math.abs(round.scores.Trym - round.scores.Nicolai)),
  );
  const wins = {
    Trym: recentRounds.filter((round) => getWinnerFromScores(round.scores) === "Trym").length,
    Nicolai: recentRounds.filter((round) => getWinnerFromScores(round.scores) === "Nicolai").length,
  };
  const draws = recentRounds.length - wins.Trym - wins.Nicolai;
  const marginScale = (margin) => (margin / maxMargin) * halfWidth;
  const bars = recentRounds
    .map((round, index) => {
      const trymScore = round.scores.Trym;
      const nicolaiScore = round.scores.Nicolai;
      const winner = getWinnerFromScores(round.scores);
      const margin = Math.abs(trymScore - nicolaiScore);
      const barWidth = Math.max(winner ? 3 : 10, marginScale(margin));
      const barHeight = Math.max(6, Math.min(14, rowHeight * 0.48));
      const y = padding.top + index * rowHeight + (rowHeight - barHeight) / 2;
      const x = winner === "Trym" ? centerX - barWidth : centerX;
      const fill = winner ? colors[winner] : "rgba(231, 243, 255, 0.5)";
      const label = winner ? `${winner} by ${margin}` : "Draw";
      const scoreLabel = `Trym ${trymScore}, Nicolai ${nicolaiScore}`;

      return `
        <g>
          <title>${escapeHtml(`${round.label}: ${scoreLabel} (${label})`)}</title>
          <rect
            class="margin-bar ${winner ? `is-${winner.toLowerCase()}` : "is-draw"}"
            x="${x.toFixed(2)}"
            y="${y.toFixed(2)}"
            width="${barWidth.toFixed(2)}"
            height="${barHeight.toFixed(2)}"
            rx="4"
            fill="${fill}"
          ></rect>
          <circle
            class="margin-dot ${winner ? `is-${winner.toLowerCase()}` : "is-draw"}"
            cx="${winner === "Trym" ? (centerX - barWidth).toFixed(2) : (centerX + barWidth).toFixed(2)}"
            cy="${(y + barHeight / 2).toFixed(2)}"
            r="3"
            fill="${fill}"
          ></circle>
        </g>
      `;
    })
    .join("");
  const tickLabels = [0, Math.round(maxMargin / 2), maxMargin]
    .map((value) => {
      const offset = marginScale(value);

      return `
        <g>
          <line class="margin-grid-line" x1="${centerX - offset}" x2="${centerX - offset}" y1="${padding.top}" y2="${height - padding.bottom}"></line>
          <line class="margin-grid-line" x1="${centerX + offset}" x2="${centerX + offset}" y1="${padding.top}" y2="${height - padding.bottom}"></line>
          <text class="chart-axis-text" x="${centerX + offset}" y="${height - 16}" text-anchor="middle">${value}</text>
          ${value ? `<text class="chart-axis-text" x="${centerX - offset}" y="${height - 16}" text-anchor="middle">${value}</text>` : ""}
        </g>
      `;
    })
    .join("");
  const latestRound = recentRounds[recentRounds.length - 1];
  const latestWinner = latestRound ? getWinnerFromScores(latestRound.scores) : null;
  const latestDescription = latestRound
    ? latestWinner
      ? `${latestRound.label}: ${latestWinner} won by ${Math.abs(latestRound.scores.Trym - latestRound.scores.Nicolai)}.`
      : `${latestRound.label}: draw.`
    : "";
  const description = `Last ${recentRounds.length} completed rounds. Trym has ${wins.Trym} wins, Nicolai has ${wins.Nicolai} wins, and there ${draws === 1 ? "is" : "are"} ${draws} draw${draws === 1 ? "" : "s"}. ${latestDescription}`;

  return `
    <svg class="margin-svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="marginChartTitle marginChartDesc">
      <title id="marginChartTitle">Recent winning margins</title>
      <desc id="marginChartDesc">${escapeHtml(description)}</desc>
      <rect class="chart-plot-bg" x="${padding.left}" y="${padding.top}" width="${plotWidth}" height="${plotHeight}" rx="6"></rect>
      <rect class="margin-side-fill is-trym" x="${padding.left}" y="${padding.top}" width="${centerX - padding.left}" height="${plotHeight}"></rect>
      <rect class="margin-side-fill is-nicolai" x="${centerX}" y="${padding.top}" width="${width - padding.right - centerX}" height="${plotHeight}"></rect>
      <text class="margin-player-label is-trym" x="${padding.left}" y="24" text-anchor="start">Trym: ${wins.Trym} wins</text>
      <text class="margin-player-label is-nicolai" x="${width - padding.right}" y="24" text-anchor="end">Nicolai: ${wins.Nicolai} wins</text>
      ${draws ? `<text class="margin-draw-label" x="${centerX}" y="24" text-anchor="middle">${draws} draw${draws === 1 ? "" : "s"}</text>` : ""}
      ${tickLabels}
      <line class="margin-center-line" x1="${centerX}" x2="${centerX}" y1="${padding.top - 6}" y2="${height - padding.bottom + 6}"></line>
      <text class="margin-recency-label" x="${padding.left + 8}" y="${padding.top + 16}" text-anchor="start">Older</text>
      <text class="margin-recency-label" x="${padding.left + 8}" y="${height - padding.bottom - 8}" text-anchor="start">Latest</text>
      ${bars}
    </svg>
  `;
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
  const chartId = getSvgId(className || "line-chart");
  const seriesSummary = series
    .map((item) => {
      const latestPoint = item.points[item.points.length - 1];
      return latestPoint ? `${item.name} latest ${formatAverage(latestPoint.value)}` : item.name;
    })
    .join("; ");
  const description = `${yLabel} trend chart across ${xRange + 1} rounds. ${seriesSummary}. Lower scores are better.`;

  return `
    <svg class="${className}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${chartId}Title ${chartId}Desc">
      <title id="${chartId}Title">${escapeHtml(yLabel)} trend chart</title>
      <desc id="${chartId}Desc">${escapeHtml(description)}</desc>
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

function getSvgId(value) {
  return String(value || "chart")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "") || "chart";
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
    Trym: "var(--player-trym)",
    Nicolai: "var(--player-nicolai)",
  };
}

function renderHistory() {
  historyList.innerHTML = "";

  if (state.loading) {
    historyList.innerHTML = '<div class="empty-state">Fetching Firestore rounds...</div>';
    return;
  }

  const historyRounds = getHistoryRounds();

  if (!historyRounds.length) {
    historyList.innerHTML = '<div class="empty-state">No rounds available yet.</div>';
    return;
  }

  historyRounds.forEach((historyRound) => {
    historyList.appendChild(
      historyRound.type === "imported"
        ? createImportedHistoryCard(historyRound.round)
        : createSavedHistoryCard(historyRound.round),
    );
  });
}

function getHistoryRounds() {
  const firestoreDates = new Set(state.rounds.map((round) => round.date).filter(Boolean));

  const importedRounds = HISTORICAL_ROUNDS
    .filter((round) => !round.date || !firestoreDates.has(round.date))
    .map((round, index) => ({
      type: "imported",
      round,
      order: index,
      sortValue: getHistorySortValue(round, index),
    }));
  const savedRounds = state.rounds.map((round, index) => ({
    type: "saved",
    round,
    order: HISTORICAL_ROUNDS.length + index,
    sortValue: getHistorySortValue(round, HISTORICAL_ROUNDS.length + index),
  }));

  return [...importedRounds, ...savedRounds].sort(
    (a, b) => b.sortValue - a.sortValue || b.order - a.order,
  );
}

function getHistorySortValue(round, fallbackOrder) {
  if (round.date) {
    const timestamp = new Date(`${round.date}T00:00:00`).getTime();
    if (Number.isFinite(timestamp)) {
      return timestamp;
    }
  }

  if (Number.isFinite(Number(round.year))) {
    return new Date(`${round.year}-01-01T00:00:00`).getTime() + fallbackOrder;
  }

  return fallbackOrder;
}

function createSavedHistoryCard(round) {
  const winnerName = getUniqueWinnerName(round.players);
  const isComplete = isRoundComplete(round);
  const configuredPlayers = getConfiguredPlayers();
  const submittedPlayers = getSubmittedPlayerNames(round);
  const submittedCount = configuredPlayers.filter((playerName) =>
    submittedPlayers.has(canonicalizePlayerName(playerName)),
  ).length;
  const participantCount = configuredPlayers.length;
  const card = document.createElement("article");
  card.className = "history-card";
  card.innerHTML = `
      <div class="history-top">
        <div>
          <p class="round-date">${formatDate(round.date)}</p>
          <h3 class="round-category">${escapeHtml(round.category)}</h3>
        </div>
        <div class="history-actions">
          <span class="submission-badge">${submittedCount}/${participantCount} saved</span>
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
  return card;
}

function createImportedHistoryCard(round) {
  const scores = {
    Trym: round.trym,
    Nicolai: round.nicolai,
  };
  const winnerName = getWinnerFromScores(scores);
  const players = orderPlayersForDisplay([
    { name: "Trym", total: scores.Trym },
    { name: "Nicolai", total: scores.Nicolai },
  ]);
  const card = document.createElement("article");
  card.className = "history-card history-card-imported";
  card.innerHTML = `
      <div class="history-top">
        <div>
          <p class="round-date">${escapeHtml(round.date ? formatDate(round.date) : round.label)}</p>
          <h3 class="round-category">Imported Excel round</h3>
        </div>
        <div class="history-actions">
          <span class="submission-badge">Excel import</span>
        </div>
      </div>
      <div class="history-players">
        ${players.map((player) => renderImportedHistoryPlayer(player, player.name === winnerName)).join("")}
      </div>
    `;
  return card;
}

function renderImportedHistoryPlayer(player, isWinner) {
  return `
    <section class="history-player ${isWinner ? "is-winner" : ""}">
      <div class="history-player-header">
        <h3 class="history-player-name">${escapeHtml(player.name)}</h3>
        ${isWinner ? '<span class="winner-badge">Winner</span>' : ""}
      </div>
      <p class="history-score-note">Imported total only</p>
      <div class="history-total">
        <span>Total</span>
        <strong>${formatNumber(player.total)}</strong>
      </div>
    </section>
  `;
}

function renderPrivateRoundState(round) {
  const missingPlayers = getMissingPlayersForRound(round);

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
              <li class="${answer.wrong ? "is-wrong" : answer.perfect ? "is-perfect" : ""}">
                <span>${escapeHtml(answer.answer)}</span>
                <span>${getAnswerHistoryScoreLabel(answer)}</span>
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

function getAnswerHistoryScoreLabel(answer) {
  if (answer.wrong) {
    return "Wrong · 100";
  }

  if (answer.perfect) {
    return "Perfect · 0";
  }

  return String(answer.points);
}

function normalizeRound(round) {
  const players = Array.isArray(round.players) ? round.players : [];
  const date = normalizeDateValue(round.date) || normalizeDateValue(round.id) || getToday();

  return {
    id: String(round.id || date),
    date,
    category: String(round.category || "Untitled round"),
    createdAt: String(round.createdAt || ""),
    players: players.slice(0, 2).map((player, playerIndex) => {
      const answers = Array.isArray(player.answers) ? player.answers : [];
      const normalizedAnswers = Array.from({ length: ANSWERS_PER_PLAYER }, (_, answerIndex) => {
        const answer = answers[answerIndex] || {};
        const wrong = Boolean(answer.wrong);

        return {
          answer: String(answer.answer || `Answer ${answerIndex + 1}`),
          wrong,
          perfect: Boolean(answer.perfect),
          points: wrong ? 100 : parsePoints(answer.points),
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

function getTrackedRoundCount() {
  const incompleteFirestoreRounds = state.rounds.filter((round) => !isRoundComplete(round)).length;
  return getVisualRounds().length + incompleteFirestoreRounds;
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

function getConfiguredPlayers() {
  return normalizePlayers(state.players);
}

function getSubmittedPlayerNames(round) {
  return new Set(round.players.map((player) => canonicalizePlayerName(player.name)).filter(Boolean));
}

function getMissingPlayersForRound(round) {
  const submittedPlayers = getSubmittedPlayerNames(round);
  return getConfiguredPlayers().filter(
    (playerName) => !submittedPlayers.has(canonicalizePlayerName(playerName)),
  );
}

function isRoundComplete(round) {
  return getMissingPlayersForRound(round).length === 0;
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

  syncCategoryForSelectedDate();

  buttons.forEach((button) => {
    const card = button.closest(".player-card");
    const playerIndex = Number(card?.dataset.playerIndex || 0);
    const playerName =
      canonicalizePlayerName(card?.querySelector(".player-name")?.value) ||
      DEFAULT_PLAYERS[playerIndex];
    const existingEntry = getExistingPlayerEntryForDate(selectedDate, playerName);
    const isSavingThisPlayer = state.savingPlayer === playerName;
    const isSavingAnotherPlayer = Boolean(state.savingPlayer) && !isSavingThisPlayer;
    const isImportingThisPlayer = state.importingPlayerIndex === playerIndex;
    const isImportingAnotherPlayer =
      state.importingPlayerIndex !== null && !isImportingThisPlayer;
    const inputsLocked = Boolean(existingEntry) || isImportingThisPlayer;

    if (existingEntry) {
      clearPlayerInputs(playerIndex);
    }
    card.classList.toggle("is-submitted", Boolean(existingEntry));
    card.querySelectorAll(".answer-input, .answer-status-toggle").forEach((input) => {
      input.disabled = inputsLocked;
    });
    card.querySelectorAll(".answer-row").forEach((row) => {
      row.querySelector(".points-input").disabled = inputsLocked || isAnswerWrong(row);
    });
    updateScreenshotImportAvailability(
      card,
      Boolean(existingEntry) ||
        isSavingAnotherPlayer ||
        isSavingThisPlayer ||
        isImportingAnotherPlayer ||
        isImportingThisPlayer,
    );
    button.disabled =
      isSavingAnotherPlayer || isSavingThisPlayer || isImportingThisPlayer || Boolean(existingEntry);
    button.textContent = isImportingThisPlayer
      ? "Reading screenshot..."
      : isSavingThisPlayer
        ? "Saving..."
        : `Save ${playerName}`;
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
  const screenshotTotal = Number(card?.dataset.screenshotTotal);
  if (Number.isFinite(screenshotTotal)) {
    return screenshotTotal;
  }

  return [...card.querySelectorAll(".points-input")].reduce(
    (total, input) => total + parsePoints(input.value),
    0,
  );
}

function getPlayerTotalFromCard(card, answers) {
  const screenshotTotal = Number(card?.dataset.screenshotTotal);
  return Number.isFinite(screenshotTotal) ? screenshotTotal : sumAnswers(answers);
}

function clearScreenshotTotalOverride(card) {
  if (!card) {
    return;
  }

  delete card.dataset.screenshotTotal;
}

function clearPerfectAnswerState(row) {
  if (!row) {
    return;
  }

  row.dataset.perfect = "false";
  row.classList.remove("is-perfect");
}

function updatePlayerCardTotal(card) {
  if (!card) {
    return;
  }

  card.querySelector(".player-total strong").textContent = String(calculateCardTotal(card));
}

function isAnswerWrong(row) {
  return row.dataset.wrong === "true";
}

function setAnswerWrongState(row, isWrong, options = {}) {
  const statusButton = row.querySelector(".answer-status-toggle");
  const pointsInput = row.querySelector(".points-input");
  const answerNumber = row.dataset.answerNumber || "";
  const answerLabel = answerNumber ? `answer ${answerNumber}` : "this answer";

  row.dataset.wrong = String(isWrong);
  row.classList.toggle("is-wrong", isWrong);
  if (isWrong || !options.keepPerfect) {
    clearPerfectAnswerState(row);
  }
  statusButton.setAttribute("aria-pressed", String(isWrong));
  statusButton.setAttribute(
    "aria-label",
    isWrong ? `Mark ${answerLabel} as correct` : `Mark ${answerLabel} as wrong`,
  );
  statusButton.textContent = isWrong ? "Wrong" : "Correct";
  statusButton.title = isWrong
    ? "Marked wrong. This answer is automatically worth 100 points."
    : "Marked correct. Enter the points manually.";

  if (isWrong) {
    pointsInput.value = "100";
    pointsInput.disabled = true;
    row.dataset.autoWrongPoints = "true";
    return;
  }

  pointsInput.disabled = false;

  if (!options.initial && row.dataset.autoWrongPoints === "true") {
    pointsInput.value = "";
  }

  delete row.dataset.autoWrongPoints;
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
