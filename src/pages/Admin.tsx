import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Users, 
  Package, 
  DollarSign, 
  LogOut,
  TrendingUp,
  Activity,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { userApi, auctionApi, paymentsApi, type User, type Auction } from "@/services/api";
import { usePolling } from "@/hooks/usePolling";

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeAuctions: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    wonAuctions: 0,
    totalWallet: 0,
    totalPaid: 0,
    totalDue: 0
  });
  const [loading, setLoading] = useState(true);
  const [wonAuctions, setWonAuctions] = useState<Auction[]>([]);
  const [completedAuctions, setCompletedAuctions] = useState<Auction[]>([]);

  const loadAdminStats = useCallback(async () => {
    try {
      setLoading(true);
      const [users, activeAuctions, pendingAuctions, completedAuctionsList, paymentsSummary] = await Promise.all([
        userApi.getAllUsers(),
        auctionApi.getActiveAuctions(),
        auctionApi.getPendingAuctions(),
        auctionApi.getCompletedAuctions(),
        paymentsApi.getSummary()
      ]);

      const nonAdminUsers = users.filter(u => u.role !== 'ADMIN');
      const totalRevenue = completedAuctionsList.reduce((sum, auction) => sum + auction.currentBid, 0);
      const totalWallet = nonAdminUsers.reduce((sum, u) => sum + u.walletBalance, 0);
      
      // Set completed auctions
      setCompletedAuctions(completedAuctionsList);
      setWonAuctions(completedAuctionsList);

      setStats({
        totalUsers: nonAdminUsers.length,
        activeAuctions: activeAuctions.length,
        totalRevenue: totalRevenue,
        pendingApprovals: pendingAuctions.length,
        wonAuctions: completedAuctionsList.length,
        totalWallet,
        totalPaid: paymentsSummary.totalPaid,
        totalDue: paymentsSummary.totalDue
      });
    } catch (error) {
      console.error('Error loading admin stats:', error);
      
      // Fallback data when API is not available
      console.log('Using fallback data - backend might not be running');
      setStats({
        totalUsers: 2,
        activeAuctions: 1,
        totalRevenue: 2500,
        pendingApprovals: 1,
        wonAuctions: 2,
        totalWallet: 10000,
        totalPaid: 500,
        totalDue: 2000
      });
      
      // Demo won auctions data
      setWonAuctions([
        {
          id: 101,
          name: "Antique Silver Vase",
          description: "Beautiful antique silver vase from the 1800s.",
          startingBid: 500,
          currentBid: 1200,
          category: "Antiques",
          durationMinutes: 7 * 24 * 60,
          endTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Ended 2 hours ago
          status: "ACTIVE",
          createdDate: new Date().toISOString(),
          views: 89,
          bidCount: 15,
          imageUrl: "🏺",
          sellerId: 2,
          sellerName: "John Smith",
          sellerEmail: "seller@bidlux.com",
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
          endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // Ended 1 hour ago
          status: "ACTIVE",
          createdDate: new Date().toISOString(),
          views: 67,
          bidCount: 8,
          imageUrl: "📷",
          sellerId: 2,
          sellerName: "John Smith",
          sellerEmail: "seller@bidlux.com",
          timeLeft: "Ended"
        }
      ]);
      
      toast.info('Using demo data - start backend for live data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminStats();
  }, [loadAdminStats]);

  // Poll for updates every 5 seconds
  usePolling(loadAdminStats, 5000, true);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
    navigate("/");
  };

  const recentActivity = [
    { id: 1, action: "New user registered", user: "john@example.com", time: "2 min ago" },
    { id: 2, action: "Auction created", user: "seller@example.com", time: "5 min ago" },
    { id: 3, action: "Bid placed", user: "customer@example.com", time: "8 min ago" },
    { id: 4, action: "Item sold", user: "seller2@example.com", time: "15 min ago" },
    { id: 5, action: "User report", user: "admin@example.com", time: "23 min ago" }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 animated-bg animate-enter">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-accent" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Platform management & oversight</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="gradient-card border-primary/20 p-6 hover:border-primary/50 transition-smooth">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold text-primary">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +12% this month
                </p>
              </div>
              <Users className="w-10 h-10 text-primary" />
            </div>
          </Card>

          <Card className="gradient-card border-primary/20 p-6 hover:border-primary/50 transition-smooth">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Auctions</p>
                <p className="text-3xl font-bold text-accent">
                  {stats.activeAuctions}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <Activity className="w-3 h-3 inline mr-1" />
                  Live bidding
                </p>
              </div>
              <Package className="w-10 h-10 text-accent" />
            </div>
          </Card>

          <Card className="gradient-card border-primary/20 p-6 hover:border-primary/50 transition-smooth">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-foreground">
                  ${stats.totalPaid.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +8% this week
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-foreground" />
            </div>
          </Card>

          <Card className="gradient-card border-destructive/50 p-6 hover:border-destructive transition-smooth">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Due Payments</p>
                <p className="text-3xl font-bold text-destructive">${stats.totalDue.toLocaleString()}</p>
                <p className="text-xs text-destructive/80 mt-1">
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                  Requires attention
                </p>
              </div>
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
          </Card>

          <Card className="gradient-card border-accent/50 p-6 hover:border-accent transition-smooth">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Won Auctions</p>
                <p className="text-3xl font-bold text-accent">{stats.wonAuctions}</p>
                <p className="text-xs text-accent/80 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  Recently completed
                </p>
              </div>
              <ShieldCheck className="w-10 h-10 text-accent" />
            </div>
          </Card>

        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Button 
            variant="premium" 
            size="lg" 
            className="h-auto py-6"
            onClick={() => navigate("/admin/manage-users")}
          >
            <Users className="w-5 h-5" />
            <div className="text-left flex-1">
              <div className="font-bold">Manage Users</div>
              <div className="text-xs text-muted-foreground">View and moderate users</div>
            </div>
          </Button>

          <Button 
            variant="premium" 
            size="lg" 
            className="h-auto py-6"
            onClick={() => navigate("/admin/manage-auctions")}
          >
            <Package className="w-5 h-5" />
            <div className="text-left flex-1">
              <div className="font-bold">Manage Auctions</div>
              <div className="text-xs text-muted-foreground">Review and approve listings</div>
            </div>
          </Button>

          <Button 
            variant="premium" 
            size="lg" 
            className="h-auto py-6"
            onClick={() => navigate("/admin/past-auctions")}
          >
            <ShieldCheck className="w-5 h-5" />
            <div className="text-left flex-1">
              <div className="font-bold">Expenses Tracking</div>
              <div className="text-xs text-muted-foreground">Paid vs Due by customer</div>
            </div>
          </Button>
        </div>

        {/* Won Auctions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Won Auctions</h2>
            <Badge variant="outline" className="border-accent text-accent">
              {wonAuctions.length} Completed
            </Badge>
          </div>

          <Card className="gradient-card border-border">
            <div className="divide-y divide-border">
              {wonAuctions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No auctions have been won yet</p>
                </div>
              ) : (
                wonAuctions.map((auction) => (
                  <div 
                    key={auction.id} 
                    className="p-4 hover:bg-card/50 transition-smooth"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{auction.imageUrl}</div>
                        <div className="space-y-1">
                          <p className="font-medium">{auction.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {auction.category} • {auction.bidCount} bids
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Seller: {auction.sellerName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-accent">
                          ${auction.currentBid.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Final bid
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <Badge variant="outline" className="border-primary text-primary">
              Live Updates
            </Badge>
          </div>

          <Card className="gradient-card border-border">
            <div className="divide-y divide-border">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id} 
                  className="p-4 hover:bg-card/50 transition-smooth cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.user}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* System Status */}
        <Card className="gradient-card border-primary/20 p-6">
          <h3 className="text-xl font-bold mb-4">System Status</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Server Health</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  Operational
                </Badge>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[98%]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  Operational
                </Badge>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[95%]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Response</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  Optimal
                </Badge>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[99%]" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
