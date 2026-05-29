
import { createClient } from '@supabase/supabase-js';

const SB_URL = "https://pljjbfzhdalaqkzvmrwr.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsampiZnpoZGFsYXFrenZtcndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NTY2MzIsImV4cCI6MjA4MjUzMjYzMn0.sGik1UlAT-wg_q9HpFuMXRhxycR1wIX7zpdFwZg8DkI";

export const supabase = createClient(SB_URL, SB_KEY);
