import { WeatherData, MarketPriceItem } from '../types';

export async function checkServerHealth(): Promise<{ status: string; hasApiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch (err) {
    return { status: 'offline', hasApiKey: false };
  }
}

export async function sendChatMessage(
  message: string,
  history: { role: 'user' | 'assistant'; text: string }[],
  userContext: {
    location?: string;
    currency?: string;
    experience?: string;
    farmingType?: string;
  }
): Promise<string> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, userContext }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to communicate with AgriAI.');
  }

  const data = await res.json();
  return data.reply;
}

export async function analyzeAgriculturalImage(
  imageBase64: string,
  mimeType: string,
  notes?: string,
  category?: string
): Promise<string> {
  const res = await fetch('/api/ai/analyze-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType, notes, category }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "We couldn't analyze this image. Please upload a clearer image.");
  }

  const data = await res.json();
  return data.analysis;
}

export async function generateFarmPlan(params: {
  location: string;
  farmSize: number;
  sizeUnit: string;
  enterprise: string;
  budget: number | string;
  currency: string;
  experience: string;
  equipment: string;
  targetMarket: string;
  season?: string;
}): Promise<string> {
  const res = await fetch('/api/ai/generate-farm-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error('Failed to generate farm plan.');
  }

  const data = await res.json();
  return data.plan;
}

export async function generateBusinessPlan(params: {
  businessName: string;
  businessType: string;
  location: string;
  capital: number | string;
  currency: string;
  farmSize: string;
  products: string;
  targetCustomers: string;
  productionCapacity: string;
}): Promise<string> {
  const res = await fetch('/api/ai/generate-business-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error('Failed to generate business plan.');
  }

  const data = await res.json();
  return data.businessPlan;
}

export async function generateAgriDocument(
  docType: 'invoice' | 'receipt' | 'report' | 'purchase_order' | 'proposal',
  data: Record<string, any>
): Promise<string> {
  const res = await fetch('/api/ai/generate-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ docType, data }),
  });

  if (!res.ok) {
    throw new Error('Failed to generate agricultural document.');
  }

  const resJson = await res.json();
  return resJson.document;
}

export async function fetchWeather(lat = 6.5244, lon = 3.3792, location = 'West Africa'): Promise<WeatherData> {
  const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}&location=${encodeURIComponent(location)}`);
  if (!res.ok) {
    throw new Error('Failed to load weather data');
  }
  return await res.json();
}

export async function fetchMarketPrices(): Promise<{ prices: MarketPriceItem[]; disclaimer: string; updatedAt: string }> {
  const res = await fetch('/api/market-prices');
  if (!res.ok) {
    throw new Error('Failed to load market prices');
  }
  return await res.json();
}
