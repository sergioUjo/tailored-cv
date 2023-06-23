export type Plan = "sniffer" | "hunter" | "professional";
export const planStore = {
  sniffer: {
    name: "Sniffer",
    id: "sniffer" as const,
    price: 569,
    words: 50000,
    description:
      "The best option for scanning the market, see what you are worth.",
    features: [
      "Individual configuration",
      "AI Words 50k ~20 CV's",
      "Résumé writer",
      "Cover Letter writer",
    ],
  },
  hunter: {
    name: "Hunter",
    id: "hunter" as const,
    price: 1069,
    words: 110000,
    description: "The go-to if you are on a job hunt. Get the best results.",
    features: [
      "Individual configuration",
      "AI Words 110k ~44 CV's",
      "Résumé writer",
      "Cover Letter writer",
    ],
  },
  professional: {
    name: "Professional",
    id: "professional" as const,
    price: 2069,
    words: 240000,
    description: "Best for someone writing CV's on a daily basis.",
    features: [
      "Individual configuration",
      "AI Words 250k ~120 CV's",
      "Résumé writer",
      "Cover Letter writer",
    ],
  },
};
