
import { User } from "@supabase/supabase-js";
import { LoginButton } from "./auth/LoginButton";
import { LogoutButton } from "./auth/LogoutButton";

interface AuthButtonsProps {
  user: User | null;
}

export const AuthButtons = ({ user }: AuthButtonsProps) => {
  const navButtonClass = "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 text-white";

  return user ? (
    <LogoutButton user={user} buttonClass={navButtonClass} />
  ) : (
    <LoginButton buttonClass={navButtonClass} />
  );
};
