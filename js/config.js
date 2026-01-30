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

/**
 * Simple built-in profanity filter
 * Filters the 7 dirty words and common racial slurs
 */
const BLOCKED_WORDS = [
    // The 7 dirty words
    'shit', 'piss', 'fuck', 'cunt', 'cocksucker', 'motherfucker', 'tits',
    // Common variations
    'fck', 'fuk', 'fuc', 'shit', 'sht', 'cnt', 'btch', 'bitch',
    // Racial slurs
    'nigger', 'nigga', 'nig', 'chink', 'spic', 'kike', 'wetback', 'beaner',
    'gook', 'jap', 'towelhead', 'raghead', 'sandnigger'
];

function initProfanityFilter() {
    console.log('✓ Profanity filter initialized with', BLOCKED_WORDS.length, 'blocked words');
    return true;
}

function containsProfanity(text) {
    const lowerText = text.toLowerCase();

    // Remove common obfuscation characters
    const cleanedText = lowerText
        .replace(/[*@#$%]/g, '')
        .replace(/\s+/g, ' ');

    // Check each blocked word
    for (const word of BLOCKED_WORDS) {
        // Use word boundaries to avoid false positives
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        if (regex.test(lowerText) || cleanedText.includes(word)) {
            console.log('Blocked word detected:', word);
            return true;
        }
    }

    return false;
}

function cleanProfanity(text) {
    let cleanedText = text;
    for (const word of BLOCKED_WORDS) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        cleanedText = cleanedText.replace(regex, '****');
    }
    return cleanedText;
}

/**
 * Get Cloudflare Turnstile token
 */
function getTurnstileToken() {
    try {
        const turnstileElement = document.querySelector('.cf-turnstile');
        if (!turnstileElement) {
            console.warn('Turnstile element not found');
            return 'bypass'; // Allow submission if CAPTCHA widget not found
        }

        if (typeof turnstile === 'undefined') {
            console.warn('Turnstile API not loaded');
            return 'bypass'; // Allow submission if Turnstile API not loaded
        }

        const response = turnstile.getResponse();
        console.log('Turnstile token:', response ? 'received' : 'empty');
        return response || null;
    } catch (error) {
        console.error('Error getting Turnstile token:', error);
        return 'bypass'; // Allow submission on error
    }
}

// Make functions globally accessible
window.containsProfanity = containsProfanity;
window.cleanProfanity = cleanProfanity;
window.getTurnstileToken = getTurnstileToken;
