export type NavigationTab =
  | 'home'
  | 'assistant'
  | 'diagnosis'
  | 'farm-management'
  | 'calculators'
  | 'planner'
  | 'marketplace'
  | 'directory'
  | 'learning'
  | 'market-weather'
  | 'documents'
  | 'admin'
  | 'profile';

export type Currency = 'NGN' | 'USD' | 'KES' | 'GHS' | 'ZAR' | 'EUR' | 'GBP';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'agribusiness' | 'buyer' | 'student' | 'admin';
  farmName: string;
  location: {
    country: string;
    state: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  currency: Currency;
  farmingExperience: 'Beginner' | 'Intermediate' | 'Commercial / Expert';
  farmingInterests: string[];
  primaryEnterprises?: string[];
  farmSizeHectares: number;
  language?: string;
  avatarUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export type MarketplaceCategory =
  | 'Produce'
  | 'Livestock'
  | 'Seeds'
  | 'Fertilizers'
  | 'Equipment'
  | 'Farm Services'
  | 'Feeds';

export interface MarketplaceListing {
  id: string;
  title: string;
  category: MarketplaceCategory;
  description: string;
  price: number;
  currency: Currency;
  unit: string;
  quantityAvailable: number;
  location: string;
  sellerName: string;
  sellerPhone: string;
  sellerRating: number;
  sellerVerified: boolean;
  imageUrl: string;
  createdAt: string;
  status: 'active' | 'sold' | 'pending';
}

export type AgribusinessCategory =
  | 'Farms & Ranches'
  | 'Agro-dealers & Inputs'
  | 'Feed Suppliers'
  | 'Seed Producers'
  | 'Equipment Suppliers'
  | 'Veterinary Clinics'
  | 'Farm Consultants'
  | 'Food Processors'
  | 'Storage & Silos'
  | 'Cooperatives'
  | 'Feed Mills'
  | 'Fertilizer Distributors';

export interface AgribusinessProfile {
  id: string;
  name: string;
  category: AgribusinessCategory;
  description: string;
  location: string;
  phone: string;
  email: string;
  openingHours: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  services: string[];
  imageUrl: string;
}

export interface FarmExpense {
  id: string;
  date: string;
  category: 'Seeds/Breeding' | 'Feed' | 'Fertilizer' | 'Labor' | 'Pesticides' | 'Fuel/Transport' | 'Equipment' | 'Other';
  description: string;
  amount: number;
  currency: Currency;
}

export interface FarmSale {
  id: string;
  date: string;
  commodity: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalRevenue: number;
  buyerName: string;
  currency: Currency;
}

export interface FarmActivity {
  id: string;
  date: string;
  title: string;
  plotOrPen: string;
  category: 'Land Prep' | 'Planting' | 'Spraying' | 'Fertilizing' | 'Weeding' | 'Feeding' | 'Vaccination' | 'Harvesting';
  status: 'Completed' | 'Pending' | 'In Progress';
  notes: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Feed' | 'Seed' | 'Fertilizer' | 'Chemical' | 'Tools' | 'Harvested Goods';
  quantity: number;
  unit: string;
  reorderLevel: number;
  location: string;
  estimatedValue: number;
}

export interface LivestockRecord {
  id: string;
  animalType: string;
  batchName: string;
  initialCount: number;
  currentCount: number;
  mortalityCount: number;
  startDate: string;
  ageWeeks: number;
  averageWeightKg: number;
  notes: string;
}

export interface MarketPriceItem {
  id: string;
  commodity: string;
  category: string;
  market: string;
  location: string;
  price: number;
  currency: string;
  unit: string;
  bagPrice: string;
  change24h: number;
  trend: 'up' | 'down' | 'stable';
  quality: string;
  lastUpdated: string;
  source: string;
}

export interface WeatherForecastDay {
  day: string;
  tempMax: number;
  tempMin: number;
  rainChance: number;
  condition?: string;
}

export interface WeatherData {
  location: string;
  coordinates: { lat: number; lon: number };
  current: {
    temp: number;
    humidity: number;
    feelsLike: number;
    precipitation: number;
    windSpeed: number;
    condition: string;
    icon: string;
    farmAdvice: string;
  };
  daily?: {
    time: string[];
    tempMax: number[];
    tempMin: number[];
    precipitationProbability: number[];
    precipitationSum: number[];
  } | null;
  forecast?: WeatherForecastDay[];
  source: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'weather' | 'market' | 'task' | 'alert';
  time: string;
  read: boolean;
}
