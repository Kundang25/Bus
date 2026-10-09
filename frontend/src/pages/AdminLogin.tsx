import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldCheck, Lock } from "lucide-react";

const AdminLogin = () => {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = adminLogin(adminId, password);
    setIsLoading(false);

    if (success) {
      toast.success("Admin login successful!");
      navigate("/admin/dashboard");
    } else {
      toast.error("Invalid Admin ID or Password");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Access the analytics dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminId">Admin ID</Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="adminId"
                    type="text"
                    placeholder="Enter Admin ID"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 rounded-lg bg-muted p-3 text-center text-xs text-muted-foreground">
              <p className="font-medium">Demo Credentials:</p>
              <p>ID: ADMIN001 | Password: admin123</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t bg-muted/50 p-4">
        <div className="container mx-auto text-center text-xs text-muted-foreground">
          <p>
            Government of India | Department of Transport
          </p>
          <p className="mt-1">
            © 2026 Shakthi Scheme. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;
