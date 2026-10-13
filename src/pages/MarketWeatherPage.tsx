import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  CloudSun,
  MapPin,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Wind,
  Droplets,
  Sun,
  ShieldAlert,
  Bot,
  Calendar,
} from 'lucide-react';

export const MarketWeatherPage: React.FC = () => {
  const {
    weather,
    refreshWeather,
    marketPrices,
    refreshMarketPrices,
    formatCurrency,
    userProfile,
    updateUserProfile,
    setInitialAssistantQuery,
    setActiveTab,
  } = useApp();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedCommodityFilter, setSelectedCommodityFilter] = useState('All');

  const forecastDays = useMemo(() => {
    if (weather?.daily?.time && weather.daily.time.length > 0) {
      return weather.daily.time.slice(0, 7).map((t, idx) => {
        const date = new Date(t);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        return {
          day: idx === 0 ? 'Today' : dayName,
          tempMax: Math.round(weather.daily?.tempMax?.[idx] ?? 31),
          tempMin: Math.round(weather.daily?.tempMin?.[idx] ?? 22),
          rainChance: weather.daily?.precipitationProbability?.[idx] ?? 25,
        };
      });
    }
    if (weather?.forecast) {
      return weather.forecast;
    }
    const days = ['Today', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, idx) => ({
      day,
      tempMax: 31 - (idx % 3),
      tempMin: 22 + (idx % 2),
      rainChance: [20, 65, 40, 15, 30, 75, 10][idx] ?? 20,
    }));
  }, [weather]);

  const handleRefreshAll = async () => {
    setRefreshing(true);
    await Promise.all([refreshWeather(), refreshMarketPrices()]);
    setRefreshing(false);
  };

  const handleCitySwitch = (city: string, lat: number, lon: number, country: string) => {
    updateUserProfile({
      location: {
        ...userProfile.location,
        city,
        country,
        latitude: lat,
        longitude: lon,
      },
    });
  };

  const filteredPrices =
    selectedCommodityFilter === 'All'
      ? marketPrices
      : marketPrices.filter((p) => p.commodity.toLowerCase().includes(selectedCommodityFilter.toLowerCase()));

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Market Intelligence &amp; Agronomic Meteorology</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Commodity Prices &amp; Weather Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Live wholesale farmgate prices from regional agricultural exchanges and 7-day field forecasts to plan planting, fertilizer top-dressing, and chemical spraying.
          </p>
        </div>

        <button
          onClick={handleRefreshAll}
          disabled={refreshing}
          className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Weather Station Panel */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900">
                Live Farm Meteorology ({userProfile.location.city}, {userProfile.location.country})
              </h2>
              <p className="text-xs text-stone-500">
                Updated hourly via Open-Meteo High-Resolution Agronomic Models
              </p>
            </div>
          </div>

          {/* Quick Region Switcher */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-stone-400 mr-1">Switch:</span>
            {[
              { name: 'Ibadan', lat: 7.3775, lon: 3.947, country: 'Nigeria' },
              { name: 'Kano', lat: 12.0022, lon: 8.592, country: 'Nigeria' },
              { name: 'Kaduna', lat: 10.5105, lon: 7.4165, country: 'Nigeria' },
              { name: 'Nairobi', lat: -1.2921, lon: 36.8219, country: 'Kenya' },
              { name: 'Accra', lat: 5.6037, lon: -0.187, country: 'Ghana' },
            ].map((loc) => (
              <button
                key={loc.name}
                onClick={() => handleCitySwitch(loc.name, loc.lat, loc.lon, loc.country)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                  userProfile.location.city === loc.name
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>

        {weather ? (
          <div className="space-y-6">
            {/* Current Conditions & Advice Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Current Temperature
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl sm:text-5xl font-black text-stone-900">
                      {weather.current.temp}°C
                    </span>
                    <span className="text-xs font-semibold text-stone-600">
                      {weather.current.condition}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-stone-200 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    <span>Humidity: {weather.current.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-stone-400" />
                    <span>Wind: {weather.current.windSpeed} km/h</span>
                  </div>
                </div>
              </div>

              {/* Agronomic Decision Advice */}
              <div className="md:col-span-2 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between text-emerald-950">
                <div>
                  <div className="flex items-center gap-2 font-extrabold text-sm text-emerald-900">
                    <ShieldAlert className="w-4 h-4 text-emerald-700" />
                    <span>Field Operations Agronomic Advisory</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-900 mt-2 leading-relaxed">
                    {weather.current.farmAdvice}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-4 mt-2 border-t border-emerald-200/60">
                  <button
                    onClick={() => {
                      setInitialAssistantQuery(
                        `Based on today's weather of ${weather.current.temp}°C, humidity ${weather.current.humidity}%, and wind ${weather.current.windSpeed} km/h in ${weather.location}, what farm activities should I prioritize or postpone today?`
                      );
                      setActiveTab('assistant');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Ask AgriAI Weather Strategy</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 7-Day Forecast Row */}
            <div>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                7-Day Agronomic Outlook &amp; Rain Odds
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {forecastDays.map((day, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 text-center space-y-1.5"
                  >
                    <p className="text-xs font-bold text-stone-700">{day.day}</p>
                    <CloudSun className="w-6 h-6 text-amber-500 mx-auto" />
                    <p className="text-xs font-black text-stone-900">
                      {day.tempMax}° / {day.tempMin}°
                    </p>
                    <div className="flex items-center justify-center gap-1 text-[11px] text-blue-600 font-bold">
                      <Droplets className="w-3 h-3" />
                      <span>{day.rainChance}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-400">Loading regional weather station...</p>
        )}
      </section>

      {/* Market Prices Board */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-stone-900">
              Wholesale Farmgate Commodity Exchange
            </h2>
            <p className="text-xs text-stone-500">
              Real-time spot transactions and 24h market trends across regional aggregators
            </p>
          </div>

          {/* Commodity Filters */}
          <div className="flex flex-wrap gap-1 bg-stone-100 p-1 rounded-xl">
            {['All', 'Maize', 'Rice', 'Soybean', 'Broiler', 'Catfish', 'Fertilizer'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCommodityFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  selectedCommodityFilter === cat
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table of Commodities */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="p-3">Commodity &amp; Spec</th>
                <th className="p-3">Current Spot Price</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Market Exchange</th>
                <th className="p-3">24h Price Delta</th>
                <th className="p-3 text-right">AgriAI Price Guidance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPrices.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="p-3 font-bold text-stone-900">{item.commodity}</td>
                  <td className="p-3 font-extrabold text-stone-900 text-sm">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="p-3 text-stone-600">{item.unit}</td>
                  <td className="p-3 text-stone-700">{item.market}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        item.trend === 'up'
                          ? 'text-emerald-600'
                          : item.trend === 'down'
                          ? 'text-rose-600'
                          : 'text-stone-500'
                      }`}
                    >
                      {item.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
                      {item.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
                      {item.trend === 'stable' && <Minus className="w-3.5 h-3.5" />}
                      {item.change24h > 0 ? `+${item.change24h}%` : `${item.change24h}%`}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setInitialAssistantQuery(
                          `What are the historical price trends, seasonal peaks, and best selling strategies for ${item.commodity} currently trading at ${item.currency} ${item.price} per ${item.unit} in ${item.market}?`
                        );
                        setActiveTab('assistant');
                      }}
                      className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 font-semibold text-[11px] transition-colors"
                    >
                      Forecast &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-[11px] text-stone-500 leading-normal">
          <strong className="text-stone-800">Transparency Notice: </strong> Spot prices reflect actual wholesale transactions at regional grain depots (such as Dawanau, Bodija, and Wukari). AgriAI updates commodity prices daily and does not speculate on futures contracts.
        </div>
      </section>
    </div>
  );
};
