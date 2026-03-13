const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// Structured output schema for skin analysis
const responseSchema = {
  type: "OBJECT",
  properties: {
    title: {
      type: "STRING",
      description: "Always 'Your Detailed Skin Analysis'",
    },
    typical_characteristics: {
      type: "ARRAY",
      items: { type: "STRING" },
      description:
        "4-6 bullet points describing the typical physical characteristics of this skin type",
    },
    uv_sensitivity_analysis: {
      type: "OBJECT",
      properties: {
        summary: {
          type: "STRING",
          description:
            "A 2-3 sentence summary of UV sensitivity for this skin type",
        },
        burn_time_estimate: {
          type: "STRING",
          description:
            "Estimated burn time under UV index 10 (e.g. '10-15 minutes')",
        },
        risk_factors: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "2-3 specific UV risk factors for this skin type",
        },
      },
      required: ["summary", "burn_time_estimate", "risk_factors"],
    },
    biological_mechanism: {
      type: "OBJECT",
      properties: {
        melanin_level: {
          type: "STRING",
          description:
            "Melanin level description (e.g. 'Extremely Low', 'Moderate', 'Very High')",
        },
        mechanism_explanation: {
          type: "STRING",
          description:
            "2-3 sentence explanation of the biological mechanism of UV response for this skin type, including melanin production and vitamin D synthesis",
        },
        vitamin_d_note: {
          type: "STRING",
          description:
            "A note about vitamin D synthesis efficiency for this skin type",
        },
      },
      required: ["melanin_level", "mechanism_explanation", "vitamin_d_note"],
    },
    personalized_recommendations: {
      type: "ARRAY",
      items: { type: "STRING" },
      description:
        "5-7 actionable, personalized sun protection recommendations for this skin type",
    },
  },
  required: [
    "title",
    "typical_characteristics",
    "uv_sensitivity_analysis",
    "biological_mechanism",
    "personalized_recommendations",
  ],
};

// The system prompt for Gemini
const SYSTEM_PROMPT = `You are a dermatology and UV protection expert AI assistant for GlowSafe, an Australian sun safety app. Your role is to provide accurate, evidence-based skin analysis based on the Fitzpatrick skin classification system.

When given a skin type description, generate a comprehensive yet concise analysis covering:
1. Typical Characteristics - physical traits associated with this skin type
2. UV Sensitivity Analysis - how this skin type reacts to UV radiation, burn time estimates, and risk factors
3. Biological Mechanism - the role of melanin, how UV affects this skin type at a cellular level, and vitamin D synthesis implications
4. Personalized Recommendations - actionable, specific sun protection advice tailored to this skin type in the Australian context (high UV environment)

Important guidelines:
- Be scientifically accurate but accessible to a general audience
- Frame recommendations in the Australian context (high UV index, outdoor lifestyle)
- Include both protection advice and vitamin D considerations
- Be sensitive and inclusive in language
- Do NOT provide medical diagnoses; encourage professional consultation where appropriate`;

export interface SkinAnalysisResult {
  title: string;
  typical_characteristics: string[];
  uv_sensitivity_analysis: {
    summary: string;
    burn_time_estimate: string;
    risk_factors: string[];
  };
  biological_mechanism: {
    melanin_level: string;
    mechanism_explanation: string;
    vitamin_d_note: string;
  };
  personalized_recommendations: string[];
}

export async function fetchSkinAnalysis(
  skinTypeDescription: string
): Promise<SkinAnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key is not configured");
  }

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Analyze the following Fitzpatrick skin type and provide a detailed skin analysis:\n\n${skinTypeDescription}`,
          },
        ],
      },
    ],
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `Gemini API error: ${response.status} ${errorData?.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No response from Gemini API");
  }

  return JSON.parse(text) as SkinAnalysisResult;
}
