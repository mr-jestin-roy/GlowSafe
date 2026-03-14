import { Link } from "react-router";
import { Sun, ShieldCheck, Activity, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export function Landing() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-[80vh] lg:min-h-screen px-6 lg:px-16 xl:px-24 gap-12 lg:gap-20 max-w-screen-xl mx-auto">
      {/* Left: text content */}
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:flex-1 pt-10 lg:pt-0">
        <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold mb-3 text-gray-900">
          GlowSafe
        </h1>
        <p className="text-lg lg:text-xl text-orange-600 font-medium mb-6">
          Your Sun Safety Companion
        </p>

        <div className="max-w-md lg:max-w-lg space-y-4 mb-10 text-gray-600 lg:text-lg">
          <p>
            UV radiation from the sun is the leading cause of skin cancer and
            premature skin ageing. Even on cloudy days, up to 80% of UV rays can
            reach your skin.
          </p>
          <p>
            GlowSafe helps you stay protected by tracking real-time UV index
            levels, providing personalised burn-time estimates, and guiding you on
            proper sunscreen application.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10">
          {[
            { icon: Sun, label: "Live UV Index", color: "bg-orange-50 text-orange-700 border-orange-200" },
            { icon: ShieldCheck, label: "Protection Tips", color: "bg-green-50 text-green-700 border-green-200" },
            { icon: Activity, label: "Skin Type Advice", color: "bg-blue-50 text-blue-700 border-blue-200" },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 rounded-full px-4 py-2 border text-sm font-medium ${item.color}`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link to="/uv">
          <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-full shadow-md"
          >
            Check UV Index
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Right: visual / illustration */}
      <div className="hidden lg:flex flex-col items-center justify-center lg:flex-1">
        <div className="relative">
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full bg-orange-300/20 blur-3xl scale-150" />
          {/* Main sun icon */}
          <div className="relative w-64 h-64 xl:w-80 xl:h-80 bg-gradient-to-br from-orange-400 to-yellow-300 rounded-full flex items-center justify-center shadow-2xl">
            <Sun className="w-32 h-32 xl:w-40 xl:h-40 text-white/90" />
          </div>
          {/* Floating stat cards */}
          <div className="absolute -top-4 -right-8 bg-white rounded-2xl shadow-lg px-4 py-3 text-center">
            <p className="text-2xl font-bold text-red-500">11+</p>
            <p className="text-xs text-gray-500">Extreme UV</p>
          </div>
          <div className="absolute -bottom-4 -left-8 bg-white rounded-2xl shadow-lg px-4 py-3 text-center">
            <p className="text-2xl font-bold text-green-500">SPF 50+</p>
            <p className="text-xs text-gray-500">Recommended</p>
          </div>
        </div>
      </div>

      {/* Mobile: keep simple sun icon */}
      <div className="lg:hidden">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-yellow-300 rounded-full flex items-center justify-center shadow-lg -mt-6 mb-2">
          <Sun className="w-12 h-12 text-white" />
        </div>
      </div>
    </div>
  );
}
