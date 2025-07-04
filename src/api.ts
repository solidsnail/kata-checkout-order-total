export const API_RESPONSE = {
  soup: {
    id: "soup",
    src: "https://cdn-icons-png.flaticon.com/512/2388/2388080.png",
    price: 1.89,
    byWeight: false,
    weight: undefined,
    markdown: 0.2,
  },
  beef: {
    id: "beef",
    src: "https://cdn-icons-png.flaticon.com/512/1702/1702834.png",
    price: 5.99,
    weight: 1,
    byWeight: true,
    markdown: undefined,
  },
  banana: {
    id: "banana",
    src: "https://cdn-icons-png.flaticon.com/512/11312/11312154.png ",
    price: 2.38,
    weight: 2,
    byWeight: true,
    markdown: undefined,
  },
} as const;
