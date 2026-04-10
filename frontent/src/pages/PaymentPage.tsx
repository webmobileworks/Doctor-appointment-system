import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, Wallet, CheckCircle, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { toast } from "sonner";

const paymentMethods = [
  { id: "upi", label: "UPI", icon: Smartphone, desc: "Pay using UPI ID" },
  { id: "card", label: "Card", icon: CreditCard, desc: "Credit / Debit Card" },
  { id: "wallet", label: "Wallet", icon: Wallet, desc: "Paytm, PhonePe" },
];

const PaymentPage = () => {
  const [method, setMethod] = useState("upi");
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    toast.loading("Processing payment...");
    setTimeout(() => {
      toast.dismiss();
      setSuccess(true);
      toast.success("Payment successful!");
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-4">Your payment of ₹800 has been processed.</p>
            <p className="text-sm text-muted-foreground mb-8">Transaction ID: TXN{Date.now()}</p>
            <div className="flex gap-3 justify-center">
              <Link to="/prescriptions"><Button className="rounded-xl gradient-primary border-0 text-primary-foreground">View Prescription</Button></Link>
              <Link to="/"><Button variant="outline" className="rounded-xl">Go Home</Button></Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-6">Payment</h1>

          <div className="glass-card p-5 mb-6 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Order Summary</h3>
            <div className="flex justify-between"><span className="text-sm">Consultation Fee</span><span className="font-medium">₹800</span></div>
            <div className="flex justify-between"><span className="text-sm">Service Fee</span><span className="font-medium">₹50</span></div>
            <div className="border-t border-border pt-3 flex justify-between"><span className="font-semibold">Total</span><span className="font-bold text-lg">₹850</span></div>
          </div>

          <div className="space-y-3 mb-6">
            <h3 className="font-semibold">Payment Method</h3>
            {paymentMethods.map((pm) => (
              <button key={pm.id} onClick={() => setMethod(pm.id)}
                className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${
                  method === pm.id ? "border-2 border-primary bg-primary/5" : "border border-border hover:border-primary/30"
                }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method === pm.id ? "gradient-primary text-primary-foreground" : "bg-muted"}`}>
                  <pm.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">{pm.label}</p>
                  <p className="text-xs text-muted-foreground">{pm.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {method === "upi" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5 mb-6">
              <Input placeholder="Enter UPI ID (e.g. name@upi)" className="h-11 rounded-xl" />
            </motion.div>
          )}
          {method === "card" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5 mb-6 space-y-3">
              <Input placeholder="Card Number" className="h-11 rounded-xl" />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="MM/YY" className="h-11 rounded-xl" />
                <Input placeholder="CVV" className="h-11 rounded-xl" />
              </div>
              <Input placeholder="Cardholder Name" className="h-11 rounded-xl" />
            </motion.div>
          )}

          <Button onClick={handlePay} className="w-full h-12 rounded-xl gradient-primary border-0 text-primary-foreground">
            Pay ₹850
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" /> Secured by 256-bit encryption
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPage;
