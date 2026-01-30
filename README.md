# Idea Board - Anonymous Voting Platform

A single-board anonymous idea submission and voting platform built with vanilla JavaScript and Supabase, styled with the UAB design system.

## Features

- **Anonymous Posting**: Submit ideas without authentication
- **Upvoting**: Vote on ideas you like
- **Duplicate Vote Prevention**: Each user can only vote once per idea
- **Real-time Updates**: See new ideas appear instantly
- **Responsive Design**: Works on desktop, tablet, and mobile
- **UAB Branding**: Professional styling with UAB colors and typography
- **CAPTCHA Protection**: Cloudflare Turnstile prevents bot spam
- **Profanity Filter**: Automatic filtering using leo-profanity library

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Tailwind CSS (CDN) with UAB custom colors
- **Database**: Supabase (PostgreSQL)
- **Icons**: Font Awesome 6
- **Hosting**: Any static hosting (Netlify, Vercel, GitHub Pages, etc.)

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details and wait for it to be created
4. Go to Project Settings > API to find your credentials

### 2. Set Up Database Tables

Run these SQL commands in the Supabase SQL Editor:

```sql
-- Create ideas table
CREATE TABLE ideas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    vote_count INTEGER DEFAULT 0
);

-- Create votes table for duplicate prevention
CREATE TABLE votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    voter_fingerprint TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(idea_id, voter_fingerprint)
);

-- Create index for better performance
CREATE INDEX idx_ideas_vote_count ON ideas(vote_count DESC);
CREATE INDEX idx_votes_idea_id ON votes(idea_id);
```

### 3. Set Up Database Trigger

Create a trigger to automatically increment vote_count when a vote is added:

```sql
-- Function to increment vote count
CREATE OR REPLACE FUNCTION increment_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ideas
  SET vote_count = vote_count + 1
  WHERE id = NEW.idea_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on vote insert
CREATE TRIGGER on_vote_insert
AFTER INSERT ON votes
FOR EACH ROW
EXECUTE FUNCTION increment_vote_count();
```

### 4. Configure Row Level Security (RLS)

Enable RLS and create policies for anonymous access:

```sql
-- Enable RLS on both tables
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read ideas
CREATE POLICY "Anyone can view ideas"
ON ideas FOR SELECT
TO public
USING (true);

-- Allow anyone to insert ideas
CREATE POLICY "Anyone can insert ideas"
ON ideas FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to insert votes
CREATE POLICY "Anyone can insert votes"
ON votes FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to read votes (for duplicate checking)
CREATE POLICY "Anyone can view votes"
ON votes FOR SELECT
TO public
USING (true);
```

### 5. Enable Realtime

In the Supabase dashboard, enable realtime for the `ideas` table:

**Option 1: Using the Table Editor**
1. Go to **Database** > **Tables**
2. Find the `ideas` table and click on it
3. Click the **Enable Realtime** toggle (or it may already be enabled by default)

**Option 2: Using SQL**
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE ideas;
```

**Option 3: Using the API Settings**
1. Go to **Project Settings** > **API**
2. Under **Realtime**, ensure realtime is enabled for your project
3. Realtime should be enabled by default for all tables in newer Supabase projects

**Note**: In most recent Supabase projects, realtime is automatically enabled for all tables. You can verify by checking if broadcasts work when testing the app.

### 6. Set Up Cloudflare Turnstile (CAPTCHA)

1. Go to [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)
2. Sign up/login to Cloudflare
3. Create a new Turnstile site:
   - **Site name**: "Idea Board" (or whatever you prefer)
   - **Domain**: Your deployment domain (e.g., `your-app.netlify.app`) or `localhost` for testing
   - **Widget mode**: Managed
4. Copy your **Site Key**
5. Open `index.html` and replace `YOUR_TURNSTILE_SITE_KEY_HERE` with your actual site key (around line 93)

**Note**: For local development, add `localhost` as an allowed domain in Turnstile settings.

### 7. Configure the Application

1. Clone or download this repository
2. Open `js/config.js`
3. Replace the placeholder values with your Supabase credentials:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_...';
```

You can find these values in your Supabase project under **Settings > API**:
- **Project URL**: Copy the full URL (e.g., `https://abcdefgh.supabase.co`)
- **Publishable key**: Copy the "default" publishable key (starts with `sb_publishable_`)
  - *Note*: If you see "anon key" instead (legacy format), use that - it works the same way

### 8. Run the Application

Since this is a static site, you need a local server to run it:

**Option 1: Python**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option 2: Node.js (http-server)**
```bash
npx http-server -p 8000
```

**Option 3: VS Code Live Server**
- Install the "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

Then open your browser to `http://localhost:8000`

## Project Structure

```
redclone/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Custom CSS styles
├── js/
│   ├── config.js      # Supabase configuration
│   ├── ui.js          # UI rendering functions
│   └── app.js         # Main application logic
├── README.md          # This file
├── SKILL.md           # UAB Joomla design skill reference
└── annual-report-patterns.md  # UAB design patterns
```

## How It Works

### Voting System
- Each user gets a unique voter ID stored in localStorage
- When voting, the app inserts a record into the `votes` table with the voter ID
- A database trigger automatically increments the `vote_count` on the `ideas` table
- The UNIQUE constraint on (idea_id, voter_fingerprint) prevents duplicate votes
- The UI tracks voted ideas in localStorage for instant feedback

### Real-time Updates
- Uses Supabase real-time subscriptions
- Listens for INSERT events on the `ideas` table
- Automatically reloads the list when new ideas are posted

### Anonymous Posting
- No authentication required
- No personal data collected
- Simple and immediate idea submission

## Deployment

### Netlify
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Deploy (no build command needed)

### Vercel
1. Push your code to GitHub
2. Import project in Vercel
3. Deploy

### GitHub Pages
1. Push code to GitHub
2. Go to Settings > Pages
3. Select your branch and root directory
4. Your site will be live at `https://username.github.io/redclone`

### Supabase Storage
Upload the files to Supabase Storage and enable public access.

## Customization

### Change Colors
Edit the Tailwind config in `index.html` (lines 11-30) to change UAB colors.

### Change Character Limit
Update the `maxlength` attribute in `index.html` (line 73) and the character counter logic.

### Disable Real-time Updates
Comment out the `setupRealtimeSubscription()` call in `js/app.js`.

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with Kulturista font fallback)
- Mobile browsers: Full support

## Security Notes

- The Supabase publishable key (or anon key in legacy projects) is safe to expose in client-side code when RLS policies are properly configured
- All database access is controlled by Row Level Security policies
- No sensitive data is stored or transmitted
- Consider adding rate limiting for production use
- **Never expose your secret key** in client-side code - it's only for server-side use

## Troubleshooting

### Ideas not loading
- Check browser console for errors
- Verify Supabase credentials in `js/config.js`
- Ensure RLS policies are created correctly

### Votes not registering
- Check that the database trigger is created
- Verify RLS policies allow INSERT on votes table
- Check browser console for errors

### Real-time not working
- Ensure realtime is enabled for the `ideas` table in Supabase
- Check that your browser supports WebSockets
- Verify no browser extensions are blocking WebSocket connections

## License

MIT License - Feel free to use this project for any purpose.
