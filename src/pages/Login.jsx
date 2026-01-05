import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Users } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const getUsers = () => {
    const users = localStorage.getItem("registeredUsers");
    return users ? JSON.parse(users) : [];
  };

  const saveUser = (user) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem("registeredUsers", JSON.stringify(users));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const users = getUsers();

    if (isSignUp) {
      // Sign Up Flow
      if (password.length < 4) {
        toast({
          title: "Password too short",
          description: "Password must be at least 4 characters.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please ensure both passwords are the same.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        toast({
          title: "User already exists",
          description: "An account with this email already exists. Please log in.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      saveUser({ email, password });
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify({ email }));
      toast({
        title: "Account created!",
        description: "You have successfully registered and logged in.",
      });
      navigate("/dashboard");
    } else {
      // Login Flow
      const user = users.find((u) => u.email === email);

      if (!user) {
        toast({
          title: "User not found",
          description: "No account found with this email. Please sign up first.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (user.password !== password) {
        toast({
          title: "Incorrect password",
          description: "The password you entered is incorrect.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify({ email }));
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/dashboard");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <Users className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Employee Manager</CardTitle>
            <CardDescription className="mt-2">
              {isSignUp ? "Create a new account" : "Sign in to access your dashboard"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (isSignUp ? "Creating account..." : "Signing in...") : (isSignUp ? "Sign Up" : "Sign In")}
            </Button>
          </form>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setConfirmPassword("");
              }}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
