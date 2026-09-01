import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { LogOut, Plus, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const Topbar = () => {
  const { mutate: signOut } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  const handleSignOut = async () => {
    await signOut();
    navigate("/sign-in");
  };

  return (
    <section className="topbar">
      <div className="flex-between py-3.5 px-4 sm:px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-500 to-secondary-500 flex-center shadow-glow">
            <span className="text-base">🐱</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xl font-extrabold text-white">Meow</span>
            <span className="text-xl font-extrabold gradient-text">Box</span>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/create-post"
            className="w-9 h-9 rounded-xl bg-primary-500/20 text-primary-500 border border-primary-500/30 flex-center hover:bg-primary-500 hover:text-white transition-all"
          >
            <Plus className="w-5 h-5" />
          </Link>

          <Link to={`/profile/${user.id}`}>
            <Avatar className="h-9 w-9 ring-2 ring-primary-500/40">
              <AvatarImage src={user.imageUrl} alt={user.name} />
              <AvatarFallback className="bg-primary-500/20 text-primary-500 text-xs font-bold">
                {user.name ? user.name[0] : "U"}
              </AvatarFallback>
            </Avatar>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-light-4 hover:text-red hover:bg-red/10 rounded-xl"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
