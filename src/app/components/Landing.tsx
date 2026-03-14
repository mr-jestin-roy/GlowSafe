import { Link } from "react-router";
import { Sun, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      {/* Icon */}
      <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-yellow-300 rounded-full flex items-center justify-center mb-8 shadow-lg">
        <Sun className="w-12 h-12 text-white" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-3 text-gray-900">GlowSafe</h1>
      <p className="text-lg text-orange-600 font-medium mb-6">
        Your Sun Safety Companion
      </p>

      {/* Description */}
      <div className="max-w-md space-y-4 mb-10 text-gray-600">
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

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mb-10 w-full">
        {[
          { icon: Sun, label: "Live UV Index" },
          { icon: ShieldCheck, label: "Protection Tips" },
          { icon: ShieldCheck, label: "Skin Type Advice" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 bg-white/70 rounded-xl px-4 py-3 shadow-sm"
          >
            <item.icon className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700">
              {item.label}
            </span>
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
  );
}
