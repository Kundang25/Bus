import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ShieldCheck, Bus } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Bus className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Welcome to Shakthi Scheme
            </h2>
            <p className="mt-2 text-muted-foreground">
              Government Bus Ticket Verification System
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Conductor Portal</CardTitle>
                <CardDescription>
                  Generate QR codes and track verifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/conductor">
                  <Button className="w-full">Conductor Login</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Admin Portal</CardTitle>
                <CardDescription>
                  View analytics and performance reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/admin">
                  <Button variant="outline" className="w-full">Admin Login</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>For Passengers:</strong> Scan the QR code displayed on the bus
              to verify your Shakthi Scheme eligibility.
            </p>
          </div>
        </div>
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

export default Index;
