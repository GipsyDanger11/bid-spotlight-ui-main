import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gavel, Clock, TrendingUp, LogOut, Flame, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { auctionApi, bidApi, paymentsApi, type Auction, type Bid } from "@/services/api";
import { usePolling } from "@/hooks/usePolling";

const Customer = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userStats, setUserStats] = useState({
    activeBids: 0,
    watching: 0,
    wonAuctions: 0
  });
  const [timeUpdate, setTimeUpdate] = useState(0); // Force re-render for time updates
  const [wonAuctions, setWonAuctions] = useState<Auction[]>([]);
  const [showWonPopup, setShowWonPopup] = useState(false);
  const [latestWonAuction, setLatestWonAuction] = useState<Auction | null>(null);
  const [cancelledAuctions, setCancelledAuctions] = useState<Auction[]>([]);
  const [walletBalance, setWalletBalance] = useState(10000);
  const [amountToPay, setAmountToPay] = useState(0);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [customBidAmount, setCustomBidAmount] = useState("");

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setWalletBalance(parsedUser.walletBalance || 10000);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Helper function to calculate time left with seconds
  const calculateTimeLeft = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Check for won auctions
  const checkForWonAuctions = async () => {
    if (!user) return;
    try {
      // First, complete any expired auctions
      await auctionApi.completeExpiredAuctions();
      
      // Get the actual won auctions from the backend
      const actualWonAuctions = await auctionApi.getWonAuctionsByUser(user.id);
      
      // Check if there are new won auctions
      if (actualWonAuctions && actualWonAuctions.length > 0) {
        setWonAuctions(currentWonAuctions => {
          let hasNewWin = false;
          const updatedWins = [...currentWonAuctions];

          actualWonAuctions.forEach(auction => {
            const alreadyWon = updatedWins.some(won => won.id === auction.id);
            if (!alreadyWon) {
              updatedWins.push(auction);
              setLatestWonAuction(auction);
              setShowWonPopup(true);
              hasNewWin = true;
              
              toast.success(`🎉 Congratulations! You won "${auction.name}"!`, {
                description: `Final bid: $${auction.currentBid.toLocaleString()}`,
                duration: 10000
              });
            }
          });

          if (hasNewWin) {
            setUserStats(prev => ({
              ...prev,
              wonAuctions: actualWonAuctions.length
            }));
          }
          return updatedWins;
        });
      }
    } catch (error) {
      console.error('Error checking for won auctions:', error);
    }
  };

  // Load active auctions function
  const loadActiveAuctions = async () => {
    if (!user) return;
    console.log('Loading auctions...', { loading });
    try {
      const [auctions, cancelledAuctionsList, wonAuctionsList, activeCount] = await Promise.all([
        auctionApi.getActiveAuctions(),
        auctionApi.getAllAuctions().then(all => all.filter(auction => auction.status === 'CANCELLED')),
        auctionApi.getWonAuctionsByUser(user.id),
        bidApi.getActiveAuctionsCountForBidder(user.id)
      ]);
      
      console.log('API response:', auctions);
      setItems(auctions);
      setCancelledAuctions(cancelledAuctionsList);
      setWonAuctions(wonAuctionsList);
      const userSummary = await paymentsApi.getUserSummary(user.id);
      setAmountToPay(userSummary.totalDue);
      
      // Update stats from backend
      setUserStats(prev => ({
        ...prev,
        wonAuctions: wonAuctionsList.length,
        activeBids: activeCount,
        watching: activeCount
      }));
      
    } catch (error) {
      console.error('Error loading auctions:', error);
      
      // Ensure wonAuctions is always an array
      if (!wonAuctions) {
        setWonAuctions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    console.log('Customer component mounted');
    
    // Initial load from API
    loadActiveAuctions();
  }, [user]);

  // Poll for updates every 5 seconds
  usePolling(loadActiveAuctions, 5000, !!user);

  // Update time display every second and check for won auctions
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      setTimeUpdate(prev => prev + 1);
      checkForWonAuctions();
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [user]); // Removed wonAuctions from dependency to avoid restart, uses functional update now


  const handleBid = (item: Auction) => {
    setSelectedAuction(item);
    setCustomBidAmount((item.currentBid + 100).toString());
    setShowBidModal(true);
  };

  const handlePlaceBid = async () => {
    if (!selectedAuction || !user) return;
    
    const bidAmount = parseFloat(customBidAmount);
    
    // Validate bid amount
    if (isNaN(bidAmount) || bidAmount <= selectedAuction.currentBid) {
      toast.error('Bid amount must be higher than current bid');
      return;
    }
    
    // Validate wallet balance
    if (bidAmount > walletBalance) {
      toast.error('Insufficient wallet balance');
      return;
    }
    
    try {
      await bidApi.placeBid({
        auctionId: selectedAuction.id,
        bidderId: user.id,
        bidAmount: bidAmount
      });
      
      // Update wallet balance locally and in user object
      const newBalance = walletBalance - bidAmount;
      setWalletBalance(newBalance);
      const updatedUser = { ...user, walletBalance: newBalance };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast.success(`Bid placed on ${selectedAuction.name}!`, {
        description: `New bid: $${bidAmount.toLocaleString()}`
      });
      
      // Close modal and refresh data
      setShowBidModal(false);
      setSelectedAuction(null);
      setCustomBidAmount("");
      loadActiveAuctions();
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error('Failed to place bid');
    }
  };

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayNow = async () => {
    if (amountToPay <= 0 || !user) {
      toast.info('No amount due');
      return;
    }
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error('Failed to load Razorpay');
      return;
    }
    try {
      console.log('Fetching Razorpay key...');
      const { keyId } = await paymentsApi.getRazorpayKey();
      
      console.log('Creating order for amount:', Math.round(amountToPay * 100));
      const order = await paymentsApi.createOrder(Math.round(amountToPay * 100));
      
      if ((order as any).error) {
        toast.error(`Order creation failed: ${(order as any).error}`);
        return;
      }

      console.log('Order created:', order);

      const options: any = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'BidLux',
        description: 'Auction Payment',
        order_id: order.id,
        handler: async (response: any) => {
          console.log('Payment success response:', response);
          try {
            await paymentsApi.markWinsPaid(user.id);
            toast.success('Payment successful! Your items are now marked as paid.');
            loadActiveAuctions();
          } catch (err) {
            console.error('Error updating payment status:', err);
            toast.error('Payment successful, but failed to update status. Please contact support.');
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: '#7c3aed' },
      };
      
      const rz = new (window as any).Razorpay(options);
      
      rz.on('payment.failed', function (response: any) {
        console.error('Payment failed event:', response.error);
        toast.error(`Payment Failed: ${response.error.description}`);
      });

      rz.open();
    } catch (e) {
      console.error('Payment init error:', e);
      toast.error('Failed to initialize payment');
    }
  };

  const handleViewAuction = async (item: Auction) => {
    try {
      await auctionApi.incrementView(item.id);
    } catch (error) {
      console.error('Error incrementing view:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
    navigate("/");
  };

  // Test function to simulate winning an auction (for demo purposes)
  const simulateWin = () => {
    if (items.length > 0) {
      const randomAuction = items[Math.floor(Math.random() * items.length)];
      setWonAuctions(prev => [...prev, randomAuction]);
      setLatestWonAuction(randomAuction);
      setShowWonPopup(true);
      
      setUserStats(prev => ({
        ...prev,
        wonAuctions: prev.wonAuctions + 1
      }));
      
      toast.success(`🎉 Congratulations! You won "${randomAuction.name}"!`, {
        description: `Final bid: $${randomAuction.currentBid.toLocaleString()}`,
        duration: 10000
      });
    }
  };

  console.log('Customer render - loading:', loading, 'items:', items.length);

  return (
    <div className="min-h-screen p-4 md:p-8 animated-bg animate-enter">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gavel className="w-8 h-8 text-accent" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Customer Dashboard</h1>
              <p className="text-muted-foreground">Discover premium items</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={simulateWin} className="text-xs">
              🎉 Test Win
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="gradient-card border-primary/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Bids</p>
                <p className="text-3xl font-bold text-accent">{userStats.activeBids}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
          </Card>
          
          <Card className="gradient-card border-primary/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Watching</p>
                <p className="text-3xl font-bold text-primary">{userStats.watching}</p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="gradient-card border-primary/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Won Auctions</p>
                <p className="text-3xl font-bold text-accent">{userStats.wonAuctions}</p>
              </div>
              <Flame className="w-8 h-8 text-accent" />
            </div>
          </Card>

          <Card className="gradient-card border-green-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Amount to Pay</p>
                <p className="text-2xl font-bold text-green-400">${amountToPay.toLocaleString()}</p>
              </div>
              <Button variant="bid" onClick={handlePayNow} disabled={amountToPay <= 0}>
                Pay Now
              </Button>
            </div>
          </Card>
        </div>

        {/* Live Auctions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Live Auctions</h2>
            <Badge variant="outline" className="border-accent text-accent">
              {items.length} Active
            </Badge>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading auctions...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No auctions available</p>
              <p className="text-sm text-muted-foreground mt-2">Items array length: {items.length}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Card 
                  key={item.id} 
                  className="gradient-card border-border hover:border-primary/50 transition-smooth overflow-hidden group"
                  onClick={() => handleViewAuction(item)}
                >
                  <div className="p-6 space-y-4">
                    <div className="text-6xl text-center py-4 group-hover:scale-110 transition-smooth">
                      {item.imageUrl}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {calculateTimeLeft(item.endTime)}
                        </div>
                        <div className="text-muted-foreground">
                          {item.bidCount} bids
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground">Current Bid</p>
                        <p className="text-2xl font-bold text-accent">
                          ${item.currentBid.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <Button 
                      variant="bid" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBid(item);
                      }}
                    >
                      <Gavel className="w-4 h-4" />
                      Place Bid
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Cancelled Auctions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Cancelled Auctions</h2>
            <Badge variant="outline" className="border-orange-500 text-orange-400">
              {cancelledAuctions.length} Cancelled
            </Badge>
          </div>

          {cancelledAuctions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No cancelled auctions</p>
              <p className="text-sm text-muted-foreground mt-2">Cancelled auctions will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cancelledAuctions.map((item) => (
                <Card 
                  key={item.id} 
                  className="gradient-card border-orange-500/20 hover:border-orange-500/50 transition-smooth overflow-hidden group opacity-75"
                >
                  <div className="p-6 space-y-4">
                    <div className="text-6xl text-center py-4 group-hover:scale-110 transition-smooth">
                      {item.imageUrl}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <Badge variant="secondary" className="text-xs bg-orange-500/20 text-orange-400 border-orange-500/50">
                          {item.category}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-orange-400">
                          <Clock className="w-4 h-4" />
                          CANCELLED
                        </div>
                        <div className="text-muted-foreground">
                          {item.bidCount} bids
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-orange-400">
                          ${item.currentBid.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Final Bid
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Won Auctions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Won Auctions</h2>
            <Badge variant="outline" className="border-green-500 text-green-400">
              {wonAuctions?.length || 0} Won
            </Badge>
          </div>

          {!wonAuctions || wonAuctions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No won auctions yet</p>
              <p className="text-sm text-muted-foreground mt-2">Auctions you win will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wonAuctions.map((item) => (
                <Card 
                  key={item.id} 
                  className="gradient-card border-green-500/20 hover:border-green-500/50 transition-smooth overflow-hidden group"
                >
                  <div className="p-6 space-y-4">
                    <div className="text-6xl text-center py-4 group-hover:scale-110 transition-smooth">
                      {item.imageUrl}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/50">
                          {item.category}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-green-400">
                          <Clock className="w-4 h-4" />
                          WON
                        </div>
                        <div className="text-muted-foreground">
                          {item.bidCount} bids
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-green-400">
                          ${item.currentBid.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Winning Bid
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Won Auction Popup */}
      {showWonPopup && latestWonAuction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md gradient-card border-accent/50 animate-in zoom-in-95 duration-300">
            <div className="p-6 text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <div>
                <h2 className="text-2xl font-bold text-accent mb-2">Congratulations!</h2>
                <p className="text-lg font-semibold">{latestWonAuction.name}</p>
                <p className="text-muted-foreground">You won this auction!</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                  <span className="text-sm text-muted-foreground">Final Bid</span>
                  <span className="text-xl font-bold text-accent">
                    ${latestWonAuction.currentBid.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <span className="font-semibold">{latestWonAuction.category}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowWonPopup(false)}
                >
                  Close
                </Button>
                <Button 
                  variant="bid" 
                  className="flex-1"
                  onClick={() => {
                    setShowWonPopup(false);
                    // In real app, navigate to payment/collection page
                    toast.info("Payment details will be sent to your email");
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Bid Modal */}
      {showBidModal && selectedAuction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md gradient-card border-accent/50 animate-in zoom-in-95 duration-300">
            <div className="p-6 space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-accent mb-2">Place a Bid</h2>
                <p className="text-lg font-semibold">{selectedAuction.name}</p>
                <p className="text-muted-foreground">Current bid: ${selectedAuction.currentBid.toLocaleString()}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bid Amount</label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={customBidAmount}
                      onChange={(e) => setCustomBidAmount(e.target.value)}
                      placeholder="Enter bid amount"
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                      min={selectedAuction.currentBid + 1}
                      max={walletBalance}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum: ${(selectedAuction.currentBid + 1).toLocaleString()} | 
                    Maximum: ${walletBalance.toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                  <span className="text-sm text-muted-foreground">Your Wallet Balance</span>
                  <span className="text-lg font-bold text-green-400">
                    ${walletBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowBidModal(false);
                    setSelectedAuction(null);
                    setCustomBidAmount("");
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="bid" 
                  className="flex-1"
                  onClick={handlePlaceBid}
                  disabled={!customBidAmount || parseFloat(customBidAmount) <= selectedAuction.currentBid || parseFloat(customBidAmount) > walletBalance}
                >
                  Place Bid
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Customer;
