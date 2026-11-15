export const site = {
  name: "Crossfit Gym",
  tagline: "One step closer.",
  phone: "01323-275695",
  telephone: "+8801323275695",
  address:
    "House 2, Road 2/A, Sector 12, Sonargoan Janapat Road, Uttara, Dhaka, Bangladesh, 1230",
  shortAddress: "Sector 12, Uttara · Dhaka",
  instagram: "https://www.instagram.com/crossfit_gym_uttara/",
  facebook: "https://www.facebook.com/crossfitbangladesh/",
  directions:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      "Crossfit Gym House 2 Road 2/A Sector 12 Uttara Dhaka Bangladesh",
    ),
  timezone: "Asia/Dhaka",
  preview: true,
} as const;
export const gymImage = {
  src: "/images/brand/cover.webp",
  alt: "Gym interior shown in the supplied Crossfit Gym cover image",
  width: 851,
  height: 315,
};
