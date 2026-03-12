import { useState } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface KnowledgeItem {
  id: string;
  title: string;
  icon: string;
  content: {
    description: string;
    statistics: string[];
    recommendations: string[];
    source: string;
    sourceUrl: string;
  };
}

export function KnowledgeCenter() {
  const knowledgeData: KnowledgeItem[] = [
    {
      id: "dna-damage",
      title: "DNA Damage & Cell Mutation",
      icon: "🧬",
      content: {
        description:
          "Ultraviolet radiation (especially UVB) can directly damage DNA structure in skin cells, leading to the formation of thymine dimers. If these damages are not repaired promptly, they can trigger genetic mutations and increase skin cancer risk.",
        statistics: [
          "About 80% of new cancer cases in Australia each year are related to skin cancer",
          "Excessive UV exposure increases basal cell carcinoma risk by 50-100%",
          "Each severe sunburn can double melanoma risk",
        ],
        recommendations: [
          "Avoid prolonged sun exposure when UV index ≥3",
          "Use SPF30+ broad-spectrum sunscreen to protect skin",
          "Get regular skin cancer screenings (recommended annually)",
        ],
        source: "Cancer Council Australia",
        sourceUrl: "https://www.cancer.org.au",
      },
    },
    {
      id: "photoaging",
      title: "Photoaging & Skin Aging",
      icon: "👴",
      content: {
        description:
          "UVA rays can penetrate the dermis, destroying collagen and elastic fibers, causing skin to lose elasticity, develop wrinkles, and experience pigmentation. This UV-induced skin aging is called photoaging and accounts for over 80% of skin aging factors.",
        statistics: [
          "Long-term UV exposure can accelerate skin aging by 24%",
          "Australian sunlight intensity is 3-4 times stronger than Europe",
          "80% of facial wrinkles are caused by UV radiation",
        ],
        recommendations: [
          "Use sunscreen with antioxidants daily",
          "Choose PA++++ or broad-spectrum sunscreen to fight UVA",
          "Use skincare products containing vitamins C and E for repair",
          "Wear wide-brimmed hats and UV protective sunglasses",
        ],
        source: "Australian Radiation Protection and Nuclear Safety Agency (ARPANSA)",
        sourceUrl: "https://www.arpansa.gov.au",
      },
    },
    {
      id: "skin-cancer",
      title: "Skin Cancer Risk Assessment",
      icon: "⚠️",
      content: {
        description:
          "Australia has one of the highest skin cancer rates in the world. Main types include basal cell carcinoma (BCC), squamous cell carcinoma (SCC), and malignant melanoma. Early detection and prevention are key.",
        statistics: [
          "2 in 3 Australians will be diagnosed with skin cancer by age 70",
          "About 2,000 Australians die from skin cancer each year",
          "Melanoma is the most common cancer in people aged 15-39",
          "Childhood sunburns correlate with adult melanoma incidence",
        ],
        recommendations: [
          "Follow the 'Slip, Slop, Slap, Seek, Slide' principle",
          "Use the SunSmart app to monitor daily UV index",
          "Learn the ABCDE self-check method to identify suspicious moles",
          "High-risk groups (fair skin, family history) should get checked every 6 months",
        ],
        source: "Cancer Council Australia & Melanoma Institute Australia",
        sourceUrl: "https://www.melanoma.org.au",
      },
    },
    {
      id: "eye-damage",
      title: "UV Eye Damage",
      icon: "👁️",
      content: {
        description:
          "Long-term UV exposure can lead to various eye diseases, including cataracts, pterygium, keratitis, and macular degeneration. Eyes are particularly sensitive to UV radiation as the lens absorbs UVB rays.",
        statistics: [
          "Australia's cataract rate is 40% higher than Europe",
          "Long-term outdoor workers have 3x higher risk of pterygium",
          "Snow, water, and beach sand can reflect up to 80% of UV radiation to eyes",
        ],
        recommendations: [
          "Choose sunglasses labeled 'UV400' or '100% UV protection'",
          "Wear wraparound sunglasses during outdoor activities",
          "Wide-brimmed hats can additionally block 50% of UV reaching eyes",
          "Children's eyes are more vulnerable - develop protective habits early",
        ],
        source: "Optometry Australia",
        sourceUrl: "https://www.optometry.org.au",
      },
    },
    {
      id: "vitamin-d",
      title: "Vitamin D & UV Balance",
      icon: "☀️",
      content: {
        description:
          "While UV radiation is harmful, moderate sun exposure is crucial for vitamin D synthesis. Vitamin D is important for bone health, immune system, and mental health. The key is finding the balance between safe exposure and protection.",
        statistics: [
          "About 31% of Australian adults have insufficient vitamin D levels",
          "In summer, people with medium skin tone need only 6-8 minutes of sun daily for vitamin D",
          "Winter requires 2-3 times more sun exposure",
        ],
        recommendations: [
          "Do outdoor activities when UV index <3 (usually morning or evening)",
          "Expose arms and legs, avoid direct facial sun exposure",
          "People with darker skin need longer sun exposure",
          "If unable to get enough sunlight, consider vitamin D supplements (consult doctor)",
        ],
        source: "Australian Government Department of Health",
        sourceUrl: "https://www.health.gov.au",
      },
    },
    {
      id: "children-protection",
      title: "Children UV Protection Essentials",
      icon: "👶",
      content: {
        description:
          "Children's skin is thinner and more sensitive than adults, with weaker resistance to UV damage. Research shows that childhood UV exposure has the greatest impact on adult skin cancer rates.",
        statistics: [
          "Childhood UV exposure accounts for 50-80% of lifetime total",
          "Skin of babies under 6 months hasn't fully developed melanin protection",
          "Each severe sunburn (especially before age 18) doubles lifetime melanoma risk",
        ],
        recommendations: [
          "Keep babies under 6 months completely out of direct sunlight",
          "Choose UPF50+ sun-protective clothing for children",
          "Use children's sunscreen (SPF50+, broad-spectrum)",
          "Foster 'No hat, no play' outdoor activity habits",
          "Schools should provide shade when UV index ≥3",
        ],
        source: "Cancer Council Australia - SunSmart Schools Program",
        sourceUrl: "https://www.sunsmart.com.au",
      },
    },
  ];

  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-orange-50 pb-6">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-screen-sm mx-auto px-6 py-6">
          <h1 className="text-2xl mb-2">UV Health Knowledge Center</h1>
          <p className="text-sm text-gray-600">
            Based on scientific data and recommendations from Australian authorities
          </p>
        </div>
      </div>

      {/* Knowledge List */}
      <div className="max-w-screen-sm mx-auto px-6 py-6">
        <Accordion
          type="single"
          collapsible
          value={expandedId || ""}
          onValueChange={(value) => setExpandedId(value || null)}
        >
          {knowledgeData.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="bg-white rounded-2xl shadow-md mb-4 border-none overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                <div className="flex items-center">
                  <span className="text-3xl mr-4">{item.icon}</span>
                  <span className="text-left font-medium">{item.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                {/* Description */}
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  {item.content.description}
                </p>

                {/* Statistics */}
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2 text-orange-700">
                    📊 Key Statistics
                  </h4>
                  <ul className="space-y-2">
                    {item.content.statistics.map((stat, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 pl-4 border-l-2 border-orange-200"
                      >
                        {stat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2 text-green-700">
                    ✅ Protection Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {item.content.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700 flex">
                        <ChevronRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Data Source */}
                <div className="bg-gray-50 rounded-lg p-3 mt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Data Source</p>
                      <p className="text-sm font-medium text-gray-700">
                        {item.content.source}
                      </p>
                    </div>
                    <a
                      href={item.content.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Emergency Contact */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mt-6">
          <h3 className="font-semibold text-red-900 mb-3">⚠️ Emergency Alert</h3>
          <p className="text-sm text-red-800 mb-3">
            If you notice any of the following abnormalities on your skin, seek medical attention immediately:
          </p>
          <ul className="text-sm text-red-800 space-y-1 ml-4">
            <li>• Changes in size, shape, or color of moles</li>
            <li>• New irregular pigmented spots</li>
            <li>• Non-healing ulcers or bleeding lesions</li>
            <li>• Persistently itchy or painful skin areas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
