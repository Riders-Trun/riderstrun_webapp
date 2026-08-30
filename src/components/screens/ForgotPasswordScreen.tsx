import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, MailCheck } from "lucide-react";
import { authApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

/**
 * Step one of the reset: ask for the email, and say the same thing either way.
 *
 * The server deliberately answers identically for a known and an unknown
 * address so nobody can use this form to discover who has an account. Showing a
 * different message here would give that back, so the success panel below is
 * shown on any 2xx — it says a link was sent *if* the account exists.
 */
const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch (error) {
      // A rate-limit or an outage is worth surfacing; a missing account is not,
      // and the server does not report one.
      toast({
        title: "Could not send the reset link",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">RT</span>
          </div>
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            {sent
              ? "Check your inbox for the next step"
              : "We'll email you a link to set a new one"}
          </p>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4 text-center">
              <MailCheck className="w-12 h-12 mx-auto text-green-600" />
              <p className="text-sm text-gray-600">
                If an account exists for <span className="font-medium">{email}</span>, a reset link
                is on its way. The link expires in one hour.
              </p>
              <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={() => navigate("/auth")}>
                Back to sign in
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : "Send reset link"}
              </Button>
              <p className="text-center text-sm text-gray-500">
                <Link to="/auth" className="text-orange-600 hover:underline">
                  Back to sign in
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordScreen;
