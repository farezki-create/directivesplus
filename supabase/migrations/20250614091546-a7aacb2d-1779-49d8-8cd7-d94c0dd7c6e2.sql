
-- Modifier la contrainte de clé étrangère pour permettre la suppression en cascade
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Vérifier et corriger d'autres tables qui pourraient avoir le même problème
DO $$
DECLARE
    table_record RECORD;
BEGIN
    -- Parcourir toutes les tables qui référencent auth.users
    FOR table_record IN 
        SELECT DISTINCT
            tc.table_name,
            tc.constraint_name,
            kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu 
            ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
            AND ccu.table_name = 'users'
            AND tc.table_schema = 'public'
    LOOP
        -- Recréer la contrainte avec ON DELETE CASCADE
        EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I', 
                      table_record.table_name, table_record.constraint_name);
        
        EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES auth.users(id) ON DELETE CASCADE', 
                      table_record.table_name, table_record.constraint_name, table_record.column_name);
        
        RAISE NOTICE 'Updated constraint % on table %', table_record.constraint_name, table_record.table_name;
    END LOOP;
END $$;
