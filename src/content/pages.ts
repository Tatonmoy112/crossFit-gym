export const pageContent = {
  programs: {
    eyebrow: "YOUR NEXT CHAPTER",
    title: "Find your\nstarting point.",
    description:
      "Explore training with Crossfit Gym in Uttara. Speak to the team about current programs and the right place to begin.",
    label: "Training programs",
    pending: "Our program guide is being prepared.",
    detail:
      "Contact the gym for the current training options. Approved program names, descriptions and photographs are needed before this catalog can be published.",
  },
  coaches: {
    eyebrow: "THE PEOPLE BEHIND YOUR PROGRESS",
    title: "Meet your\nteam.",
    description:
      "Get to know the people behind Crossfit Gym. Contact the gym to learn about its current coaching team.",
    label: "Our coaches",
    pending: "Meet the team, soon.",
    detail:
      "Coach biographies, credentials and portraits are awaiting approval. We won’t substitute another gym’s staff profiles.",
  },
  blog: {
    eyebrow: "THE CROSSFIT GYM JOURNAL",
    title: "A little\ninspiration.",
    description:
      "A space for stories, training insights and updates from the gym.",
    label: "Latest stories",
    pending: "The first chapter is on its way.",
    detail:
      "Approved articles, authors and photography are needed before the journal is published.",
  },
  careers: {
    eyebrow: "BUILD SOMETHING TOGETHER",
    title: "Your next\nmove.",
    description:
      "Interested in working with Crossfit Gym? Get in touch with the team to ask about current opportunities.",
    label: "Opportunities",
    pending: "Ask us about opportunities.",
    detail:
      "Current vacancies and application instructions have not been supplied. Contact the gym for recruitment information.",
  },
  supplements: {
    eyebrow: "THE SUPPLEMENT GUIDE",
    title: "Know what\nyou choose.",
    description:
      "Product information and an inquiry catalog, with details supplied by the gym.",
    label: "Product catalog",
    pending: "Product information is being prepared.",
    detail:
      "The gym’s product catalog, ingredients, variants and prices are awaiting approval. No purchases can be made on this website.",
  },
} as const;
export type CatalogKind = keyof typeof pageContent;
export const previewSections: Record<CatalogKind, string[]> = {
  programs: [
    "Program overview",
    "Who it’s for",
    "What’s included",
    "Training approach",
    "Meet your coaches",
    "Related classes",
    "Membership options",
  ],
  coaches: [
    "Biography",
    "Credentials",
    "Coaching specialties",
    "Programs and classes",
  ],
  blog: ["Introduction", "Article content", "Key takeaways"],
  careers: [
    "Role overview",
    "Responsibilities",
    "Requirements",
    "Benefits",
    "How to apply",
  ],
  supplements: [
    "Product overview",
    "Ingredients",
    "Directions for use",
    "Variants and pack sizes",
    "Product information",
  ],
};
