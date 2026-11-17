import { productDetailsSchema } from "@/schemas/products";

// Exact section-4 copy from the owner-supplied Gym Shop document (2026-11-17).
// Unresolved bracket placeholders are missing values, not manufacturer facts.
export const previewProductDetails = productDetailsSchema
  .refine(
    (items) =>
      items.length === 10 && items.every((item) => item.status === "preview"),
    "Keep the ten supplied details as separate previews.",
  )
  .parse([
    {
      productId: "whey-protein-powder",
      status: "preview",
      headline: "Fuel Your Recovery. Support Your Progress.",
      description: [
        "Give your body a convenient source of protein with Whey Protein Powder. Designed to complement an active lifestyle, it makes it easier to work toward daily protein goals while supporting muscle maintenance and recovery after training.",
        "Whether you're focused on strength training, fitness, or everyday nutrition, whey protein can be a practical addition to your routine.",
      ],
      highlights: [
        "Convenient source of dietary protein",
        "Supports muscle maintenance and recovery as part of a balanced diet",
        "Suitable for post-workout or everyday protein intake",
        "Easy to include in smoothies and shakes",
      ],
      idealFor:
        "Gym enthusiasts, strength-training individuals, and people looking to supplement their daily protein intake.",
      guidance: {
        heading: "How to Use",
        body: "Mix the serving quantity specified on the product label with water or milk. Follow the manufacturer's preparation and serving instructions.",
      },
      specifications: [
        {
          label: "Brand",
          value: null,
        },
        {
          label: "Flavor",
          value: null,
        },
        {
          label: "Net Weight",
          value: null,
        },
        {
          label: "Protein per Serving",
          value: null,
        },
        {
          label: "Ingredients & Allergens",
          value: null,
        },
      ],
    },
    {
      productId: "creatine-monohydrate",
      status: "preview",
      headline: "Build Strength. Train with Purpose.",
      description: [
        "Make the most of your strength-focused training routine with Creatine Monohydrate. Creatine supplementation can help improve performance during repeated bouts of short-duration, high-intensity exercise when used appropriately alongside consistent training.",
        "A practical supplement for those focused on strength, power, and gym performance.",
      ],
      highlights: [
        "Supports performance during repeated high-intensity exercise",
        "Complements strength and power training",
        "Convenient addition to a consistent fitness routine",
        "Suitable for use according to manufacturer instructions",
      ],
      idealFor:
        "Individuals involved in resistance training, weightlifting, and high-intensity exercise.",
      guidance: {
        heading: "How to Use",
        body: "Follow the serving and preparation instructions provided by the manufacturer. Maintain appropriate hydration.",
      },
      specifications: [
        {
          label: "Brand",
          value: null,
        },
        {
          label: "Net Weight",
          value: null,
        },
        {
          label: "Creatine Type",
          value: null,
        },
        {
          label: "Ingredients",
          value: null,
        },
        {
          label: "Serving Size",
          value: null,
        },
      ],
    },
    {
      productId: "pre-workout-formula",
      status: "preview",
      headline: "Get Ready for Your Next Challenge.",
      description: [
        "Prepare for your training session with a pre-workout supplement designed to fit into your performance-focused routine. Whether you're preparing for strength exercises or an intensive gym session, choose a formula that matches your preferences and training needs.",
      ],
      highlights: [
        "Convenient pre-training supplement",
        "Available in different formulas and flavors",
        "Can complement a structured workout routine",
        "Formula-specific benefits depend on verified ingredients",
      ],
      idealFor:
        "Adult gym-goers who understand their tolerance and want to incorporate a suitable pre-workout product into their routine.",
      guidance: {
        heading: "How to Use",
        body: "Follow the product label. Check caffeine and other stimulant content before use. Avoid combining stimulant-containing products without appropriate guidance.",
      },
      specifications: [
        {
          label: "Brand",
          value: null,
        },
        {
          label: "Flavor",
          value: null,
        },
        {
          label: "Net Weight",
          value: null,
        },
        {
          label: "Caffeine per Serving",
          value: null,
        },
        {
          label: "Active Ingredients",
          value: null,
        },
      ],
    },
    {
      productId: "mass-gainer-powder",
      status: "preview",
      headline: "More Nutrition for Bigger Goals.",
      description: [
        "Reaching a higher daily calorie target can be challenging. Mass Gainer Powder offers a convenient way to add calories and protein to your eating routine.",
        "Designed for individuals looking to increase their energy intake alongside consistent strength training and balanced nutrition.",
      ],
      highlights: [
        "Convenient supplemental source of calories",
        "Can help meet higher daily energy requirements",
        "Provides protein and other nutrients according to the formula",
        "Easy to incorporate into a structured nutrition plan",
      ],
      idealFor:
        "Individuals who need additional dietary calories and are pursuing muscle-gain or weight-gain goals.",
      guidance: {
        heading: "How to Use",
        body: "Prepare according to the manufacturer's instructions. Choose serving amounts that fit your overall calorie and protein needs.",
      },
      specifications: [
        {
          label: "Brand",
          value: null,
        },
        {
          label: "Flavor",
          value: null,
        },
        {
          label: "Net Weight",
          value: null,
        },
        {
          label: "Calories per Serving",
          value: null,
        },
        {
          label: "Protein per Serving",
          value: null,
        },
        {
          label: "Ingredients & Allergens",
          value: null,
        },
      ],
    },
    {
      productId: "adjustable-dumbbell-set",
      status: "preview",
      headline: "Stronger Training Starts Here.",
      description: [
        "Bring versatile strength training into your workout space with an Adjustable Dumbbell Set. Ideal for a variety of resistance exercises, adjustable dumbbells allow you to change training loads as your routine develops.",
        "From basic movements to more challenging strength sessions, this equipment helps you create a flexible training environment.",
      ],
      highlights: [
        "Adjustable training resistance",
        "Suitable for a variety of strength exercises",
        "Practical for home or personal training spaces",
        "Supports progressive strength-training routines",
      ],
      idealFor:
        "Home gym users, strength-training beginners, and experienced fitness enthusiasts.",
      guidance: {
        heading: "Suggested Exercises",
        body: "Dumbbell curls, shoulder presses, rows, lunges, and other appropriately performed resistance exercises.",
      },
      specifications: [
        {
          label: "Brand",
          value: null,
        },
        {
          label: "Set Weight Range",
          value: null,
        },
        {
          label: "Adjustment Mechanism",
          value: null,
        },
        {
          label: "Material",
          value: null,
        },
        {
          label: "Included Components",
          value: null,
        },
      ],
    },
    {
      productId: "resistance-bands-set",
      status: "preview",
      headline: "Small Equipment. More Workout Possibilities.",
      description: [
        "Add flexibility to your training routine with a Resistance Bands Set. Lightweight and easy to carry, resistance bands are useful for warm-ups, controlled strengthening exercises, and a variety of mobility-focused movements.",
        "Train at home, at the gym, or wherever your fitness routine takes you.",
      ],
      highlights: [
        "Multiple exercise possibilities",
        "Useful for strength and mobility routines",
        "Lightweight and portable",
        "Suitable for different fitness levels when the appropriate resistance is selected",
      ],
      idealFor:
        "Home workout enthusiasts, gym members, trainers, and people looking for versatile exercise accessories.",
      guidance: {
        heading: "Suggested Exercises",
        body: "Band rows, lateral steps, shoulder warm-ups, and controlled resistance movements.",
      },
      specifications: [
        {
          label: "Brand",
          value: null,
        },
        {
          label: "Resistance Levels",
          value: null,
        },
        {
          label: "Material",
          value: null,
        },
        {
          label: "Band Type",
          value: null,
        },
        {
          label: "Package Contents",
          value: null,
        },
      ],
    },
    {
      productId: "training-gloves",
      status: "preview",
      headline: "Comfort in Every Rep.",
      description: [
        "Stay focused on your training with gloves designed for gym sessions and equipment-based workouts. A practical addition to your gym bag, training gloves provide an extra layer between your hands and workout equipment.",
      ],
      highlights: [
        "Extra hand coverage during training",
        "Suitable for selected lifting and gym exercises",
        "Convenient everyday gym accessory",
        "Available in different sizes and styles",
      ],
      idealFor:
        "Gym members, recreational lifters, and people who prefer wearing gloves during workouts.",
      guidance: null,
      specifications: [
        {
          label: "Brand",
          value: null,
        },
        {
          label: "Available Sizes",
          value: null,
        },
        {
          label: "Material",
          value: null,
        },
        {
          label: "Closure Type",
          value: null,
        },
        {
          label: "Care Instructions",
          value: null,
        },
      ],
    },
    {
      productId: "lifting-straps",
      status: "preview",
      headline: "Stay Focused on Every Lift.",
      description: [
        "Lifting Straps are a useful accessory for selected pulling exercises where grip can become a limiting factor. Designed to support your connection with the bar, they can complement your strength-training routine when used correctly.",
      ],
      highlights: [
        "Additional grip assistance for selected lifting movements",
        "Useful during rows, deadlifts, and related exercises",
        "Compact and easy to carry",
        "Practical addition to a strength-training kit",
      ],
      idealFor:
        "Experienced gym-goers and individuals incorporating pulling exercises into their strength-training programs.",
      guidance: {
        heading: "How to Use",
        body: "Wrap and secure according to the manufacturer's instructions. Use appropriate loads and safe lifting technique.",
      },
      specifications: [
        {
          label: "Brand",
          value: null,
        },
        {
          label: "Material",
          value: null,
        },
        {
          label: "Strap Length",
          value: null,
        },
        {
          label: "Strap Style",
          value: null,
        },
        {
          label: "Package Contents",
          value: null,
        },
      ],
    },
    {
      productId: "protein-shaker-bottle",
      status: "preview",
      headline: "Mix It. Carry It. Keep Moving.",
      description: [
        "Make your daily fitness routine more convenient with a Protein Shaker Bottle. From post-workout protein shakes to everyday drink mixes, this practical accessory helps keep your favorite beverages close at hand.",
      ],
      highlights: [
        "Convenient for mixing powdered beverages",
        "Easy to carry between home, work, and the gym",
        "Suitable for everyday fitness routines",
        "Available in a range of sizes and styles",
      ],
      idealFor:
        "Gym members, active individuals, and anyone who regularly prepares supplement drinks.",
      guidance: null,
      specifications: [
        {
          label: "Brand",
          value: null,
        },
        {
          label: "Capacity",
          value: null,
        },
        {
          label: "Material",
          value: null,
        },
        {
          label: "Mixing Mechanism",
          value: null,
        },
        {
          label: "Cleaning Instructions",
          value: null,
        },
      ],
    },
    {
      productId: "exercise-training-mat",
      status: "preview",
      headline: "Create Space for Every Movement.",
      description: [
        "Make room for stretching, floor exercises, and mobility sessions with an Exercise Training Mat. Whether you're warming up before a workout or practicing controlled bodyweight movements, a dedicated exercise surface helps organize your routine.",
      ],
      highlights: [
        "Suitable for floor-based exercise routines",
        "Practical for home and studio workouts",
        "Convenient for stretching and mobility sessions",
        "Available in different sizes and thicknesses",
      ],
      idealFor:
        "Home fitness enthusiasts, yoga practitioners, and individuals who enjoy floor-based workouts.",
      guidance: null,
      specifications: [
        {
          label: "Brand",
          value: null,
        },
        {
          label: "Dimensions",
          value: null,
        },
        {
          label: "Thickness",
          value: null,
        },
        {
          label: "Material",
          value: null,
        },
        {
          label: "Care Instructions",
          value: null,
        },
      ],
    },
  ]);
