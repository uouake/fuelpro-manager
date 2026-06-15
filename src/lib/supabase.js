import { createClient } from '@supabase/supabase-js'

const ENV = import.meta.env ?? {}
const SUPABASE_URL = ENV.VITE_SUPABASE_URL
const SUPABASE_KEY = ENV.VITE_SUPABASE_ANON_KEY

export const supabase = SUPABASE_URL && SUPABASE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null
