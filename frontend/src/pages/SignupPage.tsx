import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, User, Hotel, Settings, Eye, EyeOff } from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { AuthUser } from "@/lib/auth";
import { setAuthSession } from "@/lib/auth";

const roles = [
  {
    id: "visitor",
    label: "Traveler/Visitor",
    description: "Search places, book stays, find travel buddies",
    icon: User,
  },
  {
    id: "vendor",
    label: "Vendor/Owner",
    description: "List your property, promote tourist places",
    icon: Hotel,
  },
  {
    id: "admin",
    label: "Administrator",
    description: "Manage platform, users, and content",
    icon: Settings,
  },
];

const SignupPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("visitor");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [adminSignupKey, setAdminSignupKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roleLabel = roles.find((r) => r.id === selectedRole)?.label ?? "Visitor";

  const getRoleHomePath = () => "/dashboard";

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!agreeTerms) {
      setError("Please accept terms and privacy policy to continue.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest<{ token: string; user: AuthUser }>("/api/auth/signup", {
        method: "POST",
        body: {
          firstName,
          lastName,
          email,
          phone,
          password,
          role: selectedRole,
          adminSignupKey: selectedRole === "admin" ? adminSignupKey : undefined,
        },
      });
      setAuthSession(response.token, response.user);
      navigate(getRoleHomePath());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-2">
        <MapPin className="h-8 w-8 text-secondary" />
        <span className="text-3xl font-bold text-primary">YatraMitra</span>
      </Link>
      <p className="text-muted-foreground mb-8">Create your account</p>

      {/* Role Selector */}
      <div className="flex gap-4 mb-8">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 px-6 py-5 text-center transition-all duration-200 w-48 ${
              selectedRole === role.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <role.icon className={`h-8 w-8 ${selectedRole === role.id ? "text-primary" : "text-muted-foreground"}`} />
            <span className="font-semibold text-sm text-foreground">{role.label}</span>
            <span className="text-xs text-muted-foreground leading-tight">{role.description}</span>
          </button>
        ))}
      </div>

      {/* Signup Form */}
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
          Sign up as <span className="text-primary">{roleLabel}</span>
        </h2>

        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">First Name</label>
              <input
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {selectedRole === "admin" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Admin Signup Key</label>
              <input
                type="text"
                placeholder="Enter admin key"
                value={adminSignupKey}
                onChange={(e) => setAdminSignupKey(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
          )}

          <label className="flex items-start gap-2 text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded border-border accent-primary mt-0.5"
            />
            <span className="text-muted-foreground">
              I agree to the{" "}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </span>
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button
            type="button"
            className="w-full rounded-lg border border-border bg-background py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted flex items-center justify-center gap-2"
          >
            <span className="font-bold text-base">G</span>
            Continue with Google
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Login here</Link>
        </p>
      </div>

      <Link to="/" className="mt-8 text-sm text-primary hover:underline flex items-center gap-1">
        &larr; Back to Home
      </Link>
    </div>
  );
};

export default SignupPage;
