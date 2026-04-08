import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Lock, ArrowRight, User, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (phone.length >= 10) {
      try {
        await api.post('/auth/send-otp', { phone });
        setShowOtp(true);
        toast.success("OTP sent! (Use 123456)");
      } catch (error) {
        toast.error("Failed to send OTP");
      }
    } else {
      toast.error("Enter a valid mobile number");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const otpString = otp.join('');
      const res = await api.post('/auth/verify-otp', { 
        phone, 
        otp: otpString,
        role: 'patient',
        name
      });
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      toast.success("Login successful!");
      navigate('/doctors');
    } catch (error) {
      toast.error("Invalid OTP or server error");
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

          {!showOtp ? (
            <div className="space-y-4">
              {isSignup && (
                <>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="pl-11 h-12 rounded-xl" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="Email Address" className="pl-11 h-12 rounded-xl" />
                  </div>
                </>
              )}

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-11 h-12 rounded-xl"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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

              <Button onClick={handleSendOtp} className="w-full h-12 rounded-xl gradient-primary border-0 text-primary-foreground">
                {isSignup ? "Sign Up" : "Sign In"} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">or continue with OTP</span></div>
              </div>

              <Button variant="outline" onClick={handleSendOtp} className="w-full h-12 rounded-xl gap-2">
                <Phone className="w-4 h-4" /> Send OTP
              </Button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <p className="text-sm text-muted-foreground">We've sent a 6-digit OTP to <span className="font-medium text-foreground">+91 {phone}</span></p>

              <div className="flex gap-3 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                ))}
              </div>

              <Button onClick={handleVerifyOtp} className="w-full h-12 rounded-xl gradient-primary border-0 text-primary-foreground">
                Verify OTP
              </Button>

              <div className="text-center">
                <button className="text-sm text-primary font-medium hover:underline" onClick={() => toast.info("OTP resent!")}>Resend OTP</button>
                <span className="mx-2 text-muted-foreground">•</span>
                <button className="text-sm text-muted-foreground hover:text-foreground" onClick={() => setShowOtp(false)}>Change Number</button>
              </div>
            </motion.div>
          )}

          <p className="text-sm text-center text-muted-foreground mt-8">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button className="text-primary font-medium hover:underline" onClick={() => { setIsSignup(!isSignup); setShowOtp(false); }}>
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
