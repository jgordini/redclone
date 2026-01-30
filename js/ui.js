/**
 * UI Rendering Functions
 * Handles DOM manipulation and rendering of ideas, states, and messages
 */

/**
 * Format timestamp to relative time (e.g., "2 hours ago")
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
            return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}

/**
 * Render a single idea card
 */
function renderIdeaCard(idea) {
    const voted = hasVoted(idea.id);
    const voteCount = idea.vote_count || 0;
    const relativeTime = formatRelativeTime(idea.created_at);

    const cardHtml = `
        <div class="tw-bg-white tw-border tw-border-gray-200 hover:tw-border-gray-300 tw-mb-2 tw-flex idea-card fade-in" data-idea-id="${idea.id}">
            <!-- Upvote section -->
            <div class="tw-flex tw-flex-col tw-items-center tw-bg-gray-50 tw-px-3 tw-py-2 upvote-section tw-border-r tw-border-gray-200">
                <button
                    class="upvote-btn tw-text-gray-400 hover:tw-text-campus-green tw-transition-colors tw-p-1 ${voted ? 'tw-text-campus-green' : ''}"
                    onclick="handleUpvote('${idea.id}')"
                    ${voted ? 'disabled' : ''}
                    aria-label="Upvote this idea"
                >
                    <i class="fas fa-arrow-up tw-text-lg"></i>
                </button>
                <span class="tw-text-xs tw-font-bold tw-mt-1 vote-count ${voted ? 'tw-text-campus-green' : 'tw-text-gray-700'}">${voteCount}</span>
            </div>

            <!-- Content section -->
            <div class="tw-flex-1 tw-px-4 tw-py-3">
                <p class="tw-text-sm tw-leading-normal tw-mb-1 tw-text-gray-900">${escapeHtml(idea.content)}</p>
                <p class="tw-text-xs tw-text-gray-500">
                    <i class="fas fa-clock tw-mr-1"></i> ${relativeTime}
                </p>
            </div>
        </div>
    `;

    return cardHtml;
}

/**
 * Render list of ideas
 * @param {Array} ideas - Array of idea objects
 * @param {boolean} animate - Whether to animate position changes
 */
function renderIdeasList(ideas, animate = false) {
    const ideasList = document.getElementById('ideasList');
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');

    // Only hide loading state if we're not animating (initial load)
    if (!animate) {
        loadingState.classList.add('tw-hidden');
    }

    if (!ideas || ideas.length === 0) {
        // Show empty state
        emptyState.classList.remove('tw-hidden');
        ideasList.innerHTML = '';
        return;
    }

    // Hide empty state
    emptyState.classList.add('tw-hidden');

    if (animate && ideasList.children.length > 0) {
        // FLIP animation technique - NO DOM clearing!
        // First: Get current positions
        const oldPositions = new Map();
        const existingElements = new Map();

        Array.from(ideasList.children).forEach(card => {
            const ideaId = card.dataset.ideaId;
            oldPositions.set(ideaId, card.getBoundingClientRect());
            existingElements.set(ideaId, card);
        });

        // Last: Reorder DOM elements without clearing
        const orderedIds = ideas.map(idea => idea.id);

        orderedIds.forEach((ideaId, newIndex) => {
            const card = existingElements.get(ideaId);
            if (card) {
                // Update vote count if it changed
                const idea = ideas[newIndex];
                const voteCountEl = card.querySelector('.vote-count');
                if (voteCountEl && idea) {
                    voteCountEl.textContent = idea.vote_count || 0;
                }

                // Move card to correct position in DOM (this doesn't cause reflow yet)
                if (ideasList.children[newIndex] !== card) {
                    ideasList.insertBefore(card, ideasList.children[newIndex] || null);
                }
            }
        });

        // Invert & Play: Calculate and animate differences
        requestAnimationFrame(() => {
            orderedIds.forEach(ideaId => {
                const card = existingElements.get(ideaId);
                if (!card) return;

                const oldPos = oldPositions.get(ideaId);
                if (!oldPos) return;

                const newPos = card.getBoundingClientRect();
                const deltaY = oldPos.top - newPos.top;

                if (Math.abs(deltaY) > 1) {
                    // Apply inverse transform (without transition)
                    card.style.transform = `translateY(${deltaY}px)`;
                    card.style.transition = 'none';

                    // Force reflow
                    void card.offsetHeight;

                    // Animate to final position
                    requestAnimationFrame(() => {
                        card.style.transform = '';
                        card.style.transition = 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';

                        // Add pulse effect
                        card.classList.add('idea-reordering');
                        setTimeout(() => {
                            card.classList.remove('idea-reordering');
                            card.style.transition = '';
                        }, 1200);
                    });
                }
            });
        });
    } else {
        // No animation, just render
        ideasList.innerHTML = ideas.map(idea => renderIdeaCard(idea)).join('');
    }
}

/**
 * Add a single new idea to the top of the list (for real-time updates)
 */
function prependIdea(idea) {
    const ideasList = document.getElementById('ideasList');
    const emptyState = document.getElementById('emptyState');

    // Hide empty state if visible
    emptyState.classList.add('tw-hidden');

    // Create a temporary container for the new card
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = renderIdeaCard(idea);
    const newCard = tempDiv.firstElementChild;

    // Insert at the beginning of the list
    ideasList.insertBefore(newCard, ideasList.firstChild);
}

/**
 * Update vote count for a specific idea
 */
function updateVoteCount(ideaId, newCount) {
    const card = document.querySelector(`[data-idea-id="${ideaId}"]`);
    if (card) {
        const voteCountElement = card.querySelector('.vote-count');
        if (voteCountElement) {
            voteCountElement.textContent = newCount;
        }

        // Disable the upvote button and change its appearance
        const upvoteButton = card.querySelector('.upvote-btn');
        if (upvoteButton) {
            upvoteButton.disabled = true;
            upvoteButton.classList.add('tw-bg-smoke-gray', 'tw-cursor-not-allowed');
            upvoteButton.classList.remove('tw-bg-campus-green', 'hover:tw-bg-loyal-yellow');
        }
    }
}

/**
 * Show error message
 */
function showError(message) {
    const ideasContainer = document.getElementById('ideasContainer');

    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    const errorHtml = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <strong>Error:</strong> ${escapeHtml(message)}
        </div>
    `;

    ideasContainer.insertAdjacentHTML('afterbegin', errorHtml);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        const errorElement = document.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }, 5000);
}

/**
 * Show success message
 */
function showSuccess(message) {
    const ideasContainer = document.getElementById('ideasContainer');

    // Remove any existing success messages
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }

    const successHtml = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            ${escapeHtml(message)}
        </div>
    `;

    ideasContainer.insertAdjacentHTML('afterbegin', successHtml);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        const successElement = document.querySelector('.success-message');
        if (successElement) {
            successElement.remove();
        }
    }, 3000);
}

/**
 * Update character counter
 */
function updateCharCount(currentLength, maxLength) {
    const charCount = document.getElementById('charCount');
    charCount.textContent = `${currentLength} / ${maxLength}`;

    // Change color based on remaining characters
    charCount.classList.remove('char-count-warning', 'char-count-error');

    if (currentLength >= maxLength) {
        charCount.classList.add('char-count-error');
    } else if (currentLength >= maxLength * 0.9) {
        charCount.classList.add('char-count-warning');
    }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show loading state
 */
function showLoadingState() {
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const ideasList = document.getElementById('ideasList');

    loadingState.classList.remove('tw-hidden');
    emptyState.classList.add('tw-hidden');
    ideasList.innerHTML = '';
}
