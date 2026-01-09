# Daily Reset Migration Guide

This guide will help you update your existing Supabase database to support automatic daily leaderboard resets at midnight UTC.

## What Changed?

The `get_top_scores` RPC function now automatically filters daily leaderboards to show only scores from the current UTC day. This mimics the behavior of the blockchain-based madness game's lazy reset system.

## Migration Steps

### Step 1: Update the RPC Function

1. Go to your Supabase project
2. Navigate to **SQL Editor** (left sidebar)
3. Click "New Query"
4. Copy and paste the following SQL:

```sql
-- Update the get_top_scores function to support automatic daily resets
CREATE OR REPLACE FUNCTION get_top_scores(
  game_name TEXT,
  limit_count INT
)
RETURNS TABLE (
  rank BIGINT,
  player_name TEXT,
  score INTEGER,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROW_NUMBER() OVER (ORDER BY l.score DESC, l.created_at ASC) as rank,
    l.player_name,
    l.score,
    l.created_at
  FROM leaderboards l
  WHERE l.game_id = game_name
    -- Auto-filter daily leaderboard to show only today's scores (UTC)
    AND (
      game_name NOT LIKE '%daily%'
      OR l.created_at >= date_trunc('day', NOW() AT TIME ZONE 'UTC')
    )
  ORDER BY l.score DESC, l.created_at ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

5. Click **Run** to execute the query
6. You should see a success message

### Step 2: Test the Migration

Run this query to verify it's working:

```sql
-- Test daily leaderboard (should only show today's scores)
SELECT * FROM get_top_scores('memory-free-daily', 10);

-- Test all-time leaderboard (should show all scores)
SELECT * FROM get_top_scores('memory-free-alltime', 10);
```

### Step 3: Verify in Your App

1. Open your game in a browser
2. Check that the daily leaderboard shows only today's scores
3. Check that the all-time leaderboard shows all scores
4. Play a game and verify your new score appears in the daily leaderboard

## How It Works

### Automatic Filtering

The updated function uses this logic:

```sql
-- For games with 'daily' in the name:
-- Only return scores where created_at >= midnight UTC today

AND (
  game_name NOT LIKE '%daily%'           -- If NOT a daily game, show all scores
  OR l.created_at >= date_trunc('day', NOW() AT TIME ZONE 'UTC')  -- If daily, show only today
)
```

### Behavior

- **Daily Leaderboard** (`memory-free-daily`):
  - Shows only scores from the current UTC day
  - Automatically "resets" at midnight UTC
  - Old scores remain in database but don't appear on leaderboard

- **All-Time Leaderboard** (`memory-free-alltime`):
  - Shows all scores ever recorded
  - Never resets

### Similar to Madness Game

This is the same approach as the blockchain-based madness game:

**Madness (Smart Contract)**:
```solidity
uint256 currentDay = block.timestamp / 1 days;
if (currentDay > lastResetDay) {
    _resetDaily();
}
```

**Free Game (Supabase)**:
```sql
l.created_at >= date_trunc('day', NOW() AT TIME ZONE 'UTC')
```

Both use a "lazy reset" where:
- No cron jobs needed
- Automatic based on time
- Historical data preserved

## Optional: Clean Up Old Scores

If you want to save database space, you can periodically delete old daily scores:

```sql
-- Delete daily scores older than 7 days
DELETE FROM leaderboards
WHERE game_id = 'memory-free-daily'
AND created_at < CURRENT_DATE - INTERVAL '7 days';
```

You can run this manually or set up a Supabase Edge Function to run it weekly.

## Rollback (If Needed)

If you need to revert to the old behavior:

```sql
-- Revert to original function (no date filtering)
CREATE OR REPLACE FUNCTION get_top_scores(
  game_name TEXT,
  limit_count INT
)
RETURNS TABLE (
  rank BIGINT,
  player_name TEXT,
  score INTEGER,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROW_NUMBER() OVER (ORDER BY l.score DESC, l.created_at ASC) as rank,
    l.player_name,
    l.score,
    l.created_at
  FROM leaderboards l
  WHERE l.game_id = game_name
  ORDER BY l.score DESC, l.created_at ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

## Troubleshooting

### Daily leaderboard still shows old scores

1. Make sure you ran the SQL update successfully
2. Check that your `game_id` contains the word 'daily'
3. Clear your browser cache and reload
4. Verify the time zone: `SELECT NOW() AT TIME ZONE 'UTC';`

### Scores disappeared

This is normal if they're from a previous day. They're still in the database:

```sql
-- View all daily scores (including old ones)
SELECT * FROM leaderboards
WHERE game_id = 'memory-free-daily'
ORDER BY created_at DESC;
```

### Need to view yesterday's winners?

```sql
-- View yesterday's daily scores
SELECT * FROM leaderboards
WHERE game_id = 'memory-free-daily'
AND created_at >= CURRENT_DATE - INTERVAL '1 day'
AND created_at < CURRENT_DATE
ORDER BY score DESC;
```

## Questions?

- Check the [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for full setup instructions
- Review the [smart contract](./contracts/SimplePrizePool_Fixed.sol) to see how the madness game implements resets
- Open an issue on GitHub if you encounter problems

## Version Info

- **Migration Date**: January 9, 2026
- **Game Version**: 2.0+
- **Requires**: Supabase with PostgreSQL 14+
