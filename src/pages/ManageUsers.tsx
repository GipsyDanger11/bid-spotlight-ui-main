import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, UserCheck, UserX, Mail, Shield } from "lucide-react";
import { toast } from "sonner";
import { userApi, type User } from "@/services/api";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userApi.getAllUsers();
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "border-accent text-accent";
      case "SELLER":
        return "border-primary text-primary";
      default:
        return "border-muted-foreground text-muted-foreground";
    }
  };

  const handleSuspend = async (userId: number, userName: string) => {
    try {
      await userApi.suspendUser(userId);
      toast.success(`User ${userName} has been suspended`);
      loadUsers(); // Refresh the list
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error('Failed to suspend user');
    }
  };

  const handleActivate = async (userId: number, userName: string) => {
    try {
      await userApi.activateUser(userId);
      toast.success(`User ${userName} has been activated`);
      loadUsers(); // Refresh the list
    } catch (error) {
      console.error('Error activating user:', error);
      toast.error('Failed to activate user');
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
            <h1 className="text-3xl md:text-4xl font-bold">Manage Users</h1>
            <p className="text-muted-foreground">View and moderate platform users</p>
          </div>
        </div>

        <Card className="gradient-card border-primary/20 p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
            <Card 
              key={user.id} 
              className="gradient-card border-border hover:border-primary/50 transition-smooth"
            >
              <div className="p-6">
                <div className="grid md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-2">
                    <h3 className="font-bold text-lg mb-1">{user.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <Badge variant="outline" className={getRoleBadge(user.role)}>
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge 
                      variant="outline" 
                      className={user.status === "ACTIVE" ? "border-green-500/50 text-green-400" : "border-destructive text-destructive"}
                    >
                      {user.status === "ACTIVE" ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1).toLowerCase()}
                    </Badge>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Bids / Sales</p>
                    <p className="text-lg font-semibold">
                      {user.totalBids} / {user.totalSales}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {user.status === "ACTIVE" ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => handleSuspend(user.id, user.name)}
                      >
                        Suspend
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                        onClick={() => handleActivate(user.id, user.name)}
                      >
                        Activate
                      </Button>
                    )}
                  </div>
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

export default ManageUsers;
