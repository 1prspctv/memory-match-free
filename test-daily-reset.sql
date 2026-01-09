-- Test SQL for Daily Reset Functionality
-- Run these queries in Supabase SQL Editor to test the daily reset logic

-- 1. Insert test data with different dates
-- (Replace with actual test if you want to verify)

-- Test today's scores
INSERT INTO leaderboards (game_id, player_name, score, created_at)
VALUES
  ('memory-free-daily', 'Alice', 950000, NOW()),
  ('memory-free-daily', 'Bob', 920000, NOW() - INTERVAL '30 minutes'),
  ('memory-free-daily', 'Charlie', 900000, NOW() - INTERVAL '1 hour');

-- Test yesterday's scores (should NOT appear in daily leaderboard)
INSERT INTO leaderboards (game_id, player_name, score, created_at)
VALUES
  ('memory-free-daily', 'David', 980000, NOW() - INTERVAL '1 day'),
  ('memory-free-daily', 'Eve', 970000, NOW() - INTERVAL '25 hours');

-- Test all-time scores
INSERT INTO leaderboards (game_id, player_name, score, created_at)
VALUES
  ('memory-free-alltime', 'Alice', 995000, NOW()),
  ('memory-free-alltime', 'OldPlayer', 985000, NOW() - INTERVAL '30 days');


-- 2. Test the get_top_scores function

-- Test Daily Leaderboard (should show only Alice, Bob, Charlie - today's scores)
SELECT '=== DAILY LEADERBOARD (Today Only) ===' as test;
SELECT * FROM get_top_scores('memory-free-daily', 10);
-- Expected: 3 rows (Alice, Bob, Charlie)
-- Should NOT include David or Eve (yesterday's scores)

-- Test All-Time Leaderboard (should show all scores)
SELECT '=== ALL-TIME LEADERBOARD (All Scores) ===' as test;
SELECT * FROM get_top_scores('memory-free-alltime', 10);
-- Expected: 2 rows (Alice, OldPlayer)


-- 3. Verify the date filtering logic

-- Show start of today (UTC)
SELECT 'Start of today (UTC):' as label, date_trunc('day', NOW() AT TIME ZONE 'UTC') as value;

-- Show current time (UTC)
SELECT 'Current time (UTC):' as label, NOW() AT TIME ZONE 'UTC' as value;

-- Show all daily scores with their dates
SELECT
  'All daily scores with dates' as test,
  player_name,
  score,
  created_at,
  created_at >= date_trunc('day', NOW() AT TIME ZONE 'UTC') as is_today
FROM leaderboards
WHERE game_id = 'memory-free-daily'
ORDER BY score DESC;


-- 4. Test edge cases

-- Scores exactly at midnight
INSERT INTO leaderboards (game_id, player_name, score, created_at)
VALUES ('memory-free-daily', 'MidnightPlayer', 990000, date_trunc('day', NOW() AT TIME ZONE 'UTC'));

-- Should appear in today's leaderboard
SELECT 'Should include MidnightPlayer:' as test;
SELECT * FROM get_top_scores('memory-free-daily', 10);


-- 5. Clean up test data (optional)
-- Uncomment to remove test data after verification

-- DELETE FROM leaderboards WHERE player_name IN ('Alice', 'Bob', 'Charlie', 'David', 'Eve', 'OldPlayer', 'MidnightPlayer');


-- 6. Verify the logic explanation

/*
LOGIC BREAKDOWN:

The WHERE clause:
  WHERE l.game_id = game_name
    AND (
      game_name NOT LIKE '%daily%'
      OR l.created_at >= date_trunc('day', NOW() AT TIME ZONE 'UTC')
    )

For 'memory-free-daily':
  - game_name LIKE '%daily%' = TRUE
  - So we need: l.created_at >= date_trunc('day', NOW() AT TIME ZONE 'UTC')
  - This returns only scores from today (UTC)

For 'memory-free-alltime':
  - game_name LIKE '%daily%' = FALSE
  - So the OR short-circuits to TRUE
  - This returns all scores

Date truncation:
  - date_trunc('day', NOW() AT TIME ZONE 'UTC') = start of current UTC day (00:00:00)
  - Example: 2026-01-09 15:30:00 → 2026-01-09 00:00:00
  - Scores with created_at >= 2026-01-09 00:00:00 will appear
  - Scores with created_at < 2026-01-09 00:00:00 will NOT appear
*/
