import { useState, useEffect } from "react";
import { MapPin, AlertCircle, RefreshCw, ArrowRight, Clock, TrendingUp, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Link } from "react-router";

interface UVData {
  value: number;
  location: string;
  time: string;
  risk: string;
  color: string;
}

interface HourlyForecast {
  hour: string;
  uvIndex: number;
  color: string;
}

interface WeeklyData {
  day: string;
  maxUV: number;
  minUV: number;
}

export function Home() {
  const [uvData, setUvData] = useState<UVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [skinTone, setSkinTone] = useState<number | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [weeklyForecast, setWeeklyForecast] = useState<WeeklyData[]>([]);

  const getRiskLevel = (uv: number) => {
    if (uv >= 11) return { risk: "Extreme", color: "bg-purple-500" };
    if (uv >= 8) return { risk: "Very High", color: "bg-red-500" };
    if (uv >= 6) return { risk: "High", color: "bg-orange-500" };
    if (uv >= 3) return { risk: "Moderate", color: "bg-yellow-500" };
    return { risk: "Low", color: "bg-green-500" };
  };

  const getUVColor = (uv: number) => {
    if (uv >= 11) return "#a855f7";
    if (uv >= 8) return "#ef4444";
    if (uv >= 6) return "#f97316";
    if (uv >= 3) return "#eab308";
    return "#22c55e";
  };

  // Generate mock hourly forecast
  const generateHourlyForecast = (currentHour: number) => {
    const forecast: HourlyForecast[] = [];
    const currentTime = new Date();
    
    // Generate forecast for next 12 hours
    for (let i = 0; i < 12; i++) {
      const hour = (currentHour + i) % 24;
      let uvIndex: number;
      
      // Simulate UV index based on time of day (higher during midday)
      if (hour >= 6 && hour <= 18) {
        // Daytime - peak at noon
        const distanceFromNoon = Math.abs(12 - hour);
        uvIndex = Math.max(0, 11 - distanceFromNoon + Math.random() * 2);
      } else {
        // Nighttime
        uvIndex = 0;
      }
      
      uvIndex = Math.round(uvIndex);
      const riskInfo = getRiskLevel(uvIndex);
      
      forecast.push({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        uvIndex,
        color: riskInfo.color,
      });
    }
    
    return forecast;
  };

  // Generate mock weekly forecast
  const generateWeeklyForecast = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const forecast: WeeklyData[] = [];
    
    for (let i = 0; i < 7; i++) {
      const maxUV = Math.floor(Math.random() * 5) + 8; // 8-12
      const minUV = Math.floor(Math.random() * 3) + 2; // 2-4
      
      forecast.push({
        day: days[i],
        maxUV,
        minUV,
      });
    }
    
    return forecast;
  };

  // Simulate fetching UV data
  const fetchUVData = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock Sydney UV data (Australia summer typically has high UV)
      const mockUV = Math.floor(Math.random() * 5) + 8; // Between 8-12
      const riskInfo = getRiskLevel(mockUV);
      const currentHour = new Date().getHours();
      
      setUvData({
        value: mockUV,
        location: "Sydney, NSW",
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        ...riskInfo,
      });
      
      setHourlyForecast(generateHourlyForecast(currentHour));
      setWeeklyForecast(generateWeeklyForecast());
      setLoading(false);
    }, 800);
  };

  // Calculate burn time
  const calculateBurnTime = (uvIndex: number, fitzpatrick: number) => {
    // Base protection time for Fitzpatrick I-VI (minutes)
    const baseProtectionTime = [10, 15, 20, 30, 40, 60];
    const baseTime = baseProtectionTime[fitzpatrick - 1] || 20;
    
    // Higher UV index means shorter burn time
    const burnTime = Math.round(baseTime / (uvIndex / 3));
    return Math.max(burnTime, 5); // Minimum 5 minutes
  };

  // Get safe hours (UV < 3)
  const getSafeHours = () => {
    const safeHours = hourlyForecast.filter(h => h.uvIndex < 3);
    if (safeHours.length === 0) return null;
    return {
      start: safeHours[0].hour,
      end: safeHours[safeHours.length - 1].hour,
    };
  };

  useEffect(() => {
    // Automatically use default location (Sydney) for demo purposes
    // In production, you would try geolocation first
    fetchUVData();

    // Read skin tone from localStorage
    const saved = localStorage.getItem("skinTone");
    if (saved) {
      setSkinTone(parseInt(saved));
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!locationEnabled) {
    return (
      <div className="p-6 max-w-screen-sm mx-auto">
        <Alert className="mt-20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to access your location. Please enable location services in your device settings or manually select a city.
          </AlertDescription>
        </Alert>
        <Button onClick={fetchUVData} className="w-full mt-4">
          Use Default Location (Sydney)
        </Button>
      </div>
    );
  }

  const safeHours = getSafeHours();

  return (
    <div className="p-6 max-w-screen-sm mx-auto">
      {/* Header */}
      <div className="mb-6 pt-4">
        <h1 className="text-2xl mb-2">UV Protection Assistant</h1>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{uvData?.location}</span>
        </div>
      </div>

      {/* UV Index Dashboard */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Current UV Index</p>
          <div className="relative w-48 h-48 mx-auto mb-4">
            {/* Circular progress background */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="#f3f4f6"
                strokeWidth="16"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${((uvData?.value || 0) / 12) * 502.4} 502.4`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  stroke: getUVColor(uvData?.value || 0)
                }}
              />
            </svg>
            
            {/* Center value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-bold">{uvData?.value}</span>
              <span className="text-sm text-gray-500 mt-1">/ 12</span>
            </div>
          </div>

          <div className={`inline-block px-6 py-2 rounded-full text-white ${uvData?.color}`}>
            {uvData?.risk}
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            Updated: {uvData?.time}
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={fetchUVData}
          className="w-full mt-4"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Hourly Forecast */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-600" />
            Hourly Forecast
          </h3>
        </div>
        <div className="overflow-x-auto -mx-2 px-2">
          <div className="flex gap-3 min-w-max pb-2">
            {hourlyForecast.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center min-w-[60px] bg-gray-50 rounded-lg p-3"
              >
                <span className="text-xs text-gray-600 mb-2">{item.hour}</span>
                <div className="relative w-8 h-24 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute bottom-0 w-full transition-all"
                    style={{
                      height: `${(item.uvIndex / 12) * 100}%`,
                      backgroundColor: getUVColor(item.uvIndex),
                    }}
                  ></div>
                </div>
                <span className="text-sm font-semibold mt-2">{item.uvIndex}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safe Hours */}
      {safeHours && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-md p-6 mb-6 text-white">
          <div className="flex items-start">
            <Moon className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Safe Outdoor Hours</h3>
              <p className="text-sm opacity-90 mb-2">
                UV index below 3 - safe for outdoor activities without extensive protection
              </p>
              <div className="flex items-center text-lg font-semibold">
                <span>{safeHours.start}</span>
                <span className="mx-2">-</span>
                <span>{safeHours.end}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Trend */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
            7-Day Forecast
          </h3>
        </div>
        <div className="space-y-3">
          {weeklyForecast.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <span className="text-sm font-medium w-12">{item.day}</span>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(item.maxUV / 12) * 100}%`,
                      backgroundColor: getUVColor(item.maxUV),
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">{item.minUV}</span>
                <span className="text-gray-400">-</span>
                <span className="font-semibold" style={{ color: getUVColor(item.maxUV) }}>
                  {item.maxUV}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Advice */}
      {skinTone && uvData && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="font-semibold mb-3">Your Personalized Protection Advice</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-sm text-gray-600">Skin Type</span>
              <span className="font-medium">Fitzpatrick {skinTone}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-sm text-gray-600">Estimated Burn Time</span>
              <span className="font-medium text-orange-600">
                ~{calculateBurnTime(uvData.value, skinTone)} mins
              </span>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 mt-3">
              <p className="text-sm text-orange-900">
                💡 Recommended to seek shade every {Math.floor(calculateBurnTime(uvData.value, skinTone) / 2)} minutes and reapply sunscreen.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Skin Tone Setup Guide */}
      {!skinTone && (
        <Link to="/skin-tone">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-md p-6 mb-6 text-white cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Get Personalized Advice</h3>
                <p className="text-sm opacity-90 mb-3">
                  Set your skin type to receive accurate burn time estimates and protection recommendations
                </p>
                <div className="flex items-center text-sm font-medium">
                  <span>Go to Settings</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
              <div className="text-4xl ml-4">👤</div>
            </div>
          </div>
        </Link>
      )}

      {/* UV Index Explanation */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold mb-4">UV Index Level Explanation</h3>
        <div className="space-y-2">
          {[
            { range: "0-2", level: "Low", color: "bg-green-500" },
            { range: "3-5", level: "Moderate", color: "bg-yellow-500" },
            { range: "6-7", level: "High", color: "bg-orange-500" },
            { range: "8-10", level: "Very High", color: "bg-red-500" },
            { range: "11+", level: "Extreme", color: "bg-purple-500" },
          ].map((item) => (
            <div key={item.range} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                <span className="text-sm">{item.level}</span>
              </div>
              <span className="text-sm text-gray-500">{item.range}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Alert */}
      {uvData && uvData.value >= 8 && (
        <Alert className="mt-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-900">
            <strong>High UV Warning:</strong> Avoid being outdoors between 10 AM and 4 PM.
            If you must go out, use SPF50+ sunscreen, wear UPF protective clothing, and don sunglasses and a wide-brimmed hat.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}