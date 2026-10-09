import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { simulateAadhaarVerification } from "@/lib/mockData";
import { CheckCircle, XCircle, Shield, Fingerprint, Loader2 } from "lucide-react";

type VerificationState = "idle" | "verifying" | "success" | "failed";

const PassengerVerification = () => {
  const { tripId } = useParams();
  const [verificationState, setVerificationState] = useState<VerificationState>("idle");

  const handleVerify = async () => {
    setVerificationState("verifying");
    const isVerified = await simulateAadhaarVerification();
    setVerificationState(isVerified ? "success" : "failed");
  };

  const handleRetry = () => {
    setVerificationState("idle");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          {verificationState === "idle" && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Verify Your Eligibility</CardTitle>
                <CardDescription>
                  Shakthi Scheme - Free Bus Travel for Women
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                  Verify eligibility using Aadhaar (consent-based)
                </p>

                <Button
                  onClick={handleVerify}
                  className="w-full gap-2"
                  size="lg"
                >
                  <Fingerprint className="h-5 w-5" />
                  Verify using Aadhaar App
                </Button>

                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-xs text-muted-foreground">
                    <Shield className="mb-1 inline h-3 w-3" />
                    {" "}Aadhaar verification is consent-based and secure.
                    <br />
                    No personal data is collected or stored.
                  </p>
                </div>

                {tripId && (
                  <p className="text-center text-xs text-muted-foreground">
                    Trip ID: {tripId.slice(0, 15)}...
                  </p>
                )}
              </CardContent>
            </>
          )}

          {verificationState === "verifying" && (
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="mb-4 h-16 w-16 animate-spin text-primary" />
              <p className="text-lg font-medium">Verifying...</p>
              <p className="text-sm text-muted-foreground">
                Please wait while we verify your eligibility
              </p>
            </CardContent>
          )}

          {verificationState === "success" && (
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-green-700">
                ✔️ Eligible
              </h2>
              <p className="mb-4 text-center text-lg text-green-600">
                Shakthi Scheme Approved
              </p>
              <p className="text-center text-sm text-muted-foreground">
                You are eligible for free bus travel under the Shakthi Scheme.
                Please show this screen to the conductor.
              </p>
              <div className="mt-6 rounded-lg bg-green-50 p-4 text-center">
                <p className="text-xs text-green-700">
                  Valid for this trip only
                </p>
              </div>
            </CardContent>
          )}

          {verificationState === "failed" && (
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-red-700">
                ❌ Not Eligible
              </h2>
              <p className="mb-4 text-center text-lg text-red-600">
                Verification Failed
              </p>
              <p className="mb-6 text-center text-sm text-muted-foreground">
                Unable to verify eligibility for Shakthi Scheme.
                Please contact the conductor for assistance.
              </p>
              <Button onClick={handleRetry} variant="outline" className="gap-2">
                Try Again
              </Button>
            </CardContent>
          )}
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

export default PassengerVerification;
