import { Home, Newspaper, Box, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function LeftSidebar() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Newspaper, label: "Discover", path: "/discover" },
    { icon: Box, label: "Spaces", path: "/spaces" },
    { icon: TrendingUp, label: "Finance", path: "/finance" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-16 bg-background/95 backdrop-blur-sm border-r border-border flex flex-col items-center py-4 gap-6 z-50">
      <Link to="/" className="mb-2">
        <img
          src="/logo.png"
          alt="Nelson-GPT"
          className="w-9 h-9 rounded-lg shadow-sm"
        />
      </Link>

      <button className="w-10 h-10 rounded-lg border border-border hover:bg-accent flex items-center justify-center transition-all hover:shadow-md group">
        <span className="text-xl text-muted-foreground group-hover:text-foreground transition-colors">
          +
        </span>
      </button>

      <nav className="flex flex-col gap-6 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 group"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive
                    ? "text-[#20B8CD]"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
              <span
                className={`text-[10px] transition-colors ${
                  isActive
                    ? "text-[#20B8CD] font-medium"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
