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
        <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-md hover:tw-shadow-lg tw-border-l-4 tw-border-campus-green tw-mb-4 tw-flex tw-gap-6 idea-card fade-in" data-idea-id="${idea.id}">
            <!-- Upvote section -->
            <div class="tw-flex tw-flex-col tw-items-center upvote-section">
                <button
                    class="upvote-btn tw-bg-campus-green tw-text-white tw-w-12 tw-h-12 tw-rounded-full hover:tw-bg-loyal-yellow tw-transition-colors tw-flex tw-items-center tw-justify-center ${voted ? 'tw-bg-smoke-gray tw-cursor-not-allowed' : ''}"
                    onclick="handleUpvote('${idea.id}')"
                    ${voted ? 'disabled' : ''}
                    aria-label="Upvote this idea"
                >
                    <i class="fas fa-arrow-up"></i>
                </button>
                <span class="tw-text-uab-green tw-font-bold tw-mt-2 vote-count">${voteCount}</span>
            </div>

            <!-- Content section -->
            <div class="tw-flex-1">
                <p class="tw-text-lg tw-leading-relaxed tw-mb-2 tw-text-gray-800">${escapeHtml(idea.content)}</p>
                <p class="tw-text-sm tw-text-smoke-gray">
                    <i class="fas fa-clock tw-mr-1"></i> ${relativeTime}
                </p>
            </div>
        </div>
    `;

    return cardHtml;
}

/**
 * Render list of ideas
 */
function renderIdeasList(ideas) {
    const ideasList = document.getElementById('ideasList');
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');

    // Hide loading state
    loadingState.classList.add('tw-hidden');

    if (!ideas || ideas.length === 0) {
        // Show empty state
        emptyState.classList.remove('tw-hidden');
        ideasList.innerHTML = '';
        return;
    }

    // Hide empty state and render ideas
    emptyState.classList.add('tw-hidden');
    ideasList.innerHTML = ideas.map(idea => renderIdeaCard(idea)).join('');
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
