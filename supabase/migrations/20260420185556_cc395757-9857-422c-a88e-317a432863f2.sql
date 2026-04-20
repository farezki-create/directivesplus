-- Remove 'directives' table from supabase_realtime publication to prevent
-- broadcasting end-of-life medical content change events to all subscribers.
-- The table is not used with Realtime in client code; removing it eliminates
-- cross-user data leakage via Realtime broadcast.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'directives'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.directives';
  END IF;
END
$$;