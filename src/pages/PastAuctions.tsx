import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Search, 
  Trophy, 
  User as UserIcon, 
  DollarSign, 
  Calendar,
  Clock,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { userApi, paymentsApi, auctionApi, type User, type Auction } from "@/services/api";

interface PastAuction extends Auction {
  winnerName?: string;
  winnerEmail?: string;
  endDate?: string;
  finalBid?: number;
}

const PastAuctions = () => {
  const navigate = useNavigate();
  const [pastAuctions, setPastAuctions] = useState<PastAuction[]>([]);
  const [summary, setSummary] = useState<{ totalPaid: number; totalDue: number }>({ totalPaid: 0, totalDue: 0 });
  const [userSummaries, setUserSummaries] = useState<Array<{ user: User; totalPaid: number; totalDue: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    loadPastAuctions();
  }, []);

  const loadPastAuctions = async () => {
    try {
      setLoading(true);
      // In real app, this would be a specific API call for past auctions
      const [allAuctions, payments, users] = await Promise.all([
        auctionApi.getActiveAuctions(),
        paymentsApi.getSummary(),
        userApi.getAllUsers()
      ]);
      
      // Filter for ended auctions and add winner data
      const now = new Date().getTime();
      const pastAuctionsData = allAuctions
        .filter(auction => {
          const endTime = new Date(auction.endTime).getTime();
          return endTime <= now;
        })
        .map(auction => ({
          ...auction,
          winnerName: `Customer ${Math.floor(Math.random() * 1000) + 1}`,
          winnerEmail: `customer${Math.floor(Math.random() * 1000) + 1}@bidlux.com`,
          endDate: auction.endTime,
          finalBid: auction.currentBid
        }));

      setPastAuctions(pastAuctionsData);
      setSummary(payments);
      const nonAdmin = users.filter(u => u.role !== 'ADMIN');
      const perUser = await Promise.all(
        nonAdmin.map(async (u) => {
          const us = await paymentsApi.getUserSummary(u.id);
          return { user: u, totalPaid: us.totalPaid, totalDue: us.totalDue };
        })
      );
      setUserSummaries(perUser);
    } catch (error) {
      console.error('Error loading past auctions:', error);
      
      // Fallback data when API is not available
      console.log('Using fallback data - backend might not be running');
      setPastAuctions([
        {
          id: 101,
          name: "Antique Silver Vase",
          description: "Beautiful antique silver vase from the 1800s.",
          startingBid: 500,
          currentBid: 1200,
          category: "Antiques",
          durationMinutes: 7 * 24 * 60,
          endTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: "ACTIVE",
          createdDate: new Date().toISOString(),
          views: 89,
          bidCount: 15,
          imageUrl: "🏺",
          sellerId: 2,
          sellerName: "John Smith",
          sellerEmail: "seller@bidlux.com",
          winnerName: "Alice Johnson",
          winnerEmail: "alice@bidlux.com",
          endDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          finalBid: 1200,
          timeLeft: "Ended"
        },
        {
          id: 102,
          name: "Vintage Camera",
          description: "Classic film camera in excellent condition.",
          startingBid: 200,
          currentBid: 450,
          category: "Electronics",
          durationMinutes: 7 * 24 * 60,
          endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          status: "ACTIVE",
          createdDate: new Date().toISOString(),
          views: 67,
          bidCount: 8,
          imageUrl: "📷",
          sellerId: 2,
          sellerName: "John Smith",
          sellerEmail: "seller@bidlux.com",
          winnerName: "Bob Wilson",
          winnerEmail: "bob@bidlux.com",
          endDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          finalBid: 450,
          timeLeft: "Ended"
        },
        {
          id: 103,
          name: "Rare Book Collection",
          description: "First edition books from the 1900s.",
          startingBid: 800,
          currentBid: 1500,
          category: "Books",
          durationMinutes: 7 * 24 * 60,
          endTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          status: "ACTIVE",
          createdDate: new Date().toISOString(),
          views: 45,
          bidCount: 12,
          imageUrl: "📚",
          sellerId: 2,
          sellerName: "John Smith",
          sellerEmail: "seller@bidlux.com",
          winnerName: "Carol Davis",
          winnerEmail: "carol@bidlux.com",
          endDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          finalBid: 1500,
          timeLeft: "Ended"
        }
      ]);
      
      toast.info('Using demo data - start backend for live data');
    } finally {
      setLoading(false);
    }
  };

  const filteredAuctions = pastAuctions.filter(auction => {
    const matchesSearch = auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         auction.winnerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || auction.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(pastAuctions.map(a => a.category)))];

  const formatEndDate = (endDate: string) => {
    const date = new Date(endDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just ended';
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 animated-bg animate-enter">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/admin")}>
              <ArrowLeft className="w-4 h-4" />
              Back to Admin
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Expenses Tracking</h1>
              <p className="text-muted-foreground">Amounts paid and due by customers</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search auctions or winners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Filter className="w-4 h-4 self-center text-muted-foreground" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="gradient-card border-primary/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-3xl font-bold text-primary">₹{summary.totalPaid.toLocaleString()}</p>
              </div>
              <Trophy className="w-8 h-8 text-primary" />
            </div>
          </Card>
          
          <Card className="gradient-card border-accent/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Due</p>
                <p className="text-2xl font-bold text-accent">₹{summary.totalDue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-accent" />
            </div>
          </Card>

          <Card className="gradient-card border-foreground/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Winners</p>
                <p className="text-3xl font-bold text-foreground">
                  {new Set(pastAuctions.map(a => a.winnerEmail)).size}
                </p>
              </div>
              <UserIcon className="w-8 h-8 text-foreground" />
            </div>
          </Card>
        </div>

        {/* Per-user Expenses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Customers</h2>
            <Badge variant="outline" className="border-accent text-accent">
              {userSummaries.length}
            </Badge>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading expenses...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {userSummaries.map(({ user, totalPaid, totalDue }) => (
                <Card key={user.id} className="gradient-card border-border">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Paid</p>
                        <p className="text-green-400 font-bold">₹{totalPaid.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Due</p>
                        <p className="text-accent font-bold">₹{totalDue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PastAuctions;
