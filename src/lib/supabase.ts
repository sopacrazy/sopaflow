import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uaqmmpuiwoopiazyfmhp.supabase.co";
const supabaseAnonKey = "sb_publishable_BszFh2F_uIqqCdnINVRHOQ_3foLceVm";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
