import beigekurta_1 from '../assets/images/Men/beigekurta_1.jpg'
import beigekurta_2 from '../assets/images/Men/beigekurta_2.jpg'
import pot from "./images/pot.png";

const products = [
  {
    _id: "mew001",
    name: "Classic Beige Kurta",
    category: "Men's Ethnic Wear",
    price: 1499,
    offerPrice: 1299,
    images: [beigekurta_1, beigekurta_2],
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 10 },
      { size: "L", stock: 7 },
      { size: "XL", stock: 3 },
    ],
    description: [
      "Pure cotton fabric",
      "Mandarin collar design",
      "Perfect for festive and traditional events",
    ],
    createdAt: "now",
    updatedAt: "now",
    inStock: "True",
  },
  {
    _id: "mew002",
    name: "Nehru Jacket Set",
    category: "Men's Ethnic Wear",
    price: 2399,
    offerPrice: 1999,
    images: ["https://source.unsplash.com/400x400/?nehru,jacket"],
    sizes: [
      { size: "M", stock: 6 },
      { size: "L", stock: 4 },
      { size: "XL", stock: 2 },
      { size: "XXL", stock: 1 },
    ],
    description: [
      "Includes Kurta, Churidar & Nehru jacket",
      "Elegant brocade texture",
      "Ideal for weddings and celebrations",
    ],
    createdAt: "now",
    updatedAt: "now",
    inStock: "True",
  },
  {
    _id: "mew003",
    name: "Navy Blue Pathani Suit",
    category: "Men's Ethnic Wear",
    price: 1699,
    offerPrice: 1499,
    images: ["https://source.unsplash.com/400x400/?pathani,men"],
    sizes: [
      { size: "S", stock: 0 },
      { size: "M", stock: 0 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 },
      { size: "XXL", stock: 0 },
    ],
    description: [
      "Relaxed fit",
      "Soft blended cotton fabric",
      "Great for everyday ethnic style",
    ],
    createdAt: "now",
    updatedAt: "now",
    inStock: "False",
  },

  {
    _id: "wew001",
    name: "Floral Anarkali Suit",
    category: "Women's Ethnic Wear",
    price: 2499,
    offerPrice: 2199,
    images: ["https://source.unsplash.com/400x400/?anarkali,women"],
    sizes: [
      { size: "XS", stock: 4 },
      { size: "S", stock: 8 },
      { size: "M", stock: 5 },
      { size: "L", stock: 2 },
    ],
    description: [
      "Floor-length Anarkali with dupatta",
      "Soft georgette fabric",
      "Perfect for festivals and functions",
    ],
    createdAt: "now",
    updatedAt: "now",
    inStock: "True",
  },
  {
    _id: "wew002",
    name: "Banarasi Silk Saree",
    category: "Women's Ethnic Wear",
    price: 3999,
    offerPrice: 3499,
    images: ["https://source.unsplash.com/400x400/?banarasi,saree"],
    sizes: [
      { size: "Free Size", stock: 10 },
    ],
    description: [
      "Traditional zari work",
      "Rich silk finish",
      "Ideal for weddings and poojas",
    ],
    createdAt: "now",
    updatedAt: "now",
    inStock: "True",
  },
  {
    _id: "wew003",
    name: "Cotton Straight Kurti",
    category: "Women's Ethnic Wear",
    price: 999,
    offerPrice: 849,
    images: ["https://source.unsplash.com/400x400/?kurti,women"],
    sizes: [
      { size: "S", stock: 7 },
      { size: "M", stock: 12 },
      { size: "L", stock: 9 },
      { size: "XL", stock: 3 },
    ],
    description: [
      "Breathable and comfortable",
      "Printed design with 3/4 sleeves",
      "Daily wear ethnic essential",
    ],
    createdAt: "now",
    updatedAt: "now",
    inStock: "True",
  },
  {
    _id: "hm001",
    name: "Pot",
    category: "Pots",
    price: 599,
    offerPrice: 499,
    images: [pot],
    description: [
      "Handcrafted with beautiful colors",
      "Aesthetic Appearance"
    ],
    createdAt: "now",
    updatedAt: "now",
    inStock: "True",
  },
];


export default products;
