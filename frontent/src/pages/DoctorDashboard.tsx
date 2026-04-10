import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  LayoutDashboard, Calendar, Users, MessageSquare, FileText, Settings, User, Bell, ChevronLeft, ChevronRight,
  Clock, CheckCircle, XCircle, TrendingUp, Video, Upload, Save, Plus, Send, Paperclip
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { io, Socket } from "socket.io-client";

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
  
  // Prescription Form States
  const [selectedApt, setSelectedApt] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const navigate = useNavigate();

  // Redirect if not doctor
  useEffect(() => {
    const info = localStorage.getItem("userInfo");
    if (!info) {
      navigate("/login");
    } else {
      const parsed = JSON.parse(info);
      if (parsed.role !== "doctor") {
        navigate("/");
      }
    }
  }, [navigate]);

  // Fetch the latest profile data natively from backend
  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['me-doctor'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data;
    }
  });

  // Fetch all appointments for this doctor
  const { data: appointments = [], refetch: refetchAppointments } = useQuery({
    queryKey: ['doctor-appointments'],
    queryFn: async () => {
      const res = await api.get('/appointments');
      return res.data;
    }
  });

  // Fetch specialties for the dropdown
  const { data: specialties = [] } = useQuery({
    queryKey: ['api-specialties'],
    queryFn: async () => {
      const res = await api.get('/doctors/specialties');
      return res.data;
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => await api.put('/auth/me', data),
    onSuccess: () => {
      toast.success("Profile saved!");
      refetchProfile();
    },
    onError: () => toast.error("Failed to save profile")
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => await api.put(`/appointments/${id}/status`, { status }),
    onSuccess: () => {
      toast.success("Status updated");
      refetchAppointments();
    },
    onError: () => toast.error("Failed to update status")
  });

  const uploadPrescriptionMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string, formData: FormData }) => {
      return await api.put(`/appointments/${id}/prescription`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      toast.success("Prescription uploaded!");
      setSelectedApt("");
      setNotes("");
      setFile(null);
      refetchAppointments();
    },
    onError: () => toast.error("Upload failed")
  });

  // Safe checks
  if (!profile) return <div className="min-h-screen bg-background flex items-center justify-center p-12 text-muted-foreground">Loading dashboard...</div>;

  const initials = profile.name ? profile.name.split(" ").map((n: string) => n[0]).join("") : "DR";

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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${activeTab === item.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
        <header className="h-16 bg-card/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-6 shrink-0">
          <h2 className="font-semibold capitalize">{activeTab}</h2>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-xl relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">{initials.slice(0, 2)}</div>
              {!collapsed && <span className="text-sm font-medium hidden sm:inline">{profile.name}</span>}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "dashboard" && <DashboardView appointments={appointments} />}
          {activeTab === "profile" && <ProfileView profile={profile} updateMutation={updateProfileMutation} specialties={specialties} />}
          {activeTab === "availability" && <AvailabilityView profile={profile} updateMutation={updateProfileMutation} />}
          {activeTab === "appointments" && <AppointmentsView appointments={appointments} statusMutation={updateStatusMutation} />}
          {activeTab === "consultation" && <DoctorConsultationView profile={profile} />}
          {activeTab === 'prescriptions' && (
                  <PrescriptionUploadView 
                    appointments={appointments} 
                    uploadMutation={uploadPrescriptionMutation} 
                    selectedApt={selectedApt}
                    setSelectedApt={setSelectedApt}
                    notes={notes}
                    setNotes={setNotes}
                    file={file}
                    setFile={setFile}
                  />
                )}
          {activeTab === "settings" && <SettingsView />}
        </div>
      </main>
    </div>
  );
};

const DashboardView = ({ appointments }: any) => {
  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }); // Note: adjust formatting based on how date is saved
  const todayAppointments = appointments.filter((a: any) => new Date(a.createdAt).toDateString() === new Date().toDateString());
  const completed = appointments.filter((a: any) => a.status === 'completed');
  const revenue = completed.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

  const stats = [
    { icon: Users, label: "Today's Patients", value: todayAppointments.length.toString(), trend: "", color: "text-primary" },
    { icon: Calendar, label: "Total Bookings", value: appointments.length.toString(), trend: "", color: "text-secondary" },
    { icon: CheckCircle, label: "Completed", value: completed.length.toString(), trend: "", color: "text-success" },
    { icon: TrendingUp, label: "Revenue", value: `₹${revenue.toLocaleString()}`, trend: "", color: "text-warning" },
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
        <h3 className="font-semibold mb-4">Upcoming Appointments</h3>
        <div className="space-y-3">
          {appointments.slice(0, 5).map((apt: any) => (
            <div key={apt._id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{(apt.patient?.name || "U")[0]}</div>
                <div>
                  <p className="font-medium text-sm">{apt.patient?.name || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{apt.date} • {apt.time}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium uppercase ${apt.status === "confirmed" ? "bg-primary/10 text-primary" :
                apt.status === "pending" ? "bg-warning/10 text-warning" :
                  apt.status === "completed" ? "bg-success/10 text-success" :
                    "bg-muted text-muted-foreground"
                }`}>{apt.status}</span>
            </div>
          ))}
          {appointments.length === 0 && <p className="text-sm text-muted-foreground">No appointments booked yet.</p>}
        </div>
      </div>
    </motion.div>
  );
};

const ProfileView = ({ profile, updateMutation, specialties }: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(profile?.doctorDetails?.image ? `http://localhost:5050${profile.doctorDetails.image}` : null);

  const [form, setForm] = useState({
    name: profile?.name || "",
    specialty: profile?.doctorDetails?.specialty || "",
    experience: profile?.doctorDetails?.experience || "",
    fees: profile?.doctorDetails?.fees || "",
    qualification: profile?.doctorDetails?.qualification || "",
    about: profile?.doctorDetails?.about || ""
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = () => {
    const docDetailsObj = {
      specialty: form.specialty,
      experience: Number(form.experience),
      fees: Number(form.fees),
      qualification: form.qualification,
      about: form.about
    };

    if (file) {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('doctorDetails', JSON.stringify(docDetailsObj));
      formData.append('image', file);
      updateMutation.mutate(formData);
    } else {
      updateMutation.mutate({
        name: form.name,
        doctorDetails: docDetailsObj
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      <div className="glass-card p-6 space-y-5">
        <h3 className="font-semibold">Profile Information</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-xl overflow-hidden relative">
            {preview ? (
              <img src={preview.startsWith('blob:') ? preview : `http://localhost:5050${profile.doctorDetails.image}`} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full gradient-primary flex items-center justify-center text-primary-foreground">
                {profile.name[0]}
              </div>
            )}
          </div>
          <div className="relative">
            <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
            <Button variant="outline" size="sm" className="rounded-xl pointer-events-none">Change Photo</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="text-xs text-muted-foreground">Full Name</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 rounded-xl" /></div>
          <div>
            <label className="text-xs text-muted-foreground">Specialty</label>
            <Select 
              value={form.specialty} 
              onValueChange={(value) => setForm({ ...form, specialty: value })}
            >
              <SelectTrigger className="mt-1 rounded-xl h-11">
                <SelectValue placeholder="Select Specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((spec: any) => (
                  <SelectItem key={spec._id || spec.name} value={spec.name}>
                    {spec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div><label className="text-xs text-muted-foreground">Experience (Years)</label><Input type="number" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className="mt-1 rounded-xl" /></div>
          <div><label className="text-xs text-muted-foreground">Fees (₹)</label><Input type="number" value={form.fees} onChange={e => setForm({ ...form, fees: e.target.value })} className="mt-1 rounded-xl" /></div>
          <div className="sm:col-span-2"><label className="text-xs text-muted-foreground">Qualification</label><Input value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} className="mt-1 rounded-xl" /></div>
          <div className="sm:col-span-2"><label className="text-xs text-muted-foreground">About</label><Textarea value={form.about} onChange={e => setForm({ ...form, about: e.target.value })} className="mt-1 rounded-xl" /></div>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending} className="rounded-xl gradient-primary border-0 text-primary-foreground gap-2">
          <Save className="w-4 h-4" /> {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </motion.div>
  );
};

const AvailabilityView = ({ profile, updateMutation }: any) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const slots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
  const initialSlots = profile?.doctorDetails?.availableSlots || ["Mon-09:00", "Mon-10:00", "Tue-09:30", "Wed-14:00"];
  const [selected, setSelected] = useState<string[]>(initialSlots);

  const toggle = (key: string) => setSelected((prev) => prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]);

  const handleSave = () => {
    updateMutation.mutate({
      doctorDetails: {
        availableSlots: selected
      }
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold">Manage Availability</h3>
          <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending} className="rounded-xl gradient-primary border-0 text-primary-foreground gap-1">
            <Save className="w-3.5 h-3.5" /> {updateMutation.isPending ? "Saving..." : "Save"}
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

const AppointmentsView = ({ appointments, statusMutation }: any) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
    <div className="glass-card p-6">
      <h3 className="font-semibold mb-4">Patient Requests</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="pb-3 font-medium">Patient</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Time</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-muted-foreground text-sm">No booked appointments.</td></tr>
            )}
            {appointments.map((apt: any) => (
              <tr key={apt._id} className="border-b border-border/30 last:border-0 hover:bg-muted/10 transition-colors">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{(apt.patient?.name || "U")[0]}</div>
                    <span className="text-sm font-medium">{apt.patient?.name || "Unknown"}</span>
                  </div>
                </td>
                <td className="py-3 text-sm text-muted-foreground">{apt.date}</td>
                <td className="py-3 text-sm">{apt.time}</td>
                <td className="py-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider ${apt.status === "confirmed" ? "bg-primary/10 text-primary" :
                    apt.status === "pending" ? "bg-warning/10 text-warning" :
                      apt.status === "completed" ? "bg-success/10 text-success" :
                        "bg-muted text-muted-foreground"
                    }`}>{apt.status}</span>
                </td>
                <td className="py-3">
                  <div className="flex gap-2 justify-end">
                    {apt.status === "pending" && (
                      <>
                        <Button disabled={statusMutation.isPending} size="sm" variant="ghost" className="rounded-lg h-8 px-2 text-primary hover:text-primary hover:bg-primary/10" onClick={() => statusMutation.mutate({ id: apt._id, status: 'confirmed' })}>
                          <CheckCircle className="w-4 h-4 mr-1" /> Accept
                        </Button>
                        <Button disabled={statusMutation.isPending} size="sm" variant="ghost" className="rounded-lg h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => statusMutation.mutate({ id: apt._id, status: 'rejected' })}>
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {apt.status === "confirmed" && (
                      <Button disabled={statusMutation.isPending} size="sm" variant="ghost" className="rounded-lg h-8 px-3 bg-success/10 text-success hover:text-success hover:bg-success/20" onClick={() => statusMutation.mutate({ id: apt._id, status: 'completed' })}>
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
);

const PrescriptionUploadView = ({ appointments, uploadMutation, selectedApt, setSelectedApt, notes, setNotes, file, setFile }: any) => {
  // Show only confirmed and completed
  const eligible = appointments.filter((a: any) => a.status === 'confirmed' || a.status === 'completed');

  const handleUpload = () => {
    const formData = new FormData();
    if (file) formData.append('prescription', file);
    if (notes) formData.append('diagnosis', notes);

    uploadMutation.mutate({ id: selectedApt, formData });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      <div className="glass-card p-6 space-y-5">
        <h3 className="font-semibold">Upload Prescription</h3>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Select Patient Session</label>
          <select
            className="w-full h-11 px-3 rounded-xl border border-input bg-background"
            value={selectedApt}
            onChange={(e) => setSelectedApt(e.target.value)}
          >
            <option value="">Select an appointment...</option>
            {eligible.map((apt: any) => (
              <option key={apt._id} value={apt._id}>
                {apt.patient?.name} - {apt.date}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground block mb-1">Diagnosis Notes (Optional)</label>
          <Textarea
            value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Summary of diagnosis..." className="rounded-xl min-h-[100px]"
          />
        </div>

        <div className="border-2 border-dashed border-primary/40 bg-primary/5 rounded-xl p-8 text-center relative overflow-hidden transition-colors hover:border-primary">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <Upload className={`w-8 h-8 mx-auto mb-3 ${file ? 'text-primary' : 'text-muted-foreground'}`} />
          {file ? (
            <p className="text-sm font-medium text-primary">Selected: {file.name}</p>
          ) : (
            <>
              <p className="text-sm text-foreground">Click to browse or drag file here</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, JPG up to 10MB</p>
            </>
          )}
        </div>

        <Button
          onClick={handleUpload}
          disabled={uploadMutation.isPending || !file || !selectedApt}
          className="rounded-xl gradient-primary border-0 text-primary-foreground gap-2 w-full md:w-auto"
        >
          <Plus className="w-4 h-4" /> {uploadMutation.isPending ? "Uploading..." : "Upload Prescription"}
        </Button>
      </div>
    </motion.div>
  );
};

const DoctorConsultationView = ({ profile }: any) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChatRef = useRef<any>(null);
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/messages/conversations');
        setConversations(res.data);
        if (res.data.length > 0) {
          setActiveChat(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching conversations", err);
      }
    };
    fetchConversations();
  }, []);

  // Socket and Message fetching
  useEffect(() => {
    if (!profile?._id) return;

    const newSocket = io("http://localhost:5050");
    setSocket(newSocket);

    // Join personal room for messages once connected
    newSocket.on("connect", () => {
      newSocket.emit("join_consultation", profile._id.toString());
    });

    newSocket.on("receive_message", (data: any) => {
      // Update Side panel optimistically
      setConversations((prevConvs) => prevConvs.map(c => {
        if (c._id === data.senderId || c._id === data.receiverId) {
          return { ...c, lastMessage: data.text };
        }
        return c;
      }));

      const currentActiveChat = activeChatRef.current;
      if (!currentActiveChat) return;

      const user1 = profile._id.toString();
      const user2 = currentActiveChat._id.toString();
      const activeConsultationId = [user1, user2].sort().join('_');

      if (data.consultationId === activeConsultationId) {
        setMessages((prev) => {
          if (prev.find(m => m._id === data.id || m.id === data.id)) return prev;
          return [...prev, { ...data, sender: data.senderId, id: data.id }];
        });
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [profile?._id]);

  useEffect(() => {
    if (!activeChat || !profile || !socket) return;
    
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${activeChat._id}`);
        setMessages(res.data.messages);
      } catch (err) {
        console.error("Fetch msg error", err);
      }
    };
    fetchMessages();
  }, [activeChat, profile, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim() || !socket || !activeChat || !profile) return;
    
    const user1 = profile._id.toString();
    const user2 = activeChat._id.toString();
    const consultationId = [user1, user2].sort().join('_');

    const newMsg = {
      consultationId,
      senderId: profile._id,
      receiverId: activeChat._id,
      text: input,
      senderRole: "doctor"
    };

    setInput("");
    socket.emit("send_message", newMsg);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-[calc(100vh-8rem)] glass-card overflow-hidden">
      
      {/* Sidebar: Chat List */}
      <div className="w-80 border-r border-border/50 flex flex-col bg-card/50 shrink-0">
        <div className="p-4 border-b border-border/50 bg-muted/20">
          <h3 className="font-semibold px-1">Chats</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
             <p className="p-4 text-xs text-muted-foreground text-center">No active chats.</p>
          )}
          {conversations.map(c => (
             <div key={c._id} onClick={() => setActiveChat(c)} className={`p-4 flex gap-3 cursor-pointer transition-colors border-b border-border/50 ${activeChat?._id === c._id ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-muted/50 border-l-4 border-l-transparent'}`}>
               <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                  {c.name[0]}
               </div>
               <div className="flex-1 min-w-0 flex flex-col justify-center">
                 <h4 className="font-semibold text-sm truncate">{c.name}</h4>
                 <p className="text-xs text-muted-foreground truncate mt-0.5">{c.lastMessage || "Start chatting..."}</p>
               </div>
             </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative">
        {activeChat ? (
          <>
            <div className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-card/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{activeChat.name[0]}</div>
                <div>
                  <h3 className="font-semibold text-sm">{activeChat.name}</h3>
                  <p className="text-xs text-success flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success"></span> Online</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary"><Video className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">
              {messages.map((msg: any) => {
                const isMe = msg.sender === profile._id || msg.senderId === profile._id;
                return (
                  <div key={msg._id || msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] p-3.5 rounded-2xl ${isMe ? "gradient-primary text-primary-foreground rounded-br-sm shadow-sm" : "bg-card border border-border rounded-bl-sm shadow-sm"
                      }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={`text-[10px] mt-1.5 text-right ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {msg.time || new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-card border-t border-border/50 flex items-center gap-3 shrink-0">
              <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-foreground"><Paperclip className="w-5 h-5" /></Button>
              <Input placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} className="rounded-xl border-0 bg-muted h-11" />
              <Button size="icon" onClick={send} className="rounded-xl gradient-primary border-0 text-primary-foreground h-11 w-11 hover:opacity-90 shadow-sm"><Send className="w-4 h-4" /></Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
             <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
               <MessageSquare className="w-8 h-8 text-primary" />
             </div>
             <p className="font-semibold text-foreground">Your Messages</p>
             <p className="text-sm mt-1">Select a chat from the sidebar to start consulting.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const SettingsView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
    <div className="glass-card p-6 space-y-5 mt-2">
      <h3 className="font-semibold">Settings</h3>
      <div><label className="text-xs text-muted-foreground">Notification Email</label><Input defaultValue="dr.sarah@medibook.com" className="mt-1 rounded-xl" /></div>
      <div><label className="text-xs text-muted-foreground">Phone</label><Input defaultValue="+91 98765 43210" className="mt-1 rounded-xl" /></div>
      <Button className="rounded-xl gradient-primary border-0 text-primary-foreground gap-2"><Save className="w-4 h-4" /> Save Settings</Button>
    </div>
  </motion.div>
);

export default DoctorDashboard;
