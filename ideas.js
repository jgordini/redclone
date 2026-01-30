/**
 * ============================================================================
 * CONFIGURATION - UPDATE THESE VALUES!
 * ============================================================================
 */
const SUPABASE_URL = "https://wzqfdjyxfknfxqsvgotx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_UqsYpCg-RVDc9XsdYVp3Ow_ZlTfOSbC";

/**
 * ============================================================================
 * CORE FUNCTIONS - DO NOT EDIT BELOW THIS LINE
 * ============================================================================
 */

// Initialize Supabase client
let supabase;
try {
  supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
} catch (error) {
  console.error("Failed to initialize Supabase:", error);
}

/**
 * Voter ID Management
 */
function getVoterId() {
  const VOTER_ID_KEY = "redclone_voter_id";
  let voterId = localStorage.getItem(VOTER_ID_KEY);
  if (!voterId) {
    voterId = generateVoterId();
    localStorage.setItem(VOTER_ID_KEY, voterId);
  }
  return voterId;
}

function generateVoterId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `voter_${timestamp}_${randomStr}`;
}

function getVotedIdeas() {
  const VOTED_IDEAS_KEY = "redclone_voted_ideas";
  const votedIdeas = localStorage.getItem(VOTED_IDEAS_KEY);
  return votedIdeas ? new Set(JSON.parse(votedIdeas)) : new Set();
}

function markIdeaAsVoted(ideaId) {
  const VOTED_IDEAS_KEY = "redclone_voted_ideas";
  const votedIdeas = getVotedIdeas();
  votedIdeas.add(ideaId);
  localStorage.setItem(VOTED_IDEAS_KEY, JSON.stringify([...votedIdeas]));
}

function hasVoted(ideaId) {
  const votedIdeas = getVotedIdeas();
  return votedIdeas.has(ideaId);
}

/**
 * Simple built-in profanity filter
 */
const BLOCKED_WORDS = [
  "shit",
  "piss",
  "fuck",
  "cunt",
  "cocksucker",
  "motherfucker",
  "tits",
  "fck",
  "fuk",
  "fuc",
  "shit",
  "sht",
  "cnt",
  "btch",
  "bitch",
  "nigger",
  "nigga",
  "nig",
  "chink",
  "spic",
  "kike",
  "wetback",
  "beaner",
  "gook",
  "jap",
  "towelhead",
  "raghead",
  "sandnigger",
];

function initProfanityFilter() {
  console.log(
    "✓ Profanity filter initialized with",
    BLOCKED_WORDS.length,
    "blocked words"
  );
  return true;
}

function containsProfanity(text) {
  const lowerText = text.toLowerCase();
  const cleanedText = lowerText.replace(/[*@#$%]/g, "").replace(/\s+/g, " ");

  for (const word of BLOCKED_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    if (regex.test(lowerText) || cleanedText.includes(word)) {
      console.log("Blocked word detected:", word);
      return true;
    }
  }
  return false;
}

/**
 * Get Cloudflare Turnstile token
 */
function getTurnstileToken() {
  try {
    const turnstileElement = document.querySelector(".cf-turnstile");
    if (!turnstileElement) {
      console.warn("Turnstile element not found");
      return "bypass";
    }
    if (typeof turnstile === "undefined") {
      console.warn("Turnstile API not loaded");
      return "bypass";
    }
    const response = turnstile.getResponse();
    console.log("Turnstile token:", response ? "received" : "empty");
    return response || null;
  } catch (error) {
    console.error("Error getting Turnstile token:", error);
    return "bypass";
  }
}

/**
 * UI Functions
 */
function formatRelativeTime(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval !== 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

function renderIdeaCard(idea) {
  const voted = hasVoted(idea.id);
  const voteCount = idea.vote_count || 0;
  const relativeTime = formatRelativeTime(idea.created_at);

  const cardHtml = `
        <div class="tw-bg-white tw-border tw-border-gray-200 hover:tw-border-gray-300 tw-mb-2 tw-flex idea-card fade-in" data-idea-id="${
          idea.id
        }">
            <div class="tw-flex tw-flex-col tw-items-center tw-px-3 tw-py-2 upvote-section">
                <button
                    class="upvote-btn tw-transition-all ${
                      voted
                        ? "upvote-voted tw-bg-campus-green tw-text-white tw-w-8 tw-h-8 tw-rounded-full tw-flex tw-items-center tw-justify-center"
                        : "upvote-unvoted tw-text-gray-400 hover:tw-text-campus-green tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center"
                    }"
                    onclick="handleUpvote('${idea.id}')"
                    ${voted ? "disabled" : ""}
                    aria-label="Upvote this idea"
                >
                    <i class="fas fa-arrow-up tw-text-base"></i>
                </button>
                <span class="tw-text-xs tw-font-bold tw-mt-1 vote-count ${
                  voted ? "tw-text-campus-green" : "tw-text-gray-700"
                }">${voteCount}</span>
            </div>
            <div class="tw-flex-1 tw-px-4 tw-py-3">
                <p class="tw-text-sm tw-leading-normal tw-mb-1 tw-text-gray-900">${escapeHtml(
                  idea.content
                )}</p>
                <p class="tw-text-xs tw-text-gray-500">
                    <i class="fas fa-clock tw-mr-1"></i> ${relativeTime}
                </p>
            </div>
        </div>
    `;
  return cardHtml;
}

function renderIdeasList(ideas, animate = false) {
  const ideasList = document.getElementById("ideasList");
  const loadingState = document.getElementById("loadingState");
  const emptyState = document.getElementById("emptyState");

  if (!animate) {
    loadingState.classList.add("tw-hidden");
  }

  if (!ideas || ideas.length === 0) {
    emptyState.classList.remove("tw-hidden");
    ideasList.innerHTML = "";
    return;
  }

  emptyState.classList.add("tw-hidden");

  if (animate && ideasList.children.length > 0) {
    const oldPositions = new Map();
    const existingElements = new Map();

    Array.from(ideasList.children).forEach((card) => {
      const ideaId = card.dataset.ideaId;
      oldPositions.set(ideaId, card.getBoundingClientRect());
      existingElements.set(ideaId, card);
    });

    const orderedIds = ideas.map((idea) => idea.id);

    orderedIds.forEach((ideaId, newIndex) => {
      const card = existingElements.get(ideaId);
      if (card) {
        const idea = ideas[newIndex];
        const voteCountEl = card.querySelector(".vote-count");
        if (voteCountEl && idea) {
          voteCountEl.textContent = idea.vote_count || 0;
        }
        if (ideasList.children[newIndex] !== card) {
          ideasList.insertBefore(card, ideasList.children[newIndex] || null);
        }
      }
    });

    requestAnimationFrame(() => {
      orderedIds.forEach((ideaId) => {
        const card = existingElements.get(ideaId);
        if (!card) return;

        const oldPos = oldPositions.get(ideaId);
        if (!oldPos) return;

        const newPos = card.getBoundingClientRect();
        const deltaY = oldPos.top - newPos.top;

        if (Math.abs(deltaY) > 1) {
          card.style.transform = `translateY(${deltaY}px)`;
          card.style.transition = "none";
          void card.offsetHeight;

          requestAnimationFrame(() => {
            card.style.transform = "";
            card.style.transition =
              "transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)";
            card.classList.add("idea-reordering");
            setTimeout(() => {
              card.classList.remove("idea-reordering");
              card.style.transition = "";
            }, 1200);
          });
        }
      });
    });
  } else {
    ideasList.innerHTML = ideas.map((idea) => renderIdeaCard(idea)).join("");
  }
}

function showError(message) {
  const ideasContainer = document.getElementById("ideasContainer");
  const existingError = document.querySelector(".error-message");
  if (existingError) existingError.remove();

  const errorHtml = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <strong>Error:</strong> ${escapeHtml(message)}
        </div>
    `;
  ideasContainer.insertAdjacentHTML("afterbegin", errorHtml);

  setTimeout(() => {
    const errorElement = document.querySelector(".error-message");
    if (errorElement) errorElement.remove();
  }, 5000);
}

function showSuccess(message) {
  const ideasContainer = document.getElementById("ideasContainer");
  const existingSuccess = document.querySelector(".success-message");
  if (existingSuccess) existingSuccess.remove();

  const successHtml = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            ${escapeHtml(message)}
        </div>
    `;
  ideasContainer.insertAdjacentHTML("afterbegin", successHtml);

  setTimeout(() => {
    const successElement = document.querySelector(".success-message");
    if (successElement) successElement.remove();
  }, 3000);
}

function updateCharCount(currentLength, maxLength) {
  const charCount = document.getElementById("charCount");
  charCount.textContent = `${currentLength} / ${maxLength}`;
  charCount.classList.remove("char-count-warning", "char-count-error");

  if (currentLength >= maxLength) {
    charCount.classList.add("char-count-error");
  } else if (currentLength >= maxLength * 0.9) {
    charCount.classList.add("char-count-warning");
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showLoadingState() {
  const loadingState = document.getElementById("loadingState");
  const emptyState = document.getElementById("emptyState");
  const ideasList = document.getElementById("ideasList");

  loadingState.classList.remove("tw-hidden");
  emptyState.classList.add("tw-hidden");
  ideasList.innerHTML = "";
}

/**
 * App Functions
 */
let voterId;

async function loadIdeas(isReSort = false) {
  try {
    if (!isReSort) {
      showLoadingState();
    }

    const { data, error } = await supabase
      .from("ideas")
      .select("*")
      .order("vote_count", { ascending: false });

    if (error) {
      console.error("Error loading ideas:", error);
      showError("Failed to load ideas. Please refresh the page.");
      return;
    }

    renderIdeasList(data, isReSort);
  } catch (error) {
    console.error("Error loading ideas:", error);
    showError("Failed to load ideas. Please check your internet connection.");
  }
}

function setupFormHandlers() {
  const form = document.getElementById("ideaForm");
  const textarea = document.getElementById("ideaInput");

  textarea.addEventListener("input", () => {
    updateCharCount(textarea.value.length, 500);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await handleIdeaSubmission();
  });
}

async function handleIdeaSubmission() {
  const textarea = document.getElementById("ideaInput");
  const content = textarea.value.trim();
  const submitButton = document.querySelector(
    '#ideaForm button[type="submit"]'
  );

  if (!content) {
    showError("Please enter an idea before submitting.");
    return;
  }

  if (containsProfanity(content)) {
    showError(
      "Your submission contains inappropriate language. Please remove it and try again."
    );
    return;
  }

  const turnstileToken = getTurnstileToken();
  console.log("CAPTCHA check - Token:", turnstileToken);

  if (!turnstileToken || turnstileToken === "") {
    showError("Please complete the CAPTCHA verification first.");
    return;
  }

  submitButton.disabled = true;
  submitButton.innerHTML =
    '<i class="fas fa-spinner fa-spin tw-mr-2"></i> Submitting...';

  try {
    const { data, error } = await supabase
      .from("ideas")
      .insert([{ content: content, vote_count: 0 }])
      .select();

    if (error) {
      console.error("Error submitting idea:", error);
      showError("Failed to submit idea. Please try again.");
      return;
    }

    textarea.value = "";
    updateCharCount(0, 500);

    if (typeof turnstile !== "undefined") {
      turnstile.reset();
    }

    showSuccess("Your idea has been submitted!");
    await loadIdeas();
  } catch (error) {
    console.error("Error submitting idea:", error);
    showError("Failed to submit idea. Please check your internet connection.");

    if (typeof turnstile !== "undefined") {
      turnstile.reset();
    }
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = "Post";
  }
}

async function handleUpvote(ideaId) {
  if (hasVoted(ideaId)) {
    showError("You have already voted on this idea.");
    return;
  }

  try {
    const card = document.querySelector(`[data-idea-id="${ideaId}"]`);
    if (card) {
      const upvoteButton = card.querySelector(".upvote-btn");
      const voteCountEl = card.querySelector(".vote-count");

      if (upvoteButton && voteCountEl) {
        upvoteButton.disabled = true;
        upvoteButton.classList.remove(
          "upvote-unvoted",
          "tw-text-gray-400",
          "hover:tw-text-campus-green"
        );
        upvoteButton.classList.add(
          "upvote-voted",
          "tw-bg-campus-green",
          "tw-text-white"
        );
        voteCountEl.classList.add("tw-text-campus-green");
        voteCountEl.classList.remove("tw-text-gray-700");

        const currentCount = parseInt(voteCountEl.textContent) || 0;
        voteCountEl.textContent = currentCount + 1;
      }
    }

    const { error: voteError } = await supabase
      .from("votes")
      .insert([{ idea_id: ideaId, voter_fingerprint: voterId }]);

    if (voteError) {
      if (voteError.code === "23505") {
        showError("You have already voted on this idea.");
        markIdeaAsVoted(ideaId);
        return;
      }
      console.error("Error voting:", voteError);
      showError("Failed to submit vote. Please try again.");
      await loadIdeas(false);
      return;
    }

    markIdeaAsVoted(ideaId);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await loadIdeas(true);
  } catch (error) {
    console.error("Error voting:", error);
    showError("Failed to submit vote. Please check your internet connection.");
    await loadIdeas(false);
  }
}

function setupRealtimeSubscription() {
  try {
    const channel = supabase
      .channel("ideas-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ideas",
        },
        (payload) => {
          console.log("New idea received:", payload.new);
          loadIdeas();
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });
  } catch (error) {
    console.error("Error setting up realtime subscription:", error);
  }
}

async function initApp() {
  voterId = getVoterId();
  console.log("Voter ID:", voterId);

  initProfanityFilter();
  setupFormHandlers();
  await loadIdeas();
  setupRealtimeSubscription();
}

window.handleUpvote = handleUpvote;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
