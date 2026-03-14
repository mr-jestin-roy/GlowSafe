import { Outlet, Link, useLocation } from "react-router";
import { Home, Sun, BookOpen, User, Droplet } from "lucide-react";

export function Root() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/uv", icon: Sun, label: "UV Index" },
    { path: "/knowledge", icon: BookOpen, label: "Knowledge" },
    { path: "/skin-tone", icon: User, label: "Skin" },
    { path: "/sunscreen", icon: Droplet, label: "Sunscreen" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-sky-100 to-orange-50">
      {/* Desktop top nav — hidden on mobile */}
      <header className="hidden lg:block sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/40">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between h-16 px-8">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2">
            <Sun className="w-7 h-7 text-orange-500" />
            <span className="text-lg font-bold text-gray-900">GlowSafe</span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom nav — hidden on desktop */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 safe-area-inset-bottom">
        <div className="flex justify-around items-center h-16 max-w-screen-sm mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive
                    ? "text-orange-600"
                    : "text-gray-500 hover:text-orange-500"
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-2 w-1 h-1 rounded-full bg-orange-500" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
