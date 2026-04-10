import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Mail, Calendar, Droplets, Edit2, Save, X, Shield, Clock, FileText, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  // Review State
  const [reviewModal, setReviewModal] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
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

  const { data: profileData } = useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data;
    },
    enabled: !!localStorage.getItem("userInfo")
  });

  useEffect(() => {
    if (profileData) {
      setUser(profileData);
      setForm({
        name: profileData.name || "",
        phone: profileData.phone || "",
        email: profileData.email || "",
        gender: profileData.gender || "",
        dob: profileData.dob || "",
        bloodGroup: profileData.bloodGroup || "",
      });
      const stored = localStorage.getItem("userInfo");
      if (stored) {
        localStorage.setItem("userInfo", JSON.stringify({ ...JSON.parse(stored), ...profileData }));
      }
    }
  }, [profileData]);

  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: async () => {
      const res = await api.get('/appointments');
      return res.data;
    },
    enabled: !!user
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const res = await api.put('/auth/me', updatedData);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      setIsEditing(false);
      toast.success("Profile updated on server successfully!");
    },
    onError: () => {
      toast.error("Failed to update profile");
    }
  });

  const handleSave = () => {
    updateMutation.mutate(form);
  };

  const reviewMutation = useMutation({
    mutationFn: async ({ id, rating, comment }: any) => {
      const res = await api.post(`/appointments/${id}/review`, { rating, comment });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setReviewModal(null);
      setReviewComment("");
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  });

  const submitReview = (id: string) => {
    if (!reviewRating) {
      toast.error("Please provide a rating");
      return;
    }
    reviewMutation.mutate({ id, rating: reviewRating, comment: reviewComment });
  };

  if (!user) return null;

  const initials = form.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const prescriptionCount = appointments.filter((a: any) => a.prescriptionFile).length;
  const consultationCount = appointments.filter((a: any) => a.status === 'completed').length;

  const stats = [
    { label: "Appointments", value: appointments.length.toString(), icon: Calendar },
    { label: "Prescriptions", value: prescriptionCount.toString(), icon: FileText },
    { label: "Consultations", value: consultationCount.toString(), icon: Clock },
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
                  <Button onClick={handleSave} disabled={updateMutation.isPending} className="rounded-xl bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 border-0">
                    <Save className="w-4 h-4 mr-2" /> {updateMutation.isPending ? "Saving..." : "Save"}
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

          <Separator className="my-8" />
          <h2 className="text-lg font-semibold text-foreground mb-4">My Appointments</h2>
          <div className="space-y-4">
            {isLoadingAppointments ? (
              <p className="text-sm text-muted-foreground">Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">You have no upcoming appointments.</p>
            ) : (
              appointments.map((apt: any) => (
                <div key={apt._id} className="mb-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/10 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 hidden sm:block">
                        <AvatarImage src={apt.doctor?.doctorDetails?.image || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary">{apt.doctor?.name ? apt.doctor.name.split(" ")[1]?.[0] : "D"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{apt.doctor?.name || 'Unknown Doctor'}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <Calendar className="w-3 h-3" /> {apt.date} • {apt.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="outline" className={`capitalize ${
                        apt.status === "completed" ? "bg-primary/10 text-primary border-primary/20" :
                        apt.status === "confirmed" ? "bg-success/10 text-success border-success/20" : 
                        apt.status === "pending" ? "bg-warning/10 text-warning border-warning/20" : ""
                      }`}>
                        {apt.status}
                      </Badge>
                      {apt.status === "completed" && !apt.review?.rating && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-xs h-7 text-primary mt-1"
                          onClick={() => {
                            setReviewModal(reviewModal === apt._id ? null : apt._id);
                            setReviewRating(5);
                            setReviewComment("");
                          }}
                        >
                          <Star className="w-3 h-3 mr-1" /> Leave Review
                        </Button>
                      )}
                      {apt.review?.rating && (
                        <div className="flex items-center text-warning mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < apt.review.rating ? "fill-warning" : "text-muted"}`} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {reviewModal === apt._id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <p className="text-sm font-medium mb-3">Rate your experience</p>
                          <div className="flex items-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                              >
                                <Star className={`w-8 h-8 ${reviewRating >= star ? "fill-warning text-warning" : "text-muted-foreground/30"}`} />
                              </button>
                            ))}
                          </div>
                          <Input 
                            placeholder="Share your experience (optional)" 
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            className="rounded-xl h-11 mb-3"
                          />
                          <div className="flex gap-2">
                            <Button 
                              className="rounded-xl gradient-primary border-0 text-primary-foreground h-11 flex-1"
                              onClick={() => submitReview(apt._id)}
                              disabled={reviewMutation.isPending}
                            >
                              {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
                            </Button>
                            <Button 
                              variant="outline" 
                              className="rounded-xl h-11"
                              onClick={() => setReviewModal(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
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
