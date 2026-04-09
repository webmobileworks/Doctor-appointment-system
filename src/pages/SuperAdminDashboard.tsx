import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Stethoscope, Tag, Settings, LogOut,
  TrendingUp, TrendingDown, Calendar, DollarSign, UserPlus, Activity,
  Search, MoreVertical, Edit, Trash2, Eye, ChevronDown, Plus, X,
  Shield, Bell, Menu, BarChart3, PieChart as PieIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import Navbar from "@/components/layout/Navbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

// Mock data
const monthlyData = [
  { month: "Jan", users: 120, doctors: 15, appointments: 340, revenue: 45000 },
  { month: "Feb", users: 180, doctors: 22, appointments: 520, revenue: 62000 },
  { month: "Mar", users: 250, doctors: 28, appointments: 680, revenue: 78000 },
  { month: "Apr", users: 310, doctors: 35, appointments: 890, revenue: 95000 },
  { month: "May", users: 420, doctors: 42, appointments: 1100, revenue: 120000 },
  { month: "Jun", users: 530, doctors: 50, appointments: 1350, revenue: 148000 },
];

const specialtyDistribution = [
  { name: "Cardiology", value: 25, color: "hsl(210, 80%, 50%)" },
  { name: "Dermatology", value: 18, color: "hsl(160, 45%, 48%)" },
  { name: "Pediatrics", value: 15, color: "hsl(280, 60%, 55%)" },
  { name: "Orthopedics", value: 12, color: "hsl(30, 80%, 55%)" },
  { name: "Neurology", value: 10, color: "hsl(350, 65%, 55%)" },
  { name: "Others", value: 20, color: "hsl(210, 20%, 70%)" },
];

const appointmentStatus = [
  { name: "Completed", value: 65, color: "hsl(160, 45%, 48%)" },
  { name: "Upcoming", value: 20, color: "hsl(210, 80%, 50%)" },
  { name: "Cancelled", value: 10, color: "hsl(0, 72%, 55%)" },
  { name: "No Show", value: 5, color: "hsl(30, 80%, 55%)" },
];

const weeklyAppointments = [
  { day: "Mon", count: 45 }, { day: "Tue", count: 52 },
  { day: "Wed", count: 38 }, { day: "Thu", count: 65 },
  { day: "Fri", count: 58 }, { day: "Sat", count: 72 },
  { day: "Sun", count: 25 },
];

const mockUsers = [
  { id: 1, name: "Rahul Sharma", email: "rahul@email.com", phone: "+91 98765 43210", joinDate: "2024-01-15", status: "active", appointments: 12 },
  { id: 2, name: "Priya Patel", email: "priya@email.com", phone: "+91 87654 32109", joinDate: "2024-02-20", status: "active", appointments: 8 },
  { id: 3, name: "Amit Kumar", email: "amit@email.com", phone: "+91 76543 21098", joinDate: "2024-03-10", status: "inactive", appointments: 3 },
  { id: 4, name: "Sneha Gupta", email: "sneha@email.com", phone: "+91 65432 10987", joinDate: "2024-04-05", status: "active", appointments: 15 },
  { id: 5, name: "Vikram Singh", email: "vikram@email.com", phone: "+91 54321 09876", joinDate: "2024-05-12", status: "active", appointments: 6 },
];

const mockDoctors = [
  { id: 1, name: "Dr. Arun Mehta", specialty: "Cardiology", experience: 15, rating: 4.8, fees: 800, status: "verified", patients: 320, location: "Mumbai" },
  { id: 2, name: "Dr. Kavita Reddy", specialty: "Dermatology", experience: 10, rating: 4.6, fees: 600, status: "verified", patients: 250, location: "Delhi" },
  { id: 3, name: "Dr. Sanjay Joshi", specialty: "Pediatrics", experience: 12, rating: 4.9, fees: 700, status: "pending", patients: 180, location: "Bangalore" },
  { id: 4, name: "Dr. Neha Kapoor", specialty: "Orthopedics", experience: 8, rating: 4.5, fees: 900, status: "verified", patients: 150, location: "Chennai" },
  { id: 5, name: "Dr. Rajesh Verma", specialty: "Neurology", experience: 20, rating: 4.7, fees: 1200, status: "suspended", patients: 400, location: "Hyderabad" },
];

const defaultSpecialties = [
  { id: 1, name: "Cardiology", icon: "❤️", doctorCount: 25, description: "Heart and cardiovascular system" },
  { id: 2, name: "Dermatology", icon: "🧴", doctorCount: 18, description: "Skin, hair, and nails" },
  { id: 3, name: "Pediatrics", icon: "👶", doctorCount: 15, description: "Children's health" },
  { id: 4, name: "Orthopedics", icon: "🦴", doctorCount: 12, description: "Bones, joints, and muscles" },
  { id: 5, name: "Neurology", icon: "🧠", doctorCount: 10, description: "Brain and nervous system" },
  { id: 6, name: "Dentistry", icon: "🦷", doctorCount: 20, description: "Teeth and oral health" },
  { id: 7, name: "Ophthalmology", icon: "👁️", doctorCount: 8, description: "Eyes and vision" },
  { id: 8, name: "ENT", icon: "👂", doctorCount: 9, description: "Ear, nose, and throat" },
];

const AVAILABLE_ICONS = [
  { label: "Heart", icon: "❤️" },
  { label: "Brain", icon: "🧠" },
  { label: "Bone", icon: "🦴" },
  { label: "Tooth", icon: "🦷" },
  { label: "Eye", icon: "👁️" },
  { label: "Stethoscope", icon: "🩺" },
  { label: "Medicine", icon: "💊" },
  { label: "Syringe", icon: "💉" },
  { label: "Biohazard", icon: "☣️" },
  { label: "Microscope", icon: "🔬" },
  { label: "Thermometer", icon: "🌡️" },
  { label: "Lungs", icon: "🫁" },
  { label: "Skin", icon: "🧴" },
  { label: "Baby", icon: "👶" },
  { label: "Ear", icon: "👂" },
  { label: "Kidney", icon: "🩹" },
];

const sidebarItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "users", label: "Users", icon: Users },
  { key: "doctors", label: "Doctors", icon: Stethoscope },
  { key: "specialties", label: "Specialties", icon: Tag },
  { key: "settings", label: "Settings", icon: Settings },
];

const StatCard = ({ title, value, change, changeType, icon: Icon, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all"
  >
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
        <p className="text-xl sm:text-3xl font-bold text-foreground">{value}</p>
      </div>
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
      </div>
    </div>
    <div className="flex items-center gap-1 mt-3">
      {changeType === "up" ? (
        <TrendingUp className="w-3.5 h-3.5 text-secondary" />
      ) : (
        <TrendingDown className="w-3.5 h-3.5 text-destructive" />
      )}
      <span className={`text-xs font-medium ${changeType === "up" ? "text-secondary" : "text-destructive"}`}>
        {change}
      </span>
      <span className="text-xs text-muted-foreground">vs last month</span>
    </div>
  </motion.div>
);

const SuperAdminDashboard = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [showAddSpecialty, setShowAddSpecialty] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState({ name: "", icon: "", description: "" });
  const [editingUser, setEditingUser] = useState<any>(null);

  const { data: statsData } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await api.get("/admin/stats");
      return res.data;
    }
  });

  const { data: usersData = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api.get("/admin/users");
      return res.data;
    }
  });

  const { data: doctorsData = [] } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: async () => {
      const res = await api.get("/admin/doctors");
      return res.data;
    }
  });

  const { data: apiSpecialties = [] } = useQuery({
    queryKey: ["admin-specialties"],
    queryFn: async () => {
      const res = await api.get("/admin/specialties");
      return res.data;
    }
  });

  const deleteSpecialtyMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/specialties/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-specialties"] });
      toast.success("Specialty removed");
    }
  });

  const addSpecialtyMutation = useMutation({
    mutationFn: (data: any) => api.post("/admin/specialties", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-specialties"] });
      setShowAddSpecialty(false);
      setNewSpecialty({ name: "", icon: "", description: "" });
      toast.success("Specialty added");
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: any) => api.put(`/admin/users/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
      toast.success("Status updated");
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => {
      // Clean data: remove fields that shouldn't be in the body
      const { _id, createdAt, updatedAt, role, __v, ...cleanData } = data;
      return api.put(`/admin/users/${id}`, cleanData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
      setEditingUser(null);
      toast.success("User updated successfully");
    },
    onError: (error: any) => {
      console.error('Update Mutation Error:', error);
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  });

  const filteredUsers = usersData.filter((u: any) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredDoctors = doctorsData.filter((d: any) =>
    d.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    (d.doctorDetails?.specialty || "").toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const handleAddSpecialty = () => {
    if (newSpecialty.name) {
      addSpecialtyMutation.mutate(newSpecialty);
    }
  };

  const handleDeleteSpecialty = (id: string) => {
    deleteSpecialtyMutation.mutate(id);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Users" value={statsData?.cards?.totalUsers || 0} change="+0%" changeType="up" icon={Users} color="gradient-primary" />
        <StatCard title="Total Doctors" value={statsData?.cards?.totalDoctors || 0} change="+0%" changeType="up" icon={Stethoscope} color="bg-secondary" />
        <StatCard title="Appointments" value={statsData?.cards?.totalAppointments || 0} change="+0%" changeType="up" icon={Calendar} color="bg-[hsl(280,60%,55%)]" />
        <StatCard title="Revenue" value={`₹${(statsData?.cards?.totalRevenue || 0).toLocaleString()}`} change="+0%" changeType="up" icon={DollarSign} color="bg-[hsl(30,80%,55%)]" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-card rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Growth Overview</h3>
              <p className="text-xs text-muted-foreground">Users & Appointments trend</p>
            </div>
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={statsData?.monthlyTrends || []}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(210, 80%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(210, 80%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 45%, 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 45%, 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} />
              <Area type="monotone" dataKey="users" stroke="hsl(210, 80%, 50%)" fill="url(#colorUsers)" strokeWidth={2} name="Users" />
              <Area type="monotone" dataKey="appointments" stroke="hsl(160, 45%, 48%)" fill="url(#colorAppt)" strokeWidth={2} name="Appointments" />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Appointment Status</h3>
            <Activity className="w-5 h-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statsData?.appointmentStatusStats || []} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {(statsData?.appointmentStatusStats || []).map((entry: any, i: number) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {(statsData?.appointmentStatusStats || []).map((s: any, i: number) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 rounded-full h-2" style={{ backgroundColor: s.color }} />
                <span className="text-[11px] text-muted-foreground">{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
            <Button variant="link" size="sm" className="text-primary h-auto p-0">View all</Button>
          </div>
          <div className="space-y-4">
            {(statsData?.recentActivity || []).map((activity: any) => (
              <div key={activity.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  activity.status === 'completed' ? 'bg-secondary/10 text-secondary' :
                  activity.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                  'bg-primary/10 text-primary'
                }`}>
                  <UserPlus className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.patientName} booked with {activity.doctorName}
                    </p>
                    <span className="text-[10px] text-muted-foreground ml-2 shrink-0">
                      {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.date} at {activity.time}
                    </p>
                    <Badge variant="outline" className="text-[10px] py-0 h-4 rounded-full">
                      ₹{activity.amount}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            {(statsData?.recentActivity || []).length === 0 && (
              <p className="text-sm text-center text-muted-foreground py-10">No recent activity</p>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Weekly Appointments</h3>
              <p className="text-xs text-muted-foreground">This week's breakdown</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={statsData?.weeklyAppointments || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(210, 20%, 95%)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="count" fill="hsl(210, 80%, 50%)" radius={[6, 6, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">User Management</h2>
          <p className="text-sm text-muted-foreground">{usersData.length} registered users</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
              className="pl-9 rounded-xl bg-muted/50 border-border/50" />
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {filteredUsers.map((user, i) => (
          <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">{user.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Badge variant={user.status === "active" ? "default" : "secondary"} className="text-[10px] rounded-full">
                {user.status}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-[11px] font-medium text-foreground truncate">{user.phone}</p>
              </div>
              <div className="p-2 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Joined</p>
                <p className="text-[11px] font-medium text-foreground">{new Date(user.joinDate).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}</p>
              </div>
              <div className="p-2 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Appts</p>
                <p className="text-[11px] font-medium text-foreground">{user.appointments}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" className="flex-1 rounded-xl text-xs h-8"><Eye className="w-3 h-3 mr-1" />View</Button>
              <Button variant="outline" size="sm" onClick={() => setEditingUser(user)} className="flex-1 rounded-xl text-xs h-8"><Edit className="w-3 h-3 mr-1" />Edit</Button>
              <Button variant="outline" size="sm" className="rounded-xl text-xs h-8 text-destructive hover:text-destructive"><Trash2 className="w-3 h-3" /></Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">User</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Phone</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Joined</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Appts</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: any, i: number) => (
                <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{user.phone || "N/A"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">0</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.status === "active" ? "default" : "secondary"} className="rounded-full text-xs">
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {user.status === 'active' ? (
                        <Button variant="ghost" size="icon" onClick={() => updateStatusMutation.mutate({ id: user._id, status: 'suspended' })} className="h-8 w-8 rounded-xl text-destructive hover:text-destructive"><Shield className="w-4 h-4" /></Button>
                      ) : (
                        <Button variant="ghost" size="icon" onClick={() => updateStatusMutation.mutate({ id: user._id, status: 'active' })} className="h-8 w-8 rounded-xl text-success hover:text-success"><Shield className="w-4 h-4" /></Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => setEditingUser(user)} className="h-8 w-8 rounded-xl"><Edit className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDoctors = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Doctor Management</h2>
          <p className="text-sm text-muted-foreground">{doctorsData.length} registered doctors</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search doctors..." value={doctorSearch} onChange={(e) => setDoctorSearch(e.target.value)}
              className="pl-9 rounded-xl bg-muted/50 border-border/50" />
          </div>
          <Button className="rounded-xl gradient-primary border-0 text-primary-foreground gap-1 shrink-0">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Doctor</span>
          </Button>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {filteredDoctors.map((doc, i) => (
          <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.specialty} • {doc.location}</p>
                </div>
              </div>
              <Badge variant={doc.status === "verified" ? "default" : doc.status === "pending" ? "secondary" : "destructive"} className="text-[10px] rounded-full">
                {doc.status}
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-xl bg-muted/50">
                <p className="text-[10px] text-muted-foreground">Exp</p>
                <p className="text-xs font-semibold text-foreground">{doc.experience}yr</p>
              </div>
              <div className="p-2 rounded-xl bg-muted/50">
                <p className="text-[10px] text-muted-foreground">Rating</p>
                <p className="text-xs font-semibold text-foreground">⭐{doc.rating}</p>
              </div>
              <div className="p-2 rounded-xl bg-muted/50">
                <p className="text-[10px] text-muted-foreground">Fees</p>
                <p className="text-xs font-semibold text-foreground">₹{doc.fees}</p>
              </div>
              <div className="p-2 rounded-xl bg-muted/50">
                <p className="text-[10px] text-muted-foreground">Patients</p>
                <p className="text-xs font-semibold text-foreground">{doc.patients}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" className="flex-1 rounded-xl text-xs h-8"><Eye className="w-3 h-3 mr-1" />View</Button>
              <Button variant="outline" size="sm" onClick={() => setEditingUser(doc)} className="flex-1 rounded-xl text-xs h-8"><Edit className="w-3 h-3 mr-1" />Edit</Button>
              <Button variant="outline" size="sm" className="rounded-xl text-xs h-8 text-destructive hover:text-destructive"><Trash2 className="w-3 h-3" /></Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Doctor</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Specialty</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Exp</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Rating</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Fees</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doc: any, i: number) => (
                <motion.tr key={doc._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Stethoscope className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.doctorDetails?.location || "N/A"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{doc.doctorDetails?.specialty}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{doc.doctorDetails?.experience || 0} yrs</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">⭐ {doc.doctorDetails?.rating || 0}</td>
                  <td className="px-4 py-3 text-sm text-foreground">₹{doc.doctorDetails?.fees || 0}</td>
                  <td className="px-4 py-3">
                    <Badge variant={doc.status === "active" ? "default" : doc.status === "inactive" ? "secondary" : "destructive"} className="rounded-full text-xs">
                      {doc.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {doc.status === 'active' ? (
                        <Button variant="ghost" size="icon" onClick={() => updateStatusMutation.mutate({ id: doc._id, status: 'suspended' })} className="h-8 w-8 rounded-xl text-destructive hover:text-destructive" title="Suspend"><Shield className="w-4 h-4" /></Button>
                      ) : (
                        <Button variant="ghost" size="icon" onClick={() => updateStatusMutation.mutate({ id: doc._id, status: 'active' })} className="h-8 w-8 rounded-xl text-success hover:text-success" title="Activate"><Shield className="w-4 h-4" /></Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => setEditingUser(doc)} className="h-8 w-8 rounded-xl"><Edit className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSpecialties = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Specialty Management</h2>
          <p className="text-sm text-muted-foreground">Manage doctor specialties & categories</p>
        </div>
        <Button onClick={() => setShowAddSpecialty(true)} className="rounded-xl gradient-primary border-0 text-primary-foreground gap-1">
          <Plus className="w-4 h-4" /> Add Specialty
        </Button>
      </div>

      {/* Add Specialty Modal */}
      <AnimatePresence>
        {showAddSpecialty && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="glass-card rounded-2xl p-4 sm:p-6 border-2 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Add New Specialty</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowAddSpecialty(false)} className="rounded-xl h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground ml-1">Specialty Name</label>
                  <Input placeholder="e.g. Cardiology" value={newSpecialty.name} onChange={(e) => setNewSpecialty({ ...newSpecialty, name: e.target.value })}
                    className="rounded-xl bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground ml-1">Description</label>
                  <Input placeholder="Short description..." value={newSpecialty.description} onChange={(e) => setNewSpecialty({ ...newSpecialty, description: e.target.value })}
                    className="rounded-xl bg-muted/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground ml-1">Select Icon</label>
                <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-muted/30 border border-border/50">
                  {AVAILABLE_ICONS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setNewSpecialty({ ...newSpecialty, icon: item.icon })}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                        newSpecialty.icon === item.icon 
                        ? "bg-primary text-primary-foreground scale-110 shadow-lg" 
                        : "bg-background hover:bg-muted border border-border/50"
                      }`}
                      title={item.label}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleAddSpecialty} className="rounded-xl gradient-primary border-0 text-primary-foreground">
                Save Specialty
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Specialty Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {apiSpecialties.map((spec: any, i: number) => (
          <motion.div key={spec._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl p-4 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">
                {spec.icon || "🏥"}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg"><Edit className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-destructive hover:text-destructive"
                  onClick={() => handleDeleteSpecialty(spec._id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <h3 className="font-semibold text-foreground mt-3">{spec.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{spec.description}</p>
            <div className="mt-3 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">{spec.doctorCount || 0} doctors</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Platform Settings", desc: "Manage fees, commissions, and platform config", icon: Settings },
          { title: "Notifications", desc: "Configure email & push notification rules", icon: Bell },
          { title: "Security", desc: "Manage admin accounts and access control", icon: Shield },
          { title: "Analytics", desc: "Advanced analytics and report exports", icon: Activity },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderEditModal = () => {
    if (!editingUser) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-card w-full max-w-md rounded-2xl p-6 shadow-2xl border border-primary/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">Edit User Details</h3>
            <Button variant="ghost" size="icon" onClick={() => setEditingUser(null)} className="rounded-xl">
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground ml-1">Full Name</label>
              <Input value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                className="rounded-xl bg-muted/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground ml-1">Email Address</label>
              <Input value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="rounded-xl bg-muted/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground ml-1">Phone Number</label>
              <Input value={editingUser.phone || ""} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                className="rounded-xl bg-muted/50 border-border/50" placeholder="+91 ..." />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground ml-1">Status</label>
              <div className="flex gap-2">
                {['active', 'suspended', 'pending'].map((s) => (
                  <Button key={s} variant={editingUser.status === s ? 'default' : 'outline'} size="sm"
                    onClick={() => setEditingUser({ ...editingUser, status: s })}
                    className="rounded-full text-[10px] capitalize h-7 flex-1">
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button className="flex-1 rounded-xl gradient-primary border-0 text-primary-foreground"
              disabled={updateUserMutation.isPending}
              onClick={() => {
                const id = editingUser._id || editingUser.id;
                if (!id) return toast.error("User ID missing!");
                updateUserMutation.mutate({ id, ...editingUser });
              }}>
              {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {renderEditModal()}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-4rem)] border-r border-border/50 bg-card/50 p-4 sticky top-16">
          <div className="flex items-center gap-3 mb-6 px-3">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">Super Admin</p>
              <p className="text-xs text-muted-foreground">Full Access</p>
            </div>
          </div>

          <nav className="space-y-1 flex-1">
            {sidebarItems.map((item) => (
              <button key={item.key} onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.key
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}>
                <item.icon className="w-4.5 h-4.5" />
                {item.label}
              </button>
            ))}
          </nav>

          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors mt-2">
            <LogOut className="w-4.5 h-4.5" />
            Logout
          </button>
        </aside>

        {/* Mobile Bottom Nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50 px-2 py-1 safe-area-bottom">
          <div className="flex justify-around">
            {sidebarItems.slice(0, 4).map((item) => (
              <button key={item.key} onClick={() => setActiveTab(item.key)}
                className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all ${
                  activeTab === item.key ? "text-primary" : "text-muted-foreground"
                }`}>
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              {activeTab === "dashboard" && renderDashboard()}
              {activeTab === "users" && renderUsers()}
              {activeTab === "doctors" && renderDoctors()}
              {activeTab === "specialties" && renderSpecialties()}
              {activeTab === "settings" && renderSettings()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
