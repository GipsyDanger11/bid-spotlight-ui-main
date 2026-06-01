import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Check, X, Eye } from "lucide-react";
import { toast } from "sonner";
import { auctionApi, type Auction } from "@/services/api";
import { usePolling } from "@/hooks/usePolling";

const ManageAuctions = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    loadAllAuctions(false);
  }, []);

  // Poll every 5s to reflect status changes (e.g., completion by scheduler)
  usePolling(() => loadAllAuctions(true), 5000, true);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAuctions(auctions);
    } else {
      const filtered = auctions.filter(auction => 
        auction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAuctions(filtered);
    }
  }, [searchQuery, auctions]);

  async function loadAllAuctions(silent: boolean = false) {
    try {
      if (!silent) setLoading(true);
      const auctionsData = await auctionApi.getAllAuctions();
      setAuctions(auctionsData);
      setFilteredAuctions(auctionsData);
    } catch (error) {
      console.error('Error loading auctions:', error);
      if (!silent) toast.error('Failed to load auctions');
    } finally {
      if (!silent) setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "border-green-500/50 text-green-400";
      case "PENDING":
        return "border-accent text-accent";
      case "REJECTED":
        return "border-destructive text-destructive";
      case "CANCELLED":
        return "border-orange-500/50 text-orange-400";
      case "COMPLETED":
        return "border-primary text-primary";
      default:
        return "";
    }
  };

  const handleApprove = async (auctionId: number, name: string) => {
    try {
      await auctionApi.approveAuction(auctionId);
      toast.success(`Auction "${name}" has been approved`);
      loadAllAuctions(); // Refresh the list
    } catch (error) {
      console.error('Error approving auction:', error);
      toast.error('Failed to approve auction');
    }
  };

  const handleReject = async (auctionId: number, name: string) => {
    try {
      await auctionApi.rejectAuction(auctionId);
      toast.error(`Auction "${name}" has been rejected`);
      loadAllAuctions(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting auction:', error);
      toast.error('Failed to reject auction');
    }
  };

  const handleCancel = async (auctionId: number, name: string) => {
    try {
      await auctionApi.cancelAuction(auctionId);
      toast.warning(`Auction "${name}" has been cancelled`);
      loadAllAuctions(); // Refresh the list
    } catch (error) {
      console.error('Error cancelling auction:', error);
      toast.error('Failed to cancel auction');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Manage Auctions</h1>
            <p className="text-muted-foreground">Review and approve listings</p>
          </div>
        </div>

        <Card className="gradient-card border-primary/20 p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search auctions by name or seller..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading auctions...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAuctions.map((auction) => (
            <Card 
              key={auction.id} 
              className="gradient-card border-border hover:border-primary/50 transition-smooth"
            >
              <div className="p-6">
                <div className="grid md:grid-cols-7 gap-4 items-center">
                  <div className="md:col-span-2">
                    <h3 className="font-bold text-lg mb-1">{auction.name}</h3>
                    <p className="text-sm text-muted-foreground">by {auction.sellerName}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge variant="outline" className={getStatusColor(auction.status)}>
                      {auction.status.charAt(0).toUpperCase() + auction.status.slice(1).toLowerCase()}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Starting Bid</p>
                    <p className="text-lg font-semibold">${auction.startingBid.toLocaleString()}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Current Bid</p>
                    <p className="text-lg font-bold gradient-accent bg-clip-text text-transparent">
                      ${auction.currentBid.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Views</p>
                        <p className="text-sm font-semibold flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {auction.views}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Bids</p>
                      <p className="text-sm font-semibold">{auction.bidCount}</p>
                    </div>
                  </div>

                  {auction.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                        onClick={() => handleApprove(auction.id, auction.name)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => handleReject(auction.id, auction.name)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {auction.status === "ACTIVE" && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                        onClick={() => handleCancel(auction.id, auction.name)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAuctions;
