import { useState, useEffect } from "react";
import { Check, Info, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { fetchSkinAnalysis, type SkinAnalysisResult } from "../lib/gemini";

interface SkinType {
  level: number;
  name: string;
  description: string;
  characteristics: string[];
  burnTime: string;
  vitaminD: string;
  melaninLevel: string;
  color: string;
}

const API_BASE = "/api";

// Tailwind only includes classes that appear in source. Map level → class so colors are never purged.
const SKIN_COLOR_CLASSES: Record<number, string> = {
  1: "bg-stone-100",
  2: "bg-amber-50",
  3: "bg-amber-100",
  4: "bg-amber-200",
  5: "bg-amber-700",
  6: "bg-amber-900",
};

export function SkinToneTool() {
  const [skinTypes, setSkinTypes] = useState<SkinType[]>([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [typesError, setTypesError] = useState<string | null>(null);
  const [selectedSkin, setSelectedSkin] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<SkinAnalysisResult | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchTypes() {
      setTypesLoading(true);
      setTypesError(null);
      try {
        const res = await fetch(`${API_BASE}/skinprofiles/types`);
        if (!res.ok) throw new Error("Failed to load skin types");
        const data = await res.json();
        if (!cancelled) setSkinTypes(data);
      } catch (err) {
        if (!cancelled) {
          setTypesError(
            err instanceof Error ? err.message : "Failed to load skin types",
          );
        }
      } finally {
        if (!cancelled) setTypesLoading(false);
      }
    }
    fetchTypes();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const savedVal = localStorage.getItem("skinTone");
    if (savedVal) {
      setSelectedSkin(parseInt(savedVal, 10));
    }
  }, []);

  const handleSave = () => {
    if (selectedSkin) {
      localStorage.setItem("skinTone", selectedSkin.toString());
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const selectedType = skinTypes.find((s) => s.level === selectedSkin);

  // Fetch AI analysis when skin type is selected and saved
  const handleAnalyze = async () => {
    if (!selectedType) return;

    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      // Build the description string from the skin type object
      const description = [
        `Fitzpatrick Skin Type ${selectedType.level}: ${selectedType.name}`,
        `Description: ${selectedType.description}`,
        `Characteristics: ${selectedType.characteristics.join("; ")}`,
        `Typical burn time (UV index 10): ${selectedType.burnTime}`,
        `Melanin level: ${selectedType.melaninLevel}`,
        `Vitamin D info: ${selectedType.vitaminD}`,
      ].join("\n");

      const result = await fetchSkinAnalysis(description);
      setAnalysisResult(result);
    } catch (err) {
      setAnalysisError(
        err instanceof Error ? err.message : "Failed to fetch analysis",
      );
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-screen-sm mx-auto px-6 py-6">
          <h1 className="text-2xl mb-2">Skin Tone Personalized Analysis</h1>
          <p className="text-sm text-gray-600">
            Get personalized protection advice based on Fitzpatrick skin
            classification
          </p>
        </div>
      </div>

      <div className="max-w-screen-sm mx-auto px-6 py-6">
        {/* Instructions */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Select the type that best matches your skin characteristics. This
            will help calculate your burn time under different UV intensities
            and vitamin D synthesis needs.
          </AlertDescription>
        </Alert>

        {/* Skin types loading / error */}
        {typesLoading && (
          <div className="flex items-center justify-center py-8 mb-6">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        )}
        {typesError && (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{typesError}</AlertDescription>
          </Alert>
        )}

        {/* Skin Tone Selector */}
        <div className="space-y-3 mb-6">
          {!typesLoading &&
            skinTypes.map((skin) => (
              <button
                key={skin.level}
                onClick={() => setSelectedSkin(skin.level)}
                className={`w-full text-left bg-white rounded-2xl shadow-md p-4 transition-all ${
                  selectedSkin === skin.level
                    ? "ring-2 ring-orange-500 shadow-lg"
                    : "hover:shadow-lg"
                }`}
              >
                <div className="flex items-start">
                  {/* Color Indicator - use map so Tailwind includes classes (API color can be purged) */}
                  <div
                    className={`w-12 h-12 rounded-xl ${SKIN_COLOR_CLASSES[skin.level] ?? skin.color} flex-shrink-0 mr-4 ${
                      skin.level >= 5 ? "border border-gray-300" : ""
                    }`}
                  ></div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-sm">{skin.name}</h3>
                      {selectedSkin === skin.level && (
                        <Check className="w-5 h-5 text-orange-500 flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {skin.description}
                    </p>
                    <div className="text-xs text-gray-500">
                      Burn Time:{" "}
                      <span className="font-medium">{skin.burnTime}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
        </div>

        {/* Save Button */}
        {selectedSkin && (
          <Button onClick={handleSave} className="w-full mb-6">
            {saved ? "✓ Settings Saved" : "Save Skin Tone Settings"}
          </Button>
        )}

        {/* AI Analysis Button */}
        {selectedSkin && (
          <Button
            onClick={handleAnalyze}
            disabled={analysisLoading}
            variant="outline"
            className="w-full mb-6"
          >
            {analysisLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating AI Analysis...
              </>
            ) : (
              "Generate AI Skin Analysis"
            )}
          </Button>
        )}

        {/* Analysis Error */}
        {analysisError && (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{analysisError}</AlertDescription>
          </Alert>
        )}

        {/* AI-Powered Detailed Analysis */}
        {analysisResult && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h3 className="font-semibold mb-4">{analysisResult.title}</h3>

            {/* Characteristics */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Typical Characteristics
              </h4>
              <ul className="space-y-2">
                {analysisResult.typical_characteristics.map((char, index) => (
                  <li key={index} className="text-sm text-gray-600 flex">
                    <span className="mr-2">•</span>
                    <span>{char}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* UV Sensitivity */}
            <div className="bg-orange-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-orange-900 mb-2">
                UV Sensitivity Analysis
              </h4>
              <p className="text-sm text-orange-800 mb-2">
                {analysisResult.uv_sensitivity_analysis.summary}
              </p>
              <p className="text-sm text-orange-800 mb-2">
                Estimated burn time (UV index 10):{" "}
                <strong>
                  {analysisResult.uv_sensitivity_analysis.burn_time_estimate}
                </strong>
              </p>
              <ul className="space-y-1">
                {analysisResult.uv_sensitivity_analysis.risk_factors.map(
                  (factor, index) => (
                    <li key={index} className="text-xs text-orange-700 flex">
                      <span className="mr-2">⚠️</span>
                      <span>{factor}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Biological Mechanism */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Biological Mechanism
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-blue-700 font-medium">
                    Melanin Level:
                  </span>
                  <span className="text-sm text-blue-800 ml-2">
                    {analysisResult.biological_mechanism.melanin_level}
                  </span>
                </div>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {analysisResult.biological_mechanism.mechanism_explanation}
                </p>
                <p className="text-xs text-blue-700 italic">
                  {analysisResult.biological_mechanism.vitamin_d_note}
                </p>
              </div>
            </div>

            {/* Personalized Recommendations */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-900 mb-2">
                Personalized Recommendations
              </h4>
              <ul className="text-sm text-green-800 space-y-1">
                {analysisResult.personalized_recommendations.map(
                  (rec, index) => (
                    <li key={index}>• {rec}</li>
                  ),
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Fitzpatrick Explanation */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-semibold mb-3">
            About Fitzpatrick Skin Classification
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            The Fitzpatrick skin classification system was developed by Harvard
            dermatologist Thomas Fitzpatrick in 1975 and is the globally
            recognized standard for assessing skin's response to ultraviolet
            radiation.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            The system is primarily based on skin's reaction after sun exposure
            (burn vs. tan), genetic pigmentation levels, and melanin content. In
            Australia's multicultural context, accurately assessing skin type is
            crucial for personalized UV protection.
          </p>
        </div>
      </div>
    </div>
  );
}
