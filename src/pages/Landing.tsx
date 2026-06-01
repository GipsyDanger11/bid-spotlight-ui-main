import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Gavel, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp, 
  Clock, 
  BarChart3, 
  CheckCircle2,
  Star,
  ArrowRight,
  Mail,
  Twitter,
  Linkedin,
  Github
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Real-Time Bidding",
      description: "Experience lightning-fast bid updates with our real-time auction engine"
    },
    {
      icon: Users,
      title: "Role-Based Dashboards",
      description: "Tailored interfaces for Admins, Sellers, and Customers"
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Bank-level security with encrypted authentication and payments"
    },
    {
      icon: TrendingUp,
      title: "Intuitive Interface",
      description: "Responsive design built with modern React technology"
    },
    {
      icon: Clock,
      title: "Auction Management",
      description: "Create, manage, and track auctions effortlessly"
    },
    {
      icon: BarChart3,
      title: "Transparent Analytics",
      description: "Comprehensive reporting and historical auction data"
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "50K+", label: "Completed Auctions" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Professional Seller",
      content: "BidLux transformed my online auction business. The platform is incredibly intuitive and the real-time features are game-changing.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Regular Buyer",
      content: "I've never experienced such smooth bidding. The interface is clean, fast, and I always feel secure with my transactions.",
      rating: 5
    },
    {
      name: "Emma Williams",
      role: "Auction Admin",
      content: "Managing auctions has never been easier. The analytics and reporting tools give us complete visibility into our operations.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10 blur-3xl" />
        
        <div className="container mx-auto text-center relative z-10 animate-enter">
          <div className="flex justify-center mb-6">
            <div className="gradient-card p-4 rounded-full shadow-glow">
              <Gavel className="w-16 h-16 text-accent" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
            Welcome to BidLux
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            The secure, real-time auction platform built for everyone. 
            Experience the future of online bidding with advanced technology and unmatched reliability.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              variant="premium"
              onClick={() => navigate("/login")}
              className="text-lg px-8 h-14"
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/login")}
              className="text-lg px-8 h-14"
            >
              Explore Auctions
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="gradient-card border-primary/20 p-6 shadow-elegant hover-scale">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 gradient-accent opacity-5 blur-3xl" />
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose BidLux?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to give you the ultimate auction experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="gradient-card border-primary/20 p-8 shadow-elegant hover-scale transition-smooth">
                <div className="gradient-primary p-4 rounded-full w-fit mb-4 shadow-glow">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our users have to say about their BidLux experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="gradient-card border-primary/20 p-8 shadow-elegant">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10 blur-3xl" />
        
        <div className="container mx-auto text-center relative z-10">
          <Card className="gradient-card border-primary/20 p-12 md:p-16 shadow-elegant max-w-4xl mx-auto">
            <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Bidding?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied users and experience the most advanced auction platform today
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                variant="premium"
                onClick={() => navigate("/login")}
                className="text-lg px-8 h-14"
              >
                Sign Up Now <ArrowRight className="ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/contact")}
                className="text-lg px-8 h-14"
              >
                Contact Us <Mail className="ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Gavel className="w-6 h-6 text-accent" />
                <span className="text-xl font-bold text-accent">BidLux</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Premium online auction platform for the modern world
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-smooth">Features</a></li>
                <li><a href="#" className="hover:text-accent transition-smooth">Pricing</a></li>
                <li><a href="#" className="hover:text-accent transition-smooth">Security</a></li>
                <li><a href="#" className="hover:text-accent transition-smooth">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-smooth">About</a></li>
                <li><a href="#" className="hover:text-accent transition-smooth">Blog</a></li>
                <li><a href="#" className="hover:text-accent transition-smooth">Careers</a></li>
                <li><a href="#" className="hover:text-accent transition-smooth">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <div className="flex gap-4">
                <a href="#" className="hover:text-accent transition-smooth">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-accent transition-smooth">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-accent transition-smooth">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-accent transition-smooth">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 BidLux. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;