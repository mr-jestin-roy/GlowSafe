import { useState, useEffect } from "react";
import { Droplet, AlertTriangle, Shirt, Glasses, CircleHelp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface BodyPart {
  name: string;
  area: number; // Percentage of total body surface area
  teaspoons: number;
  ml: number;
  fingerLength: string;
  icon: string;
}

export function SunscreenGuide() {
  const [currentUV, setCurrentUV] = useState(10);
  const [unit, setUnit] = useState<"teaspoon" | "ml" | "finger">("teaspoon");

  useEffect(() => {
    const savedUV = localStorage.getItem("currentUV");
    if (savedUV) {
      setCurrentUV(parseInt(savedUV));
    }
  }, []);

  const bodyParts: BodyPart[] = [
    {
      name: "Face & Neck",
      area: 9,
      teaspoons: 1,
      ml: 5,
      fingerLength: "2 finger lengths",
      icon: "👤",
    },
    {
      name: "Both Arms (incl. hands)",
      area: 18,
      teaspoons: 2,
      ml: 10,
      fingerLength: "4 finger lengths",
      icon: "💪",
    },
    {
      name: "Front Torso",
      area: 18,
      teaspoons: 2,
      ml: 10,
      fingerLength: "4 finger lengths",
      icon: "👕",
    },
    {
      name: "Back Torso",
      area: 18,
      teaspoons: 2,
      ml: 10,
      fingerLength: "4 finger lengths",
      icon: "🔙",
    },
    {
      name: "Front Legs",
      area: 18,
      teaspoons: 2,
      ml: 10,
      fingerLength: "4 finger lengths",
      icon: "🦵",
    },
    {
      name: "Back Legs",
      area: 18,
      teaspoons: 2,
      ml: 10,
      fingerLength: "4 finger lengths",
      icon: "🦿",
    },
  ];

  const totalTeaspoons = bodyParts.reduce((sum, part) => sum + part.teaspoons, 0);
  const totalMl = bodyParts.reduce((sum, part) => sum + part.ml, 0);

  const getUnitDisplay = (part: BodyPart) => {
    switch (unit) {
      case "teaspoon":
        return `${part.teaspoons} tsp`;
      case "ml":
        return `${part.ml} ml`;
      case "finger":
        return part.fingerLength;
    }
  };

  const clothingRecommendations = [
    {
      item: "UPF 50+ Sun Protective Clothing",
      description: "Provides excellent UV protection, equivalent to SPF50+ sunscreen",
      benefit: "Blocks 98% of UV radiation",
      icon: "👔",
    },
    {
      item: "Wide-Brimmed Hat (≥7.5cm)",
      description: "Protects face, neck, and ears from direct sunlight",
      benefit: "Reduces facial UV exposure by 70%",
      icon: "🎩",
    },
    {
      item: "UV400 Sunglasses",
      description: "Wraparound design, blocks 100% UVA and UVB",
      benefit: "Prevents cataracts and eye damage",
      icon: "🕶️",
    },
    {
      item: "Long-Sleeved Light Shirt",
      description: "Choose light-colored, tightly woven fabrics",
      benefit: "Breathable and sun-protective",
      icon: "👕",
    },
  ];

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-screen-sm lg:max-w-screen-lg xl:max-w-screen-xl mx-auto px-6 py-6">
          <h1 className="text-2xl lg:text-3xl mb-2">Sunscreen Amount Guide</h1>
          <p className="text-sm text-gray-600">Scientific calculation, precise protection</p>
        </div>
      </div>

      <div className="max-w-screen-sm lg:max-w-screen-lg xl:max-w-screen-xl mx-auto px-6 py-6">
        {/* UV Warning */}
        {currentUV >= 8 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-900">
              <strong>Current UV Index: {currentUV} (Very High)</strong>
              <br />
              Comprehensive protection recommended, including sunscreen + protective clothing + hat + sunglasses
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs defaultValue="dosage" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="dosage">Amount Calculator</TabsTrigger>
            <TabsTrigger value="clothing">Clothing Advice</TabsTrigger>
          </TabsList>

          {/* Dosage Calculator Tab */}
          <TabsContent value="dosage">
            {/* Desktop: 2-column, Mobile: single column */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-4 lg:space-y-0">
              {/* Left column */}
              <div className="space-y-4">
                {/* Unit Selector */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Measurement Unit</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-orange-600 hover:text-orange-700">
                          <CircleHelp className="w-5 h-5" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle>Measurement Unit Explanation</DialogTitle>
                          <DialogDescription className="space-y-3 pt-3">
                            <div>
                              <strong>Teaspoon (tsp)</strong>
                              <p className="text-sm mt-1">
                                1 teaspoon ≈ 5ml, common measurement method in Australia
                              </p>
                            </div>
                            <div>
                              <strong>Milliliter (ml)</strong>
                              <p className="text-sm mt-1">Precise volume measurement</p>
                            </div>
                            <div>
                              <strong>Finger Length Method</strong>
                              <p className="text-sm mt-1">
                                Length of sunscreen squeezed from fingertip, intuitive and easy to use
                              </p>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "teaspoon" as const, label: "Teaspoon" },
                      { value: "ml" as const, label: "Milliliter" },
                      { value: "finger" as const, label: "Finger" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setUnit(option.value)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          unit === option.value
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total Amount */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center mb-3">
                    <Droplet className="w-6 h-6 mr-2" />
                    <span className="text-sm opacity-90">Total Full Body Amount</span>
                  </div>
                  <div className="text-4xl font-bold mb-2">
                    {unit === "teaspoon" && `${totalTeaspoons} tsp`}
                    {unit === "ml" && `${totalMl} ml`}
                    {unit === "finger" && "~20 finger lengths"}
                  </div>
                  <p className="text-sm opacity-90">
                    Equivalent to a golf ball size | Reapply every 2 hours or after swimming
                  </p>
                </div>

                {/* Usage Tips */}
                <div className="bg-blue-50 rounded-2xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">💡 Usage Tips</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex">
                      <span className="mr-2">1.</span>
                      <span>
                        Apply 15-20 minutes before going outdoors for proper skin absorption
                      </span>
                    </li>
                    <li className="flex">
                      <span className="mr-2">2.</span>
                      <span>Apply evenly, don't miss spots like ears and tops of feet</span>
                    </li>
                    <li className="flex">
                      <span className="mr-2">3.</span>
                      <span>
                        Reapply immediately after swimming or heavy sweating, even if labeled "water-resistant"
                      </span>
                    </li>
                    <li className="flex">
                      <span className="mr-2">4.</span>
                      <span>
                        Use SPF50+ Broad Spectrum sunscreen
                      </span>
                    </li>
                    <li className="flex">
                      <span className="mr-2">5.</span>
                      <span>Expired sunscreen loses effectiveness, check expiration date</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right column: Body Parts Breakdown */}
              <div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-4">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <span className="text-2xl mr-2">📏</span>
                    Amount Per Body Part
                  </h3>
                  <div className="space-y-3">
                    {bodyParts.map((part) => (
                      <div
                        key={part.name}
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{part.icon}</span>
                          <div>
                            <p className="font-medium text-sm">{part.name}</p>
                            <p className="text-xs text-gray-500">
                              {part.area}% body surface
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-orange-600">
                            {getUnitDisplay(part)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Clothing Advice Tab */}
          <TabsContent value="clothing">
            <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-4 lg:space-y-0">
              {/* Left column */}
              <div className="space-y-4">
                {/* Description */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Shirt className="w-5 h-5 mr-2 text-orange-600" />
                    High UV Environment Clothing Advice
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    When UV index ≥8, sunscreen alone is not enough. Physical coverage from clothing is the most effective UV protection.
                    Below are equipment recommendations certified by Cancer Council Australia.
                  </p>
                </div>

                {/* Equipment List */}
                <div className="space-y-3">
                  {clothingRecommendations.map((item, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-4">
                      <div className="flex items-start">
                        <span className="text-3xl mr-4">{item.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{item.item}</h4>
                          <p className="text-sm text-gray-700 mb-2">
                            {item.description}
                          </p>
                          <div className="bg-green-50 rounded-lg px-3 py-2">
                            <p className="text-sm text-green-800">
                              ✓ {item.benefit}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-4">
                {/* UPF Explanation */}
                <div className="bg-purple-50 rounded-2xl p-4">
                  <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                    <Glasses className="w-5 h-5 mr-2" />
                    What is UPF?
                  </h4>
                  <p className="text-sm text-purple-800 mb-3 leading-relaxed">
                    UPF (Ultraviolet Protection Factor)
                    is the UV protection rating for clothing, similar to SPF for sunscreen.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-purple-700">UPF 15-24</span>
                      <span className="text-purple-900 font-medium">Good Protection</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-purple-700">UPF 25-39</span>
                      <span className="text-purple-900 font-medium">Very Good</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-purple-700">UPF 40-50+</span>
                      <span className="text-purple-900 font-medium">Excellent Protection</span>
                    </div>
                  </div>
                  <p className="text-xs text-purple-700 mt-3">
                    UPF 50+ clothing blocks over 98% of UV radiation
                  </p>
                </div>

                {/* Heat Comfort Tips */}
                <div className="bg-orange-50 rounded-2xl p-4">
                  <h4 className="font-semibold text-orange-900 mb-3">
                    🌡️ Balancing Heat Comfort
                  </h4>
                  <p className="text-sm text-orange-800 mb-3">
                    Australian summers are hot, choose sun protection equipment that balances protection and breathability:
                  </p>
                  <ul className="space-y-2 text-sm text-orange-800">
                    <li>• Choose light-colored clothing (reflects sunlight, reduces heat absorption)</li>
                    <li>• Prioritize breathable fabrics (like lightweight polyester, specially woven cotton)</li>
                    <li>• Loose-fitting cuts help air circulation</li>
                    <li>• Avoid dark tight clothing (absorbs heat and feels stuffy)</li>
                    <li>• Carry a portable umbrella for outdoor activities</li>
                  </ul>
                </div>

                {/* Slip Slop Slap Reminder */}
                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white">
                  <h4 className="font-semibold mb-3 text-lg">
                    Australian Classic Sun Protection Slogan
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Slip</strong> on a shirt
                    </p>
                    <p>
                      <strong>Slop</strong> on sunscreen
                    </p>
                    <p>
                      <strong>Slap</strong> on a hat
                    </p>
                    <p>
                      <strong>Seek</strong> shade
                    </p>
                    <p>
                      <strong>Slide</strong> on sunglasses
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
