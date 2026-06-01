import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Gavel, Plus, DollarSign, Package, LogOut, Eye } from "lucide-react";
import { toast } from "sonner";
import { auctionApi, type Auction } from "@/services/api";

const Seller = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [timeUpdate, setTimeUpdate] = useState(0); // Force re-render for time updates

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Helper function to calculate time left in minutes
  const calculateTimeLeft = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  useEffect(() => {
    if (user) {
      loadSellerListings();
    }
  }, [user]);

  // Update time display every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdate(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const loadSellerListings = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const auctions = await auctionApi.getAuctionsBySeller(user.id);
      setListings(auctions);
    } catch (error) {
      console.error('Error loading listings:', error);
      
      // Fallback data when API is not available
      console.log('Using fallback data - backend might not be running');
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
    navigate("/");
  };

  const handleCreateListing = () => {
    navigate("/seller/new-listing");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "border-primary text-primary";
      case "COMPLETED":
        return "border-accent text-accent";
      case "PENDING":
        return "border-muted-foreground text-muted-foreground";
      case "REJECTED":
        return "border-destructive text-destructive";
      default:
        return "";
    }
  };

  const totalRevenue = listings
    .filter(item => item.status === "COMPLETED")
    .reduce((sum, item) => sum + item.currentBid, 0);

  const activeListings = listings.filter(item => item.status === "ACTIVE").length;

  return (
    <div className="min-h-screen p-4 md:p-8 animated-bg animate-enter">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gavel className="w-8 h-8 text-accent" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Seller Dashboard</h1>
              <p className="text-muted-foreground">Manage your listings</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="gradient-card border-primary/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Listings</p>
                <p className="text-3xl font-bold text-primary">{activeListings}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </Card>
          
          <Card className="gradient-card border-primary/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-accent">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-accent" />
            </div>
          </Card>

          <Card className="gradient-card border-primary/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-3xl font-bold text-foreground">
                  {listings.reduce((sum, item) => sum + item.views, 0)}
                </p>
              </div>
              <Eye className="w-8 h-8 text-foreground" />
            </div>
          </Card>

          

          <Card className="gradient-card border-primary/20 p-6">
            <Button 
              variant="bid" 
              className="w-full h-full"
              onClick={handleCreateListing}
            >
              <Plus className="w-5 h-5" />
              New Listing
            </Button>
          </Card>
        </div>

        {/* Listings */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Listings</h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading listings...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((item) => (
                <Card 
                  key={item.id} 
                  className="gradient-card border-border hover:border-primary/50 transition-smooth"
                >
                  <div className="p-6">
                    <div className="grid md:grid-cols-5 gap-4 items-center">
                      <div className="md:col-span-2">
                        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                        <Badge variant="outline" className={getStatusColor(item.status)}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Starting Bid</p>
                        <p className="text-lg font-semibold">${item.startingBid.toLocaleString()}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Current Bid</p>
                        <p className="text-lg font-bold text-accent">
                          ${item.currentBid.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Time Left</p>
                          <p className="text-sm font-semibold text-accent">{calculateTimeLeft(item.endTime)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Views</p>
                          <p className="text-lg font-semibold">{item.views}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Bids</p>
                          <p className="text-lg font-semibold text-primary">{item.bidCount}</p>
                        </div>
                      </div>
                    </div>
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
              0 Cancelled
            </Badge>
          </div>

          <div className="text-center py-8">
            <p className="text-muted-foreground">No cancelled auctions</p>
            <p className="text-sm text-muted-foreground mt-2">Cancelled auctions will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seller;
