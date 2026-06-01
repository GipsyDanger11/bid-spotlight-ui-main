import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Users, Package, Activity } from "lucide-react";

const ViewReports = () => {
  const navigate = useNavigate();

  const monthlyData = [
    { month: "Jan", revenue: 45000, users: 120, auctions: 89 },
    { month: "Feb", revenue: 52000, users: 145, auctions: 102 },
    { month: "Mar", revenue: 68000, users: 189, auctions: 134 },
    { month: "Apr", revenue: 71000, users: 210, auctions: 156 },
    { month: "May", revenue: 85000, users: 245, auctions: 178 },
    { month: "Jun", revenue: 92000, users: 278, auctions: 201 }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Analytics & Reports</h1>
            <p className="text-muted-foreground">Platform insights and trends</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="gradient-card border-primary/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Total Revenue</h3>
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold gradient-accent bg-clip-text text-transparent mb-2">
              $413,000
            </p>
            <p className="text-sm text-green-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +24.5% from last period
            </p>
          </Card>

          <Card className="gradient-card border-primary/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Total Users</h3>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary mb-2">
              1,187
            </p>
            <p className="text-sm text-green-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +13.6% from last period
            </p>
          </Card>

          <Card className="gradient-card border-primary/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Total Auctions</h3>
              <Package className="w-5 h-5 text-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">
              860
            </p>
            <p className="text-sm text-green-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +18.2% from last period
            </p>
          </Card>
        </div>

        <Card className="gradient-card border-primary/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Monthly Performance</h3>
            <Activity className="w-5 h-5 text-primary" />
          </div>
          
          <div className="space-y-6">
            {monthlyData.map((data) => (
              <div key={data.month} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{data.month}</span>
                  <span className="text-sm text-muted-foreground">
                    ${data.revenue.toLocaleString()} revenue
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="font-semibold gradient-accent bg-clip-text text-transparent">
                        ${data.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full gradient-accent" 
                        style={{ width: `${(data.revenue / 100000) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Users</span>
                      <span className="font-semibold text-primary">{data.users}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full gradient-primary" 
                        style={{ width: `${(data.users / 300) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Auctions</span>
                      <span className="font-semibold">{data.auctions}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-foreground" 
                        style={{ width: `${(data.auctions / 250) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="gradient-card border-primary/20 p-6">
            <h3 className="text-xl font-bold mb-4">Top Performing Categories</h3>
            <div className="space-y-4">
              {[
                { name: "Watches & Jewelry", sales: 156, revenue: 125000 },
                { name: "Art & Collectibles", sales: 134, revenue: 98000 },
                { name: "Antique Furniture", sales: 89, revenue: 67000 },
                { name: "Electronics", sales: 67, revenue: 45000 }
              ].map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{category.name}</span>
                    <span className="text-sm gradient-accent bg-clip-text text-transparent font-bold">
                      ${category.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full gradient-accent" 
                      style={{ width: `${(category.revenue / 125000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="gradient-card border-primary/20 p-6">
            <h3 className="text-xl font-bold mb-4">Top Sellers</h3>
            <div className="space-y-4">
              {[
                { name: "Premium Auctions LLC", sales: 234, revenue: 189000 },
                { name: "Vintage Treasures Co", sales: 189, revenue: 145000 },
                { name: "Collectible Corner", sales: 156, revenue: 112000 },
                { name: "Elite Antiques", sales: 123, revenue: 98000 }
              ].map((seller, index) => (
                <div key={seller.name} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{seller.name}</p>
                      <p className="text-xs text-muted-foreground">{seller.sales} sales</p>
                    </div>
                  </div>
                  <span className="font-bold gradient-accent bg-clip-text text-transparent">
                    ${seller.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewReports;
