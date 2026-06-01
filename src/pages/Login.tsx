import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Gavel, TrendingUp, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import loginBg from "@/assets/login-bg.jpg";
import { userApi } from "@/services/api";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CUSTOMER", "SELLER"], {
    required_error: "Please select a role",
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("login");

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER",
    },
  });

  const handleLogin = async (role: "customer" | "seller" | "admin") => {
    const values = loginForm.getValues();
    
    if (!values.email || !values.password) {
      toast.error("Please enter email and password");
      return;
    }

    // Check credentials based on role
    try {
      const user = await userApi.getUserByEmail(values.email);
      
      if (!user || user.password !== values.password) {
        toast.error("Invalid email or password");
        return;
      }

      if (user.role.toLowerCase() !== role) {
        toast.error(`This account is not a ${role}`);
        return;
      }

      // Store user info
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(`Logged in as ${user.name}`);
      
      switch (role) {
        case "customer":
          navigate("/customer");
          break;
        case "seller":
          navigate("/seller");
          break;
        case "admin":
          navigate("/admin");
          break;
      }
    } catch (error) {
      console.error("Login error:", error);
      // Fallback for demo mode if backend is not running
      let isValid = false;
      let mockUser = { id: 0, name: "", email: values.email, role: role.toUpperCase() };

      switch (role) {
        case "admin":
          isValid = values.email === "admin@bidlux.com" && values.password === "admin123";
          mockUser.id = 1;
          mockUser.name = "Admin User";
          break;
        case "seller":
          isValid = values.email === "seller@bidlux.com" && values.password === "seller123";
          mockUser.id = 2;
          mockUser.name = "John Smith";
          break;
        case "customer":
          isValid = (values.email === "customer@bidlux.com" && values.password === "customer123");
          mockUser.id = 3;
          mockUser.name = "Jane Doe";
          if (!isValid && values.email === "customer2@bidlux.com" && values.password === "customer456") {
            isValid = true;
            mockUser.id = 4;
            mockUser.name = "Customer 2";
          }
          break;
      }

      if (isValid) {
        localStorage.setItem("user", JSON.stringify(mockUser));
        toast.success(`Logged in as ${role} (Demo Mode)`);
        switch (role) {
          case "customer": navigate("/customer"); break;
          case "seller": navigate("/seller"); break;
          case "admin": navigate("/admin"); break;
        }
      } else {
        toast.error("Invalid credentials or backend not running");
      }
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      const newUser = await userApi.createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        status: "ACTIVE",
        totalBids: 0,
        totalSales: 0,
        walletBalance: 10000,
      });

      toast.success(`Registration successful! Welcome, ${newUser.name}`);
      
      // Navigate based on role
      if (data.role === "CUSTOMER") {
        navigate("/customer");
      } else if (data.role === "SELLER") {
        navigate("/seller");
      }
    } catch (error) {
      toast.error("Registration failed. Email may already be in use.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <Card className="w-full max-w-5xl gradient-card border-primary/20 shadow-elegant relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full gradient-primary opacity-10 blur-3xl" />
        
        <div className="p-8 md:p-12 relative">
          <div className="flex items-center gap-3 mb-8">
            <Gavel className="w-10 h-10 text-accent" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-accent">BidLux</h1>
              <p className="text-xl text-muted-foreground">Premium Online Auction Platform</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Form {...loginForm}>
                    <form className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="email@example.com"
                                {...field}
                                className="h-12 bg-background/50 border-border backdrop-blur-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••"
                                {...field}
                                className="h-12 bg-background/50 border-border backdrop-blur-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>

                  <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                    <p className="font-semibold mb-2">Demo Accounts:</p>
                    <p><strong>Admin:</strong> admin@bidlux.com / admin123</p>
                    <p><strong>Seller:</strong> seller@bidlux.com / seller123</p>
                    <p><strong>Customer:</strong> customer@bidlux.com / customer123</p>
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-4">
                  <h2 className="text-2xl font-semibold mb-4">Login As</h2>
                  
                  <Button
                    size="lg"
                    variant="premium"
                    onClick={() => handleLogin("customer")}
                    className="justify-start h-16"
                  >
                    <TrendingUp className="w-6 h-6" />
                    <div className="text-left flex-1">
                      <div className="font-bold text-base">Customer</div>
                      <div className="text-xs opacity-80">Browse and bid on items</div>
                    </div>
                  </Button>

                  <Button
                    size="lg"
                    variant="premium"
                    onClick={() => handleLogin("seller")}
                    className="justify-start h-16"
                  >
                    <Gavel className="w-6 h-6" />
                    <div className="text-left flex-1">
                      <div className="font-bold text-base">Seller</div>
                      <div className="text-xs opacity-80">List and manage products</div>
                    </div>
                  </Button>

                  <Button
                    size="lg"
                    variant="premium"
                    onClick={() => handleLogin("admin")}
                    className="justify-start h-16"
                  >
                    <ShieldCheck className="w-6 h-6" />
                    <div className="text-left flex-1">
                      <div className="font-bold text-base">Admin</div>
                      <div className="text-xs opacity-80">Manage platform operations</div>
                    </div>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <div className="max-w-2xl mx-auto">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-6">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              className="h-12 bg-background/50 border-border backdrop-blur-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="email@example.com"
                              {...field}
                              className="h-12 bg-background/50 border-border backdrop-blur-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••"
                              {...field}
                              className="h-12 bg-background/50 border-border backdrop-blur-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Register as</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-3"
                            >
                              <div className="flex items-center space-x-3 border border-border rounded-lg p-4 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                                <RadioGroupItem value="CUSTOMER" id="customer" />
                                <Label htmlFor="customer" className="flex items-center gap-3 cursor-pointer flex-1">
                                  <TrendingUp className="w-5 h-5 text-primary" />
                                  <div>
                                    <div className="font-semibold">Customer</div>
                                    <div className="text-sm text-muted-foreground">Browse and bid on items</div>
                                  </div>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-3 border border-border rounded-lg p-4 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                                <RadioGroupItem value="SELLER" id="seller" />
                                <Label htmlFor="seller" className="flex items-center gap-3 cursor-pointer flex-1">
                                  <Gavel className="w-5 h-5 text-primary" />
                                  <div>
                                    <div className="font-semibold">Seller</div>
                                    <div className="text-sm text-muted-foreground">List and manage products</div>
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" variant="premium" className="w-full h-12">
                      Create Account
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default Login;
