import { useState, useEffect } from "react";
import { MapPin, AlertCircle, RefreshCw, ArrowRight, Clock, TrendingUp, Sun, Moon, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Link } from "react-router";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import postcodeData from "../../data/postcodes.json";

interface PostcodeEntry {
  suburb: string;
  state: string;
  lat: number;
  lng: number;
}

const postcodes = postcodeData as Record<string, PostcodeEntry>;

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
  const [loading, setLoading] = useState(false);
  const [skinTone, setSkinTone] = useState<number | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [weeklyForecast, setWeeklyForecast] = useState<WeeklyData[]>([]);
  const [postcode, setPostcode] = useState("");
  const [postcodeError, setPostcodeError] = useState("");
  const [showPostcodeDialog, setShowPostcodeDialog] = useState(false);
  const [dialogPostcode, setDialogPostcode] = useState("");

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

  // Normalize postcode for DB lookup: strip leading zeros (e.g. 0870 -> 870)
  const normalizePostcodeForLookup = (code: string) => code.replace(/^0+/, "") || "0";

  // Look up postcode in DB and fetch UV data from Open-Meteo API (free, no key needed)
  const fetchUVData = async (code?: string) => {
    const raw = (code || postcode).trim();
    if (!/^\d{3,4}$/.test(raw)) {
      setPostcodeError("Please enter a valid 3 or 4-digit Australian postcode");
      return;
    }
    const lookupCode = normalizePostcodeForLookup(raw);
    const entry = postcodes[lookupCode];
    if (!entry) {
      setPostcodeError("Postcode not found. Please enter a valid Australian postcode.");
      return;
    }

    setPostcodeError("");
    setPostcode(lookupCode);
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${entry.lat}&longitude=${entry.lng}&current=uv_index&hourly=uv_index&daily=uv_index_max&timezone=auto&forecast_days=7`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("UV API response:", data);
      console.log("UV data:", data.current.uv_index);


      const currentUV = Number(data.current.uv_index);
      const riskInfo = getRiskLevel(currentUV);

      setUvData({
        value: currentUV,
        location: `${entry.suburb}, ${entry.state}`,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        ...riskInfo,
      });

      // Store current UV for other components
      localStorage.setItem("currentUV", String(currentUV));

      // Build hourly forecast from API data: full 24 hours of the day (00:00–23:00)
      const hourlyData: HourlyForecast[] = data.hourly.uv_index
        .slice(0, 24)
        .map((uvi: number, i: number) => {
          const uvIndex = Number(uvi);
          const timeStr = data.hourly.time[i] as string; // e.g. "2025-03-15T14:00"
          const hour = timeStr ? new Date(timeStr).getHours() : i;
          const hourLabel = timeStr
            ? new Date(timeStr).toLocaleTimeString("en-AU", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
            : `${String(hour).padStart(2, "0")}:00`;
          return {
            hour: hourLabel,
            uvIndex,
            color: getRiskLevel(uvIndex).color,
          };
        });
      setHourlyForecast(hourlyData);

      // Build weekly forecast from API data
      const weeklyData: WeeklyData[] = data.daily.uv_index_max.map((maxUvi: number, i: number) => {
        const date = new Date(data.daily.time[i]);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        const maxUV = Math.round(maxUvi);
        return {
          day: dayName,
          maxUV,
          minUV: Math.round(maxUV * 0.2),
        };
      });
      setWeeklyForecast(weeklyData);

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch UV data:", error);

      // // Fallback to mock data if API fails
      // const mockUV = Math.floor(Math.random() * 5) + 8;
      // const riskInfo = getRiskLevel(mockUV);
      // const currentHour = new Date().getHours();

      // setUvData({
      //   value: mockUV,
      //   location: `${entry.suburb}, ${entry.state}`,
      //   time: new Date().toLocaleTimeString("en-US", {
      //     hour: "2-digit",
      //     minute: "2-digit",
      //   }),
      //   ...riskInfo,
      // });

      // localStorage.setItem("currentUV", String(mockUV));
      // setHourlyForecast(generateHourlyForecast(currentHour));
      console.log("Hourly forecast is not generated");

      setLoading(false);
    }
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
  // Safe hours = UV < 3. These occur in two blocks: morning (midnight until UV rises) and evening (when UV drops until midnight).
  const getSafeHours = () => {
    if (hourlyForecast.length === 0) return null;
    const data = hourlyForecast;

    // Last consecutive safe hour from start of day (morning block)
    let morningEndIndex = -1;
    for (let i = 0; i < data.length; i++) {
      if (data[i].uvIndex >= 3) break;
      morningEndIndex = i;
    }

    // First consecutive safe hour from end of day (evening block)
    let eveningStartIndex = data.length;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].uvIndex >= 3) break;
      eveningStartIndex = i;
    }

    // No safe hours at all
    if (morningEndIndex === -1 && eveningStartIndex === data.length) return null;

    // Safe all day (one contiguous block)
    if (morningEndIndex === data.length - 1 || eveningStartIndex === 0) {
      return {
        start: data[0].hour,
        end: data[data.length - 1].hour,
      };
    }

    // Two blocks: morning and evening
    const morningRange =
      morningEndIndex >= 0 ? `${data[0].hour} – ${data[morningEndIndex].hour}` : null;
    const eveningRange =
      eveningStartIndex < data.length
        ? `${data[eveningStartIndex].hour} – ${data[data.length - 1].hour}`
        : null;

    if (morningRange && eveningRange) {
      return { start: morningRange, end: eveningRange };
    }
    if (morningRange) return { start: morningRange, end: "" };
    if (eveningRange) return { start: eveningRange, end: "" };
    return null;
  };

  useEffect(() => {
    // Read skin tone from localStorage
    const saved = localStorage.getItem("skinTone");
    if (saved) {
      setSkinTone(parseInt(saved));
    }

    // Load last used postcode or show dialog
    const savedPostcode = localStorage.getItem("postcode");
    if (savedPostcode) {
      setPostcode(savedPostcode);
      fetchUVData(savedPostcode);
    } else {
      setShowPostcodeDialog(true);
    }
  }, []);

  const handlePostcodeSubmit = () => {
    localStorage.setItem("postcode", postcode);
    fetchUVData();
  };

  const handleDialogSubmit = () => {
    const raw = dialogPostcode.trim();
    if (!/^\d{3,4}$/.test(raw)) {
      setPostcodeError("Please enter a valid 3 or 4-digit Australian postcode");
      return;
    }
    const lookupCode = normalizePostcodeForLookup(raw);
    const entry = postcodes[lookupCode];
    if (!entry) {
      setPostcodeError("Postcode not found. Please enter a valid Australian postcode.");
      return;
    }
    setPostcodeError("");
    setPostcode(lookupCode);
    localStorage.setItem("postcode", lookupCode);
    setShowPostcodeDialog(false);
    fetchUVData(lookupCode);
  };

  const safeHours = getSafeHours();

  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:p-10 max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto">
      {/* Postcode Dialog */}
      <Dialog open={showPostcodeDialog} onOpenChange={setShowPostcodeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Your Postcode</DialogTitle>
            <DialogDescription>
              We need your postcode to show local UV index data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 2000"
              value={dialogPostcode}
              onChange={(e) => {
                setDialogPostcode(e.target.value.replace(/\D/g, "").slice(0, 4));
                setPostcodeError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleDialogSubmit()}
              autoFocus
            />
            {postcodeError && (
              <p className="text-sm text-red-500">{postcodeError}</p>
            )}
            <Button onClick={handleDialogSubmit} className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Look Up
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Emergency Alert — top of page when UV high */}
      {uvData && !loading && uvData.value >= 8 && (
        <Alert className="mb-4 mt-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-900">
            <strong>High UV Warning:</strong> Avoid being outdoors between 10 AM and 4 PM.
            If you must go out, use SPF50+ sunscreen, wear UPF protective clothing, and don sunglasses and a wide-brimmed hat.
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="mb-6 pt-4">
        <h1 className="text-2xl lg:text-3xl mb-2">UV Protection Assistant</h1>
        {uvData && (
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{uvData.location}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDialogPostcode("");
                setPostcodeError("");
                setShowPostcodeDialog(true);
              }}
            >
              Change
            </Button>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      )}

      {!uvData && !loading && (
        <div className="text-center py-20 text-gray-500">
          <Sun className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="mb-4">Enter your postcode to check UV index</p>
          <Button onClick={() => setShowPostcodeDialog(true)} variant="default">
            Enter postcode
          </Button>
        </div>
      )}

      {uvData && !loading && (
      <>
      {/* UV Dashboard + Hourly: side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mb-6">
      {/* UV Index Dashboard */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
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
          onClick={() => fetchUVData()}
          className="w-full mt-4"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Hourly Forecast – UV index vs time of day (area chart) */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-600" />
            Daily UV Forecast
          </h3>
        </div>
        {hourlyForecast.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">
            Enter a postcode and load data to see the UV forecast.
          </div>
        ) : (
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={hourlyForecast.map((item) => ({
                  time: item.hour,
                  uv: item.uvIndex,
                  fill: item.color ?? getUVColor(item.uvIndex),
                }))}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="uvAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "#d1d5db" }}
                />
                <YAxis
                  dataKey="uv"
                  name="UV Index"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "#d1d5db" }}
                  domain={[0, 10]}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg">
                        <div className="font-medium">{d.time}</div>
                        <div
                          className="mt-1"
                          style={{ color: getUVColor(d.uv) }}
                        >
                          UV Index: <span className="font-semibold">{d.uv}</span>
                        </div>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="uv"
                  stroke="#f97316"
                  strokeWidth={2}
                  fill="url(#uvAreaGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      </div>{/* end grid */}

      {/* Safe Hours + Weekly: side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mb-6">
      {/* Safe Hours */}
      {safeHours && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-md p-6 text-white">
          <div className="flex items-start">
            <Moon className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Safe Outdoor Hours</h3>
              <p className="text-sm opacity-90 mb-2">
                UV index below 3 - safe for outdoor activities without extensive protection
              </p>
              <div className="text-lg font-semibold">
                {safeHours.end ? (
                  <>
                    <span>{safeHours.start}</span>
                    <span className="mx-2">,</span>
                    <span>{safeHours.end}</span>
                  </>
                ) : (
                  <span>{safeHours.start}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Trend */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6">
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
      </div>{/* end grid */}

      {/* Bottom row: Personalized + Explanation side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mb-6">
      {/* Personalized Advice */}
      {skinTone && uvData && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6">
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
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-md p-6 text-white cursor-pointer hover:shadow-lg transition-shadow">
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
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6">
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
      </div>{/* end grid */}

      </>
      )}
    </div>
  );
}
