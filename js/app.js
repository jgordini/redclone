/**
 * Main Application Logic
 * Handles idea submission, voting, real-time updates, and data fetching
 */

// Store voter ID globally
let voterId;

/**
 * Initialize the application
 */
async function initApp() {
    // Get or generate voter ID
    voterId = getVoterId();
    console.log('Voter ID:', voterId);

    // Initialize profanity filter
    if (typeof LeoProfanity !== 'undefined') {
        initProfanityFilter();
    } else {
        // Wait for leo-profanity library to load
        setTimeout(initProfanityFilter, 1000);
    }

    // Set up form handlers
    setupFormHandlers();

    // Load initial ideas
    await loadIdeas();

    // Set up real-time subscription
    setupRealtimeSubscription();
}

/**
 * Load all ideas from Supabase
 * @param {boolean} isReSort - If true, animate position changes
 */
async function loadIdeas(isReSort = false) {
    try {
        if (!isReSort) {
            showLoadingState();
        }

        const { data, error } = await supabase
            .from('ideas')
            .select('*')
            .order('vote_count', { ascending: false });

        if (error) {
            console.error('Error loading ideas:', error);
            showError('Failed to load ideas. Please refresh the page.');
            return;
        }

        renderIdeasList(data, isReSort);
    } catch (error) {
        console.error('Error loading ideas:', error);
        showError('Failed to load ideas. Please check your internet connection.');
    }
}

/**
 * Set up form submission handler
 */
function setupFormHandlers() {
    const form = document.getElementById('ideaForm');
    const textarea = document.getElementById('ideaInput');
    const charCount = document.getElementById('charCount');

    // Character counter
    textarea.addEventListener('input', () => {
        updateCharCount(textarea.value.length, 500);
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleIdeaSubmission();
    });
}

/**
 * Handle idea submission
 */
async function handleIdeaSubmission() {
    const textarea = document.getElementById('ideaInput');
    const content = textarea.value.trim();
    const submitButton = document.querySelector('#ideaForm button[type="submit"]');

    if (!content) {
        showError('Please enter an idea before submitting.');
        return;
    }

    // Check for profanity
    const hasProfanity = containsProfanity(content);
    console.log('Profanity check:', hasProfanity, 'for text:', content.substring(0, 50));

    if (hasProfanity) {
        showError('Your submission contains inappropriate language. Please remove profanity and try again.');
        return;
    }

    // Verify Cloudflare Turnstile CAPTCHA
    const turnstileToken = getTurnstileToken();
    if (!turnstileToken) {
        showError('Please complete the CAPTCHA verification.');
        return;
    }

    // Disable submit button to prevent double submissions
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin tw-mr-2"></i> Submitting...';

    try {
        const { data, error } = await supabase
            .from('ideas')
            .insert([
                {
                    content: content,
                    vote_count: 0
                }
            ])
            .select();

        if (error) {
            console.error('Error submitting idea:', error);
            showError('Failed to submit idea. Please try again.');
            return;
        }

        // Clear the form
        textarea.value = '';
        updateCharCount(0, 500);

        // Reset Turnstile CAPTCHA
        if (typeof turnstile !== 'undefined') {
            turnstile.reset();
        }

        // Show success message
        showSuccess('Your idea has been submitted!');

        // Reload ideas to show the new one
        await loadIdeas();

    } catch (error) {
        console.error('Error submitting idea:', error);
        showError('Failed to submit idea. Please check your internet connection.');

        // Reset Turnstile CAPTCHA on error
        if (typeof turnstile !== 'undefined') {
            turnstile.reset();
        }
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.innerHTML = 'Post';
    }
}

/**
 * Handle upvote button click
 */
async function handleUpvote(ideaId) {
    // Check if already voted
    if (hasVoted(ideaId)) {
        showError('You have already voted on this idea.');
        return;
    }

    try {
        // Immediate UI feedback - disable button and update appearance
        const card = document.querySelector(`[data-idea-id="${ideaId}"]`);
        if (card) {
            const upvoteButton = card.querySelector('.upvote-btn');
            const voteCountEl = card.querySelector('.vote-count');

            if (upvoteButton && voteCountEl) {
                upvoteButton.disabled = true;

                // Transform from outline to filled green circle
                upvoteButton.classList.remove('upvote-unvoted', 'tw-text-gray-400', 'hover:tw-text-campus-green');
                upvoteButton.classList.add('upvote-voted', 'tw-bg-campus-green', 'tw-text-white');

                // Update vote count color
                voteCountEl.classList.add('tw-text-campus-green');
                voteCountEl.classList.remove('tw-text-gray-700');

                // Optimistically increment the vote count
                const currentCount = parseInt(voteCountEl.textContent) || 0;
                voteCountEl.textContent = currentCount + 1;
            }
        }

        // Insert vote into votes table
        const { error: voteError } = await supabase
            .from('votes')
            .insert([
                {
                    idea_id: ideaId,
                    voter_fingerprint: voterId
                }
            ]);

        if (voteError) {
            // Check if it's a duplicate vote error
            if (voteError.code === '23505') {
                showError('You have already voted on this idea.');
                markIdeaAsVoted(ideaId);
                return;
            }
            console.error('Error voting:', voteError);
            showError('Failed to submit vote. Please try again.');

            // Revert optimistic update on error
            await loadIdeas(false);
            return;
        }

        // Mark as voted locally
        markIdeaAsVoted(ideaId);

        // Wait a moment for the trigger to update vote_count
        await new Promise(resolve => setTimeout(resolve, 500));

        // Reload all ideas to trigger re-sort with animation
        await loadIdeas(true); // Pass true to indicate this is a re-sort after vote

    } catch (error) {
        console.error('Error voting:', error);
        showError('Failed to submit vote. Please check your internet connection.');
        // Reload to restore correct state
        await loadIdeas(false);
    }
}

/**
 * Set up real-time subscription for new ideas
 */
function setupRealtimeSubscription() {
    try {
        const channel = supabase
            .channel('ideas-channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'ideas'
                },
                (payload) => {
                    console.log('New idea received:', payload.new);
                    // Reload ideas to show the new one in the correct position
                    loadIdeas();
                }
            )
            .subscribe((status) => {
                console.log('Realtime subscription status:', status);
            });

    } catch (error) {
        console.error('Error setting up realtime subscription:', error);
    }
}

/**
 * Make handleUpvote globally accessible for onclick handlers
 */
window.handleUpvote = handleUpvote;

/**
 * Initialize app when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
