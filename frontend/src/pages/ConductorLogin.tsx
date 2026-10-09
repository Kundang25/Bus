import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User, Lock } from "lucide-react";

const ConductorLogin = () => {
  const [conductorId, setConductorId] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { conductorLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = conductorLogin(conductorId, pin);
    setIsLoading(false);

    if (success) {
      toast.success("Login successful!");
      navigate("/conductor/dashboard");
    } else {
      toast.error("Invalid Conductor ID or PIN");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Conductor Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="conductorId">Conductor ID</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="conductorId"
                    type="text"
                    placeholder="Enter Conductor ID"
                    value={conductorId}
                    onChange={(e) => setConductorId(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin">PIN</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="pin"
                    type="password"
                    placeholder="Enter 4-digit PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="pl-10"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center">
                <Link
                  to="#"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot PIN?
                </Link>
              </div>
            </form>

            <div className="mt-6 rounded-lg bg-muted p-3 text-center text-xs text-muted-foreground">
              <p className="font-medium">Demo Credentials:</p>
              <p>ID: COND001 | PIN: 1234</p>
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

export default ConductorLogin;
