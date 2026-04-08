import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight, User, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignup && !name)) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      const fromState = location.state as any;

      if (isSignup) {
        const res = await api.post('/auth/register', { name, email, password, role: 'patient' });
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        toast.success("Account created successfully!");
        
        if (fromState?.from) {
          navigate(fromState.from, { state: fromState });
        } else {
          navigate('/doctors');
        }
      } else {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        toast.success("Login successful!");
        
        if (fromState?.from) {
          navigate(fromState.from, { state: fromState });
        } else if (res.data.role === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/doctors');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left visual */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-8">
            <span className="text-3xl font-bold text-primary-foreground">M+</span>
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">Welcome to MediBook</h2>
          <p className="text-primary-foreground/80 text-lg">Your healthcare journey starts here. Book appointments, consult online, and manage your health.</p>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M+</span>
              </div>
              <span className="text-lg font-bold">MediBook</span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">{isSignup ? "Create Account" : "Welcome Back"}</h1>
            <p className="text-muted-foreground mt-1">{isSignup ? "Sign up to get started" : "Sign in to your account"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="pl-11 h-12 rounded-xl" />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 h-12 rounded-xl"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 pr-11 h-12 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl gradient-primary border-0 text-primary-foreground mt-4">
              {isSignup ? "Sign Up" : "Sign In"} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-8">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button type="button" className="text-primary font-medium hover:underline" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
