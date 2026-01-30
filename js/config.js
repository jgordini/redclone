/**
 * Supabase Configuration
 *
 * Replace SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY with your actual Supabase project credentials.
 * You can find these in your Supabase project settings under API.
 *
 * Note: Use the "Publishable key" (new format) or "anon key" (legacy format).
 * Both are safe to use in client-side code when RLS is enabled.
 */

const SUPABASE_URL = 'https://wzqfdjyxfknfxqsvgotx.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_UqsYpCg-RVDc9XsdYVp3Ow_ZlTfOSbC';

// Initialize Supabase client
let supabase;
try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
} catch (error) {
    console.error('Failed to initialize Supabase:', error);
}

/**
 * Voter ID Management
 * Generates or retrieves a unique voter ID from localStorage for duplicate vote prevention
 */
function getVoterId() {
    const VOTER_ID_KEY = 'redclone_voter_id';

    // Check if voter ID already exists
    let voterId = localStorage.getItem(VOTER_ID_KEY);

    if (!voterId) {
        // Generate new voter ID (simple UUID-like string)
        voterId = generateVoterId();
        localStorage.setItem(VOTER_ID_KEY, voterId);
    }

    return voterId;
}

/**
 * Generate a simple unique voter ID
 * Uses timestamp and random string for uniqueness
 */
function generateVoterId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `voter_${timestamp}_${randomStr}`;
}

/**
 * Track voted ideas in localStorage
 * Returns set of idea IDs that the user has already voted on
 */
function getVotedIdeas() {
    const VOTED_IDEAS_KEY = 'redclone_voted_ideas';
    const votedIdeas = localStorage.getItem(VOTED_IDEAS_KEY);
    return votedIdeas ? new Set(JSON.parse(votedIdeas)) : new Set();
}

/**
 * Mark an idea as voted
 */
function markIdeaAsVoted(ideaId) {
    const VOTED_IDEAS_KEY = 'redclone_voted_ideas';
    const votedIdeas = getVotedIdeas();
    votedIdeas.add(ideaId);
    localStorage.setItem(VOTED_IDEAS_KEY, JSON.stringify([...votedIdeas]));
}

/**
 * Check if user has voted on an idea
 */
function hasVoted(ideaId) {
    const votedIdeas = getVotedIdeas();
    return votedIdeas.has(ideaId);
}
