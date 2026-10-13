import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NavigationTab,
  UserProfile,
  ChatSession,
  MarketplaceListing,
  AgribusinessProfile,
  FarmActivity,
  FarmExpense,
  FarmSale,
  InventoryItem,
  LivestockRecord,
  MarketPriceItem,
  WeatherData,
  AppNotification,
  Currency,
} from '../types';
import {
  INITIAL_MARKETPLACE_LISTINGS,
  INITIAL_BUSINESS_DIRECTORY,
  INITIAL_FARM_ACTIVITIES,
  INITIAL_EXPENSES,
  INITIAL_SALES,
  INITIAL_INVENTORY,
  INITIAL_LIVESTOCK,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import { fetchWeather, fetchMarketPrices } from '../services/api';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  currencySymbol: string;
  formatCurrency: (amount: number) => string;
  // Chat
  chatSessions: ChatSession[];
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
  createNewChatSession: () => string;
  addMessageToCurrentSession: (role: 'user' | 'assistant', text: string) => void;
  deleteChatSession: (id: string) => void;
  renameChatSession: (id: string, newTitle: string) => void;
  initialAssistantQuery: string;
  setInitialAssistantQuery: (query: string) => void;
  // Marketplace
  listings: MarketplaceListing[];
  addListing: (listing: Omit<MarketplaceListing, 'id' | 'createdAt'>) => void;
  deleteListing: (id: string) => void;
  // Directory
  businesses: AgribusinessProfile[];
  addBusiness: (biz: Omit<AgribusinessProfile, 'id'>) => void;
  // Farm Records
  activities: FarmActivity[];
  addActivity: (act: Omit<FarmActivity, 'id'>) => void;
  expenses: FarmExpense[];
  addExpense: (exp: Omit<FarmExpense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  sales: FarmSale[];
  addSale: (sale: Omit<FarmSale, 'id'>) => void;
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  livestock: LivestockRecord[];
  addLivestockRecord: (ls: Omit<LivestockRecord, 'id'>) => void;
  // Live Weather & Market
  weather: WeatherData | null;
  refreshWeather: () => Promise<void>;
  marketPrices: MarketPriceItem[];
  refreshMarketPrices: () => Promise<void>;
  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  unreadNotificationsCount: number;
  // Global Spotlight Search
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-1',
  name: 'Tunde Adeleke',
  email: 'tunde.adeleke@agrifarm.com',
  role: 'farmer',
  farmName: 'Heritage Green Agribusiness Farms',
  location: {
    country: 'Nigeria',
    state: 'Oyo State',
    city: 'Ibadan',
    latitude: 7.3775,
    longitude: 3.947,
  },
  currency: 'NGN',
  farmingExperience: 'Intermediate',
  farmingInterests: ['Maize Cultivation', 'Broiler Poultry', 'Catfish Farming', 'Vegetables'],
  farmSizeHectares: 5.5,
};

const DEFAULT_FIRST_SESSION: ChatSession = {
  id: 'chat-init-1',
  title: 'Welcome & Farm Consultation',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  messages: [
    {
      id: 'msg-welcome-1',
      role: 'assistant',
      text: `### Understanding the Question
Welcome to **AgriAI Assistant**! I am your dedicated agricultural technology consultant and farm business advisor.

### Answer
Whether you are planting crops, raising poultry or aquaculture, calculating fertilizer requirements, diagnosing crop leaf problems, or creating a commercial business plan, I am here to provide clear, actionable steps tailored to your location and scale.

### What To Do
1. Ask any farming or agribusiness question directly in everyday language.
2. Explore our **Crop Disease Diagnostics** tool to upload plant or animal photos for immediate analysis.
3. Use our **Farm Calculators & Budgets** to project profits, feed conversions, and input quantities.
4. Browse or sell inputs in the **Agricultural Marketplace**.

### Things To Watch
- Always verify local soil moisture and weather trends before fertilizer or chemical applications.
- For severe livestock symptoms or unfamiliar chemical handling, prioritize safety and veterinary guidance.

### When More Information Is Needed
Feel free to tell me your location, crop or livestock species, and farm size whenever you ask a question so I can provide precise recommendations!`,
      timestamp: new Date().toISOString(),
    },
  ],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('agri_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('agri_chat_sessions');
    return saved ? JSON.parse(saved) : [DEFAULT_FIRST_SESSION];
  });
  const [activeSessionId, setActiveSessionId] = useState<string>(
    chatSessions[0]?.id || DEFAULT_FIRST_SESSION.id
  );
  const [initialAssistantQuery, setInitialAssistantQuery] = useState<string>('');

  const [listings, setListings] = useState<MarketplaceListing[]>(() => {
    const saved = localStorage.getItem('agri_marketplace_listings');
    return saved ? JSON.parse(saved) : INITIAL_MARKETPLACE_LISTINGS;
  });

  const [businesses, setBusinesses] = useState<AgribusinessProfile[]>(() => {
    const saved = localStorage.getItem('agri_businesses');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_DIRECTORY;
  });

  const [activities, setActivities] = useState<FarmActivity[]>(() => {
    const saved = localStorage.getItem('agri_farm_activities');
    return saved ? JSON.parse(saved) : INITIAL_FARM_ACTIVITIES;
  });

  const [expenses, setExpenses] = useState<FarmExpense[]>(() => {
    const saved = localStorage.getItem('agri_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [sales, setSales] = useState<FarmSale[]>(() => {
    const saved = localStorage.getItem('agri_sales');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('agri_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [livestock, setLivestock] = useState<LivestockRecord[]>(() => {
    const saved = localStorage.getItem('agri_livestock');
    return saved ? JSON.parse(saved) : INITIAL_LIVESTOCK;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [marketPrices, setMarketPrices] = useState<MarketPriceItem[]>([]);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('agri_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('agri_chat_sessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    localStorage.setItem('agri_marketplace_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('agri_businesses', JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem('agri_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('agri_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('agri_farm_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('agri_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('agri_livestock', JSON.stringify(livestock));
  }, [livestock]);

  // Load weather and market data on startup
  const refreshWeather = async () => {
    try {
      const data = await fetchWeather(
        userProfile.location.latitude,
        userProfile.location.longitude,
        `${userProfile.location.city}, ${userProfile.location.country}`
      );
      setWeather(data);
    } catch (err) {
      console.error('Weather load error:', err);
    }
  };

  const refreshMarketPrices = async () => {
    try {
      const data = await fetchMarketPrices();
      setMarketPrices(data.prices);
    } catch (err) {
      console.error('Market prices error:', err);
    }
  };

  useEffect(() => {
    refreshWeather();
    refreshMarketPrices();
  }, [userProfile.location.country, userProfile.location.city]);

  const updateUserProfile = (patch: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...patch }));
  };

  const getCurrencySymbol = (cur: Currency): string => {
    switch (cur) {
      case 'NGN': return '₦';
      case 'USD': return '$';
      case 'KES': return 'KSh';
      case 'GHS': return 'GH₵';
      case 'ZAR': return 'R';
      case 'EUR': return '€';
      default: return '₦';
    }
  };

  const currencySymbol = getCurrencySymbol(userProfile.currency);

  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${Number(amount || 0).toLocaleString()}`;
  };

  // Chat methods
  const createNewChatSession = (): string => {
    const newId = `chat-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'New Farm Inquiry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          text: `### Understanding the Question
Hello! How can I assist you with your farming or agricultural enterprise today?

### Answer
You can ask for advice on crop planting, livestock feed formulas, fertilizer dosages, pest management, or farm profit calculations.`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    return newId;
  };

  const addMessageToCurrentSession = (role: 'user' | 'assistant', text: string) => {
    const msgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newMsg = {
      id: msgId,
      role,
      text,
      timestamp: new Date().toISOString(),
    };

    setChatSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          // If first user message, generate title from prompt
          let newTitle = s.title;
          if (role === 'user' && s.messages.filter((m) => m.role === 'user').length === 0) {
            newTitle = text.slice(0, 32).trim() + (text.length > 32 ? '...' : '');
          }
          return {
            ...s,
            title: newTitle,
            updatedAt: new Date().toISOString(),
            messages: [...s.messages, newMsg],
          };
        }
        return s;
      })
    );
  };

  const deleteChatSession = (id: string) => {
    setChatSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (activeSessionId === id && filtered.length > 0) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  const renameChatSession = (id: string, newTitle: string) => {
    setChatSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  // Marketplace methods
  const addListing = (item: Omit<MarketplaceListing, 'id' | 'createdAt'>) => {
    const newListing: MarketplaceListing = {
      ...item,
      id: `lst-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setListings((prev) => [newListing, ...prev]);
  };

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  // Directory methods
  const addBusiness = (biz: Omit<AgribusinessProfile, 'id'>) => {
    const newBiz: AgribusinessProfile = {
      ...biz,
      id: `biz-${Date.now()}`,
    };
    setBusinesses((prev) => [newBiz, ...prev]);
  };

  // Farm records methods
  const addActivity = (act: Omit<FarmActivity, 'id'>) => {
    const newAct: FarmActivity = {
      ...act,
      id: `act-${Date.now()}`,
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const addExpense = (exp: Omit<FarmExpense, 'id'>) => {
    const newExp: FarmExpense = {
      ...exp,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const addSale = (sale: Omit<FarmSale, 'id'>) => {
    const newSale: FarmSale = {
      ...sale,
      id: `sl-${Date.now()}`,
    };
    setSales((prev) => [newSale, ...prev]);
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
    };
    setInventory((prev) => [newItem, ...prev]);
  };

  const addLivestockRecord = (ls: Omit<LivestockRecord, 'id'>) => {
    const newLs: LivestockRecord = {
      ...ls,
      id: `ls-${Date.now()}`,
    };
    setLivestock((prev) => [newLs, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userProfile,
        updateUserProfile,
        currencySymbol,
        formatCurrency,
        chatSessions,
        activeSessionId,
        setActiveSessionId,
        createNewChatSession,
        addMessageToCurrentSession,
        deleteChatSession,
        renameChatSession,
        initialAssistantQuery,
        setInitialAssistantQuery,
        listings,
        addListing,
        deleteListing,
        businesses,
        addBusiness,
        activities,
        addActivity,
        expenses,
        addExpense,
        deleteExpense,
        sales,
        addSale,
        inventory,
        addInventoryItem,
        livestock,
        addLivestockRecord,
        weather,
        refreshWeather,
        marketPrices,
        refreshMarketPrices,
        notifications,
        markNotificationAsRead,
        unreadNotificationsCount,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
