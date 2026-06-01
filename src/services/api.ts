const API_BASE_URL = 'http://localhost:8080/api/v1';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  joinDate: string;
  totalBids: number;
  totalSales: number;
  walletBalance: number;
}

export interface Auction {
  id: number;
  name: string;
  description: string;
  startingBid: number;
  currentBid: number;
  category: string;
  durationMinutes: number;
  endTime: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  createdDate: string;
  views: number;
  bidCount: number;
  imageUrl: string;
  sellerId: number;
  sellerName: string;
  sellerEmail: string;
  timeLeft: string;
}

export interface Bid {
  id: number;
  bidAmount: number;
  bidTime: string;
  auctionId: number;
  bidderId: number;
  bidderName: string;
  isWinning: boolean;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

// User API
export const userApi = {
  login: async (credentials: any): Promise<{ token: string; user: User }> => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  register: async (user: Partial<User>): Promise<{ token: string; user: User }> => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`, { headers: getHeaders() });
    return response.json();
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, { headers: getHeaders() });
    return response.json();
  },

  getUserByEmail: async (email: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/email/${email}`, { headers: getHeaders() });
    return response.json();
  },

  createUser: async (user: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(user),
    });
    return response.json();
  },

  updateUser: async (id: number, user: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(user),
    });
    return response.json();
  },

  suspendUser: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/suspend`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return response.json();
  },

  activateUser: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/activate`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return response.json();
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users/search?query=${encodeURIComponent(query)}`, { headers: getHeaders() });
    return response.json();
  },

  getUsersByRole: async (role: string): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users/role/${role}`, { headers: getHeaders() });
    return response.json();
  },
};

// Auction API
export const auctionApi = {
  getAllAuctions: async (): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions`, { headers: getHeaders() });
    return response.json();
  },

  getActiveAuctions: async (): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions/active`, { headers: getHeaders() });
    return response.json();
  },

  getPendingAuctions: async (): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions/pending`, { headers: getHeaders() });
    return response.json();
  },

  getAuctionsBySeller: async (sellerId: number): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions/seller/${sellerId}`, { headers: getHeaders() });
    return response.json();
  },

  getAuctionById: async (id: number): Promise<Auction> => {
    const response = await fetch(`${API_BASE_URL}/auctions/${id}`, { headers: getHeaders() });
    return response.json();
  },

  createAuction: async (auction: Partial<Auction>): Promise<Auction> => {
    const response = await fetch(`${API_BASE_URL}/auctions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(auction),
    });
    return response.json();
  },

  approveAuction: async (id: number): Promise<Auction> => {
    const response = await fetch(`${API_BASE_URL}/auctions/${id}/approve`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return response.json();
  },

  rejectAuction: async (id: number): Promise<Auction> => {
    const response = await fetch(`${API_BASE_URL}/auctions/${id}/reject`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return response.json();
  },

  cancelAuction: async (id: number): Promise<Auction> => {
    const response = await fetch(`${API_BASE_URL}/auctions/${id}/cancel`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return response.json();
  },

  incrementView: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/auctions/${id}/view`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  searchAuctions: async (query: string): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions/search?query=${encodeURIComponent(query)}`, { headers: getHeaders() });
    return response.json();
  },

  completeExpiredAuctions: async (): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions/complete-expired`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response.json();
  },

  getCompletedAuctions: async (): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions/completed`, { headers: getHeaders() });
    return response.json();
  },

  getWonAuctionsByUser: async (userId: number): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions/won/${userId}`, { headers: getHeaders() });
    return response.json();
  },
};

// Bid API
export const bidApi = {
  placeBid: async (bid: Partial<Bid>): Promise<Bid> => {
    const response = await fetch(`${API_BASE_URL}/bids`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bid),
    });
    return response.json();
  },

  getBidsByAuction: async (auctionId: number): Promise<Bid[]> => {
    const response = await fetch(`${API_BASE_URL}/bids/auction/${auctionId}`, { headers: getHeaders() });
    return response.json();
  },

  getBidsByBidder: async (bidderId: number): Promise<Bid[]> => {
    const response = await fetch(`${API_BASE_URL}/bids/bidder/${bidderId}`, { headers: getHeaders() });
    return response.json();
  },

  getHighestBid: async (auctionId: number): Promise<Bid> => {
    const response = await fetch(`${API_BASE_URL}/bids/auction/${auctionId}/highest`, { headers: getHeaders() });
    return response.json();
  },
  getActiveAuctionsCountForBidder: async (bidderId: number): Promise<number> => {
    const response = await fetch(`${API_BASE_URL}/bids/bidder/${bidderId}/active-auctions-count`, { headers: getHeaders() });
    return response.json();
  },
  getRecentBids: async (): Promise<Bid[]> => {
    const response = await fetch(`${API_BASE_URL}/bids/recent`, { headers: getHeaders() });
    return response.json();
  },
};

// Payments API
export const paymentsApi = {
  getRazorpayKey: async (): Promise<{ keyId: string }> => {
    const response = await fetch(`${API_BASE_URL}/payments/key`, { headers: getHeaders() });
    return response.json();
  },
  createOrder: async (amountPaise: number): Promise<RazorpayOrder> => {
    const response = await fetch(`${API_BASE_URL}/payments/order`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount: amountPaise, currency: 'INR' }),
    });
    return response.json();
  },
  markWinsPaid: async (userId: number): Promise<{ updated: number }> => {
    const response = await fetch(`${API_BASE_URL}/payments/mark-wins-paid/${userId}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response.json();
  },
  getSummary: async (): Promise<{ totalPaid: number; totalDue: number }> => {
    const response = await fetch(`${API_BASE_URL}/payments/summary`, { headers: getHeaders() });
    return response.json();
  },
  getUserSummary: async (userId: number): Promise<{ totalPaid: number; totalDue: number }> => {
    const response = await fetch(`${API_BASE_URL}/payments/user/${userId}/summary`, { headers: getHeaders() });
    return response.json();
  },
  getUserUnpaidBids: async (userId: number): Promise<Bid[]> => {
    const response = await fetch(`${API_BASE_URL}/payments/user/${userId}/unpaid-bids`, { headers: getHeaders() });
    return response.json();
  },
  getUserPaidBids: async (userId: number): Promise<Bid[]> => {
    const response = await fetch(`${API_BASE_URL}/payments/user/${userId}/paid-bids`, { headers: getHeaders() });
    return response.json();
  }
};
