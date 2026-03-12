import { Outlet, Link, useLocation } from "react-router";
import { Sun, BookOpen, User, Droplet } from "lucide-react";

export function Root() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Sun, label: "UV Index" },
    { path: "/knowledge", icon: BookOpen, label: "Knowledge" },
    { path: "/skin-tone", icon: User, label: "Skin" },
    { path: "/sunscreen", icon: Droplet, label: "Sunscreen" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-sky-100 to-orange-50">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* 底部导航栏 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="flex justify-around items-center h-16 max-w-screen-sm mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive
                    ? "text-orange-600"
                    : "text-gray-500 hover:text-orange-500"
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}