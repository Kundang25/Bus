import { Bus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  showLogout?: boolean;
  title?: string;
}

const Header = ({ showLogout = false, title = "Shakthi Scheme" }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bus className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
              <p className="text-xs text-primary-foreground/80 md:text-sm">
                Free Bus Travel for Women
              </p>
            </div>
          </div>
          {showLogout && user && (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col text-sm leading-tight">
                <span>
                  Welcome, {user.name}
                </span>
                <span>
                  <span className="font-bold">Conductor ID :</span> {user.id}
                </span>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>

          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
