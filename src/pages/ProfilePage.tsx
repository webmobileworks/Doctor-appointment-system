import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Phone, Mail, Calendar, Droplets, Edit2, Save, X, Shield, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    dob: "",
    bloodGroup: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    if (!stored) {
      navigate("/login");
      return;
    }
    const parsed = JSON.parse(stored);
    setUser(parsed);
    setForm({
      name: parsed.name || "",
      phone: parsed.phone || "",
      email: parsed.email || "",
      gender: parsed.gender || "",
      dob: parsed.dob || "",
      bloodGroup: parsed.bloodGroup || "",
    });
  }, [navigate]);

  const handleSave = () => {
    const updated = { ...user, ...form };
    localStorage.setItem("userInfo", JSON.stringify(updated));
    setUser(updated);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  if (!user) return null;

  const initials = form.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const stats = [
    { label: "Appointments", value: "12", icon: Calendar },
    { label: "Prescriptions", value: "8", icon: FileText },
    { label: "Consultations", value: "5", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Header */}
      <div className="gradient-primary py-10 sm:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
          >
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-primary-foreground/30 shadow-xl">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl font-bold bg-primary-foreground/20 text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-primary-foreground">{form.name || "User"}</h1>
              <p className="text-primary-foreground/70 mt-1 flex items-center justify-center sm:justify-start gap-2">
                <Phone className="w-4 h-4" /> {form.phone || "Not set"}
              </p>
              <Badge className="mt-2 bg-primary-foreground/20 text-primary-foreground border-0 hover:bg-primary-foreground/30">
                <Shield className="w-3 h-3 mr-1" /> Patient
              </Badge>
            </div>
            <div className="sm:ml-auto">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="rounded-xl border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20"
                >
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="rounded-xl bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 border-0">
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="ghost" className="rounded-xl text-primary-foreground hover:bg-primary-foreground/10">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 pb-16">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-5 text-center">
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 md:p-8"
        >
          <h2 className="text-lg font-semibold text-foreground mb-6">Personal Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Full Name" icon={User} value={form.name} editing={isEditing} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Phone" icon={Phone} value={form.phone} editing={isEditing} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="Email" icon={Mail} value={form.email} editing={isEditing} onChange={(v) => setForm({ ...form, email: v })} placeholder="Add email" />
            <Field label="Gender" icon={User} value={form.gender} editing={isEditing} onChange={(v) => setForm({ ...form, gender: v })} placeholder="Add gender" />
            <Field label="Date of Birth" icon={Calendar} value={form.dob} editing={isEditing} onChange={(v) => setForm({ ...form, dob: v })} placeholder="Add DOB" />
            <Field label="Blood Group" icon={Droplets} value={form.bloodGroup} editing={isEditing} onChange={(v) => setForm({ ...form, bloodGroup: v })} placeholder="Add blood group" />
          </div>

          <Separator className="my-8" />

          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button variant="outline" className="rounded-xl h-12 justify-start gap-3" onClick={() => navigate("/doctors")}>
              <Calendar className="w-4 h-4 text-primary" /> Book Appointment
            </Button>
            <Button variant="outline" className="rounded-xl h-12 justify-start gap-3" onClick={() => navigate("/prescriptions")}>
              <FileText className="w-4 h-4 text-primary" /> My Prescriptions
            </Button>
            <Button variant="outline" className="rounded-xl h-12 justify-start gap-3" onClick={() => navigate("/consultation")}>
              <Clock className="w-4 h-4 text-primary" /> Consultations
            </Button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

const Field = ({ label, icon: Icon, value, editing, onChange, placeholder = "" }: any) => (
  <div>
    <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1.5">
      <Icon className="w-3.5 h-3.5" /> {label}
    </label>
    {editing ? (
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="rounded-xl h-11" />
    ) : (
      <p className="text-foreground font-medium h-11 flex items-center">{value || <span className="text-muted-foreground/50 italic">{placeholder || "Not set"}</span>}</p>
    )}
  </div>
);

export default ProfilePage;
