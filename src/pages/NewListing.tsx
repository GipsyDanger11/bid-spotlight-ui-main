import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, DollarSign, Calendar, Package } from "lucide-react";
import { toast } from "sonner";
import { auctionApi } from "@/services/api";

const NewListing = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startingBid: "",
    category: "",
    duration: ""
  });
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("📦");
  const [user, setUser] = useState<any>(null);

  // Load user from localStorage
  useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create a listing");
      return;
    }
    try {
      setLoading(true);
      await auctionApi.createAuction({
        name: formData.title,
        description: formData.description,
        startingBid: parseFloat(formData.startingBid),
        category: formData.category,
        durationMinutes: parseInt(formData.duration),
        sellerId: user.id,
        imageUrl: selectedImage
      });
      toast.success("Listing created successfully! Pending admin approval.");
      navigate("/seller");
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageSelect = (image: string) => {
    setSelectedImage(image);
    toast.success(`Selected image: ${image}`);
  };

  const imageOptions = [
    { emoji: "🕰️", label: "Watch" },
    { emoji: "💎", label: "Jewelry" },
    { emoji: "🎨", label: "Art" },
    { emoji: "📷", label: "Electronics" },
    { emoji: "👜", label: "Fashion" },
    { emoji: "🏺", label: "Antiques" },
    { emoji: "📱", label: "Mobile" },
    { emoji: "💻", label: "Computer" },
    { emoji: "🚗", label: "Vehicle" },
    { emoji: "📚", label: "Books" },
    { emoji: "🎵", label: "Music" },
    { emoji: "⚽", label: "Sports" }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/seller")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Create New Listing</h1>
            <p className="text-muted-foreground">List your item for auction</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="gradient-card border-primary/20 p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold">
                  Item Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter item title..."
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide detailed description of your item..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-base font-semibold">
                    Category *
                  </Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="category"
                      name="category"
                      placeholder="e.g., Watches, Art, Antiques..."
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startingBid" className="text-base font-semibold">
                    Starting Bid ($) *
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="startingBid"
                      name="startingBid"
                      type="number"
                      placeholder="1000"
                      value={formData.startingBid}
                      onChange={handleChange}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-base font-semibold">
                  Auction Duration (Minutes) *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    placeholder="60"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Item Image
                </Label>
                
                {/* Selected Image Preview */}
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">{selectedImage}</div>
                  <p className="text-sm text-muted-foreground">Selected Image</p>
                </div>

                {/* Image Selection Grid */}
                <div className="grid grid-cols-6 gap-3">
                  {imageOptions.map((option) => (
                    <Card
                      key={option.emoji}
                      className={`border-2 cursor-pointer transition-smooth hover:border-primary/50 ${
                        selectedImage === option.emoji 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:bg-card/50'
                      }`}
                      onClick={() => handleImageSelect(option.emoji)}
                    >
                      <div className="p-4 text-center">
                        <div className="text-2xl mb-1">{option.emoji}</div>
                        <p className="text-xs text-muted-foreground">{option.label}</p>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <p className="text-xs text-muted-foreground text-center">
                  Click on an emoji to select as your item image
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  variant="bid" 
                  size="lg" 
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Submit for Approval"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/seller")}
                >
                  Cancel
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                * Your listing will be reviewed by our admin team before going live
              </p>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default NewListing;
