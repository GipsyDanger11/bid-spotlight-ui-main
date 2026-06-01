const API_BASE_URL = 'http://localhost:8080/api';

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
  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`);
    return response.json();
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return response.json();
  },

  getUserByEmail: async (email: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/email/${email}`);
    return response.json();
  },

  createUser: async (user: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response.json();
  },

  updateUser: async (id: number, user: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response.json();
  },

  suspendUser: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/suspend`, {
      method: 'PUT',
    });
    return response.json();
  },

  activateUser: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/activate`, {
      method: 'PUT',
    });
    return response.json();
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users/search?query=${encodeURIComponent(query)}`);
    return response.json();
  },

  getUsersByRole: async (role: string): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users/role/${role}`);
    return response.json();
  },
};

// Auction API
export const auctionApi = {
  getAllAuctions: async (): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions`);
    return response.json();
  },

  getActiveAuctions: async (): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions/active`);
    return response.json();
  },

  getPendingAuctions: async (): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions/pending`);
    return response.json();
  },

  getAuctionsBySeller: async (sellerId: number): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions/seller/${sellerId}`);
    return response.json();
  },

  getAuctionById: async (id: number): Promise<Auction> => {
    const response = await fetch(`${API_BASE_URL}/auctions/${id}`);
    return response.json();
  },

  createAuction: async (auction: Partial<Auction>): Promise<Auction> => {
    const response = await fetch(`${API_BASE_URL}/auctions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auction),
    });
    return response.json();
  },

  approveAuction: async (id: number): Promise<Auction> => {
    const response = await fetch(`${API_BASE_URL}/auctions/${id}/approve`, {
      method: 'PUT',
    });
    return response.json();
  },

  rejectAuction: async (id: number): Promise<Auction> => {
    const response = await fetch(`${API_BASE_URL}/auctions/${id}/reject`, {
      method: 'PUT',
    });
    return response.json();
  },

  cancelAuction: async (id: number): Promise<Auction> => {
    const response = await fetch(`${API_BASE_URL}/auctions/${id}/cancel`, {
      method: 'PUT',
    });
    return response.json();
  },

  incrementView: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/auctions/${id}/view`, {
      method: 'PUT',
    });
  },

  searchAuctions: async (query: string): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions/search?query=${encodeURIComponent(query)}`);
    return response.json();
  },

  completeExpiredAuctions: async (): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions/complete-expired`, {
      method: 'POST',
    });
    return response.json();
  },

  getCompletedAuctions: async (): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions/completed`);
    return response.json();
  },

  getWonAuctionsByUser: async (userId: number): Promise<Auction[]> => {
    const response = await fetch(`${API_BASE_URL}/auctions/won/${userId}`);
    return response.json();
  },
};

// Bid API
export const bidApi = {
  placeBid: async (bid: Partial<Bid>): Promise<Bid> => {
    const response = await fetch(`${API_BASE_URL}/bids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bid),
    });
    return response.json();
  },

  getBidsByAuction: async (auctionId: number): Promise<Bid[]> => {
    const response = await fetch(`${API_BASE_URL}/bids/auction/${auctionId}`);
    return response.json();
  },

  getBidsByBidder: async (bidderId: number): Promise<Bid[]> => {
    const response = await fetch(`${API_BASE_URL}/bids/bidder/${bidderId}`);
    return response.json();
  },

  getHighestBid: async (auctionId: number): Promise<Bid> => {
    const response = await fetch(`${API_BASE_URL}/bids/auction/${auctionId}/highest`);
    return response.json();
  },
  getActiveAuctionsCountForBidder: async (bidderId: number): Promise<number> => {
    const response = await fetch(`${API_BASE_URL}/bids/bidder/${bidderId}/active-auctions-count`);
    return response.json();
  },
  getRecentBids: async (): Promise<Bid[]> => {
    const response = await fetch(`${API_BASE_URL}/bids/recent`);
    return response.json();
  },
};

// Payments API
export const paymentsApi = {
  getRazorpayKey: async (): Promise<{ keyId: string }> => {
    const response = await fetch(`${API_BASE_URL}/payments/key`);
    return response.json();
  },
  createOrder: async (amountPaise: number): Promise<RazorpayOrder> => {
    const response = await fetch(`${API_BASE_URL}/payments/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amountPaise, currency: 'INR' }),
    });
    return response.json();
  },
  markWinsPaid: async (userId: number): Promise<{ updated: number }> => {
    const response = await fetch(`${API_BASE_URL}/payments/mark-wins-paid/${userId}`, {
      method: 'POST'
    });
    return response.json();
  },
  getSummary: async (): Promise<{ totalPaid: number; totalDue: number }> => {
    const response = await fetch(`${API_BASE_URL}/payments/summary`);
    return response.json();
  },
  getUserSummary: async (userId: number): Promise<{ totalPaid: number; totalDue: number }> => {
    const response = await fetch(`${API_BASE_URL}/payments/user/${userId}/summary`);
    return response.json();
  },
  getUserUnpaidBids: async (userId: number): Promise<Bid[]> => {
    const response = await fetch(`${API_BASE_URL}/payments/user/${userId}/unpaid-bids`);
    return response.json();
  },
  getUserPaidBids: async (userId: number): Promise<Bid[]> => {
    const response = await fetch(`${API_BASE_URL}/payments/user/${userId}/paid-bids`);
    return response.json();
  }
};
