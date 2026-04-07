import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Calendar, Users, MessageSquare, FileText, Settings, User, Bell, ChevronLeft, ChevronRight,
  Clock, CheckCircle, XCircle, TrendingUp, Video, Upload, Save, Plus, Send, Paperclip
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { appointments } from "@/data/mockData";
import { toast } from "sonner";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: User, label: "Profile", id: "profile" },
  { icon: Calendar, label: "Availability", id: "availability" },
  { icon: Users, label: "Appointments", id: "appointments" },
  { icon: MessageSquare, label: "Consultation", id: "consultation" },
  { icon: FileText, label: "Prescriptions", id: "prescriptions" },
  { icon: Settings, label: "Settings", id: "settings" },
];

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-16" : "w-64"} bg-card border-r border-border/50 flex flex-col transition-all duration-300 shrink-0`}>
        <div className={`h-16 flex items-center ${collapsed ? "justify-center" : "px-5"} border-b border-border/50`}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">M+</span>
              </div>
              <span className="font-bold text-sm">MediBook</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className={`${collapsed ? "" : "ml-auto"} p-1.5 rounded-lg hover:bg-muted transition-colors`}>
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                activeTab === item.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className={`p-3 border-t border-border/50 ${collapsed ? "flex justify-center" : ""}`}>
          <Link to="/">
            <Button variant="ghost" size={collapsed ? "icon" : "sm"} className="rounded-xl w-full text-muted-foreground">
              {collapsed ? <ChevronLeft className="w-4 h-4" /> : "← Back to Site"}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-card/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-6 shrink-0">
          <h2 className="font-semibold capitalize">{activeTab}</h2>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-xl relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">SJ</div>
              {!collapsed && <span className="text-sm font-medium hidden sm:inline">Dr. Sarah</span>}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "profile" && <ProfileView />}
          {activeTab === "availability" && <AvailabilityView />}
          {activeTab === "appointments" && <AppointmentsView />}
          {activeTab === "consultation" && <DoctorConsultationView />}
          {activeTab === "prescriptions" && <PrescriptionUploadView />}
          {activeTab === "settings" && <SettingsView />}
        </div>
      </main>
    </div>
  );
};

const DashboardView = () => {
  const stats = [
    { icon: Users, label: "Today's Patients", value: "12", trend: "+3", color: "text-primary" },
    { icon: Calendar, label: "Appointments", value: "8", trend: "+2", color: "text-secondary" },
    { icon: CheckCircle, label: "Completed", value: "5", trend: "", color: "text-success" },
    { icon: TrendingUp, label: "Revenue", value: "₹9,600", trend: "+15%", color: "text-warning" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              {s.trend && <span className="text-xs text-success font-medium">{s.trend}</span>}
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h3 className="font-semibold mb-4">Today's Appointments</h3>
        <div className="space-y-3">
          {appointments.slice(0, 3).map((apt) => (
            <div key={apt.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{apt.patientName[0]}</div>
                <div>
                  <p className="font-medium text-sm">{apt.patientName}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{apt.time} • {apt.type}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                apt.status === "confirmed" ? "bg-success/10 text-success" : apt.status === "pending" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
              }`}>{apt.status}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ProfileView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
    <div className="glass-card p-6 space-y-5">
      <h3 className="font-semibold">Profile Information</h3>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl">SJ</div>
        <Button variant="outline" size="sm" className="rounded-xl">Change Photo</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-xs text-muted-foreground">Full Name</label><Input defaultValue="Dr. Sarah Johnson" className="mt-1 rounded-xl" /></div>
        <div><label className="text-xs text-muted-foreground">Specialty</label><Input defaultValue="Cardiology" className="mt-1 rounded-xl" /></div>
        <div><label className="text-xs text-muted-foreground">Experience</label><Input defaultValue="15 years" className="mt-1 rounded-xl" /></div>
        <div><label className="text-xs text-muted-foreground">Fees (₹)</label><Input defaultValue="800" className="mt-1 rounded-xl" /></div>
        <div className="sm:col-span-2"><label className="text-xs text-muted-foreground">Qualification</label><Input defaultValue="MBBS, MD (Cardiology), DM" className="mt-1 rounded-xl" /></div>
        <div className="sm:col-span-2"><label className="text-xs text-muted-foreground">About</label><Textarea defaultValue="Experienced cardiologist..." className="mt-1 rounded-xl" /></div>
      </div>
      <Button className="rounded-xl gradient-primary border-0 text-primary-foreground gap-2"><Save className="w-4 h-4" /> Save Changes</Button>
    </div>
  </motion.div>
);

const AvailabilityView = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const slots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
  const [selected, setSelected] = useState<string[]>(["Mon-09:00", "Mon-10:00", "Tue-09:30", "Wed-14:00"]);

  const toggle = (key: string) => setSelected((prev) => prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold">Manage Availability</h3>
          <Button size="sm" className="rounded-xl gradient-primary border-0 text-primary-foreground gap-1" onClick={() => toast.success("Availability saved!")}>
            <Save className="w-3.5 h-3.5" /> Save
          </Button>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-7 gap-2 mb-2">
              <div className="text-xs text-muted-foreground font-medium p-2">Time</div>
              {days.map((d) => <div key={d} className="text-xs text-muted-foreground font-medium p-2 text-center">{d}</div>)}
            </div>
            {slots.map((slot) => (
              <div key={slot} className="grid grid-cols-7 gap-2 mb-1">
                <div className="text-xs text-muted-foreground p-2 flex items-center">{slot}</div>
                {days.map((day) => {
                  const key = `${day}-${slot}`;
                  const isSelected = selected.includes(key);
                  return (
                    <button key={key} onClick={() => toggle(key)}
                      className={`p-2 rounded-lg text-xs transition-all ${isSelected ? "gradient-primary text-primary-foreground" : "bg-muted/30 hover:bg-muted"}`}>
                      {isSelected ? "✓" : ""}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AppointmentsView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
    <div className="glass-card p-6">
      <h3 className="font-semibold mb-4">Appointment Requests</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="pb-3 font-medium">Patient</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Time</th>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id} className="border-b border-border/30 last:border-0">
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{apt.patientName[0]}</div>
                    <span className="text-sm font-medium">{apt.patientName}</span>
                  </div>
                </td>
                <td className="py-3 text-sm text-muted-foreground">{apt.date}</td>
                <td className="py-3 text-sm">{apt.time}</td>
                <td className="py-3"><span className={`px-2 py-0.5 rounded text-xs ${apt.type === "Video" ? "bg-info/10 text-info" : "bg-muted text-muted-foreground"}`}>{apt.type}</span></td>
                <td className="py-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                    apt.status === "confirmed" ? "bg-success/10 text-success" : apt.status === "pending" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
                  }`}>{apt.status}</span>
                </td>
                <td className="py-3">
                  {apt.status === "pending" && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="rounded-lg h-7 px-2 text-success hover:text-success hover:bg-success/10" onClick={() => toast.success("Accepted")}>
                        <CheckCircle className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="rounded-lg h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => toast.error("Rejected")}>
                        <XCircle className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
);

const DoctorConsultationView = () => {
  const [messages, setMessages] = useState([
    { id: "1", text: "Doctor, I have been having chest pain.", sender: "patient" as const, time: "2:00 PM" },
    { id: "2", text: "I understand. Can you describe the pain? Is it sharp or dull?", sender: "doctor" as const, time: "2:02 PM" },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), text: input, sender: "doctor", time: new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }) }]);
    setInput("");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="glass-card p-4 flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">AM</div>
          <div><h3 className="font-semibold text-sm">Ankit Mehta</h3><p className="text-xs text-success">Online</p></div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-xl"><Video className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 px-2 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "doctor" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] p-3.5 rounded-2xl ${
              msg.sender === "doctor" ? "gradient-primary text-primary-foreground rounded-br-md" : "bg-card border border-border rounded-bl-md"
            }`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sender === "doctor" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-3 flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-xl"><Paperclip className="w-4 h-4" /></Button>
        <Input placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} className="rounded-xl border-0 bg-muted/50" />
        <Button size="icon" onClick={send} className="rounded-xl gradient-primary border-0 text-primary-foreground"><Send className="w-4 h-4" /></Button>
      </div>
    </motion.div>
  );
};

const PrescriptionUploadView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
    <div className="glass-card p-6 space-y-5">
      <h3 className="font-semibold">Upload Prescription</h3>
      <div>
        <label className="text-xs text-muted-foreground">Patient Name</label>
        <Input placeholder="Enter patient name" className="mt-1 rounded-xl" />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Diagnosis</label>
        <Input placeholder="Enter diagnosis" className="mt-1 rounded-xl" />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Notes</label>
        <Textarea placeholder="Prescription notes and medicines..." className="mt-1 rounded-xl min-h-[120px]" />
      </div>
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Drag & drop files or <button className="text-primary font-medium">browse</button></p>
        <p className="text-xs text-muted-foreground mt-1">PDF, JPG up to 10MB</p>
      </div>
      <Button className="rounded-xl gradient-primary border-0 text-primary-foreground gap-2" onClick={() => toast.success("Prescription uploaded!")}>
        <Plus className="w-4 h-4" /> Upload Prescription
      </Button>
    </div>
  </motion.div>
);

const SettingsView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
    <div className="glass-card p-6 space-y-5">
      <h3 className="font-semibold">Settings</h3>
      <div><label className="text-xs text-muted-foreground">Notification Email</label><Input defaultValue="dr.sarah@medibook.com" className="mt-1 rounded-xl" /></div>
      <div><label className="text-xs text-muted-foreground">Phone</label><Input defaultValue="+91 98765 43210" className="mt-1 rounded-xl" /></div>
      <Button className="rounded-xl gradient-primary border-0 text-primary-foreground gap-2"><Save className="w-4 h-4" /> Save Settings</Button>
    </div>
  </motion.div>
);

export default DoctorDashboard;
