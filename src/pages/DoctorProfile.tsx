import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, GraduationCap, Languages, IndianRupee, Calendar, ArrowLeft, Video, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const tabs = ["Overview", "Reviews", "Availability"];

const DoctorProfile = () => {
  const { id } = useParams();
  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const res = await api.get(`/doctors/${id}`);
      const doc = res.data;
      return {
        id: doc._id,
        name: doc.name,
        specialty: doc.doctorDetails?.specialty || '',
        experience: doc.doctorDetails?.experience || 0,
        rating: doc.doctorDetails?.rating || 0,
        reviewCount: doc.doctorDetails?.reviewCount || 0,
        fees: doc.doctorDetails?.fees || 0,
        location: doc.doctorDetails?.location || '',
        image: doc.doctorDetails?.image || '',
        qualification: doc.doctorDetails?.qualification || '',
        about: doc.doctorDetails?.about || '',
        languages: doc.doctorDetails?.languages || [],
        availableSlots: doc.doctorDetails?.availableSlots || [],
        nextAvailable: doc.doctorDetails?.nextAvailable || ''
      };
    }
  });

  const { data: reviewsData = [] } = useQuery({
    queryKey: ['doctor-reviews', id],
    queryFn: async () => {
      const res = await api.get(`/doctors/${id}/reviews`);
      return res.data;
    },
    enabled: !!id
  });

  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const userInfoStr = localStorage.getItem("userInfo");
  const user = userInfoStr ? JSON.parse(userInfoStr) : null;

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return { date: d.toISOString().split("T")[0], day: d.toLocaleDateString("en", { weekday: "short" }), num: d.getDate(), month: d.toLocaleDateString("en", { month: "short" }) };
  });

  const selectedDateObj = dates.find(d => d.date === selectedDate);
  const availableForDay = selectedDateObj && doctor 
    ? (doctor.availableSlots || [])
        .filter((s: string) => s.startsWith(selectedDateObj.day))
        .map((s: string) => s.split("-")[1])
    : [];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  if (!doctor) {
    return <div className="min-h-screen flex items-center justify-center">Doctor not found.</div>;
  }

  const initials = doctor.name.split(" ").slice(1).map((n: string) => n[0]).join("") || "DR";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/doctors" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Doctors
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-2xl shrink-0">
                  {initials}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground">{doctor.name}</h1>
                  <p className="text-primary font-medium">{doctor.specialty}</p>
                  <p className="text-sm text-muted-foreground mt-1">{doctor.qualification}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{doctor.experience} yrs exp</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{doctor.location || 'Unknown Location'}</span>
                    <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-warning fill-warning" />{doctor.rating} ({doctor.reviewCount} reviews)</span>
                    <span className="flex items-center gap-1.5"><Languages className="w-4 h-4" />{(doctor.languages || []).join(", ")}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-1 bg-muted/50 rounded-xl p-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-3">About</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{doctor.about}</p>
                </div>
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4">Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: GraduationCap, label: "Qualification", value: doctor.qualification },
                      { icon: Clock, label: "Experience", value: `${doctor.experience} years` },
                      { icon: IndianRupee, label: "Consultation Fee", value: `₹${doctor.fees}` },
                      { icon: Languages, label: "Languages", value: (doctor.languages || []).join(", ") },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                        <item.icon className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="text-sm font-medium">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Reviews" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {reviewsData.length === 0 ? (
                  <div className="glass-card p-6 text-center text-muted-foreground">No reviews yet for this doctor.</div>
                ) : reviewsData.map((rev: any) => (
                  <div key={rev._id} className="glass-card p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {rev.patient?.name ? rev.patient.name[0].toUpperCase() : 'U'}
                        </div>
                        <span className="font-medium text-sm">{rev.patient?.name || 'Anonymous User'}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(rev.createdAt || rev.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? "text-warning fill-warning" : "text-muted"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{rev.comment}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "Availability" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" /> Select Date</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {dates.map((d) => (
                      <button
                        key={d.date}
                        onClick={() => { setSelectedDate(d.date); setSelectedSlot(null); }}
                        className={`p-3 rounded-xl text-center transition-all ${
                          selectedDate === d.date ? "gradient-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted"
                        }`}
                      >
                        <p className="text-xs opacity-80">{d.day}</p>
                        <p className="text-lg font-bold">{d.num}</p>
                        <p className="text-xs opacity-80">{d.month}</p>
                      </button>
                    ))}
                  </div>
                </div>
                {selectedDate && (
                  <div>
                    <h3 className="font-semibold mb-4">Available Slots</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableForDay.length > 0 ? availableForDay.map((slot: string) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                            selectedSlot === slot ? "gradient-primary text-primary-foreground" : "border border-border hover:border-primary hover:text-primary"
                          }`}
                        >
                          {slot}
                        </button>
                      )) : (
                        <p className="text-sm text-muted-foreground col-span-full">No active slots available for this day.</p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Book Appointment</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Consultation Fee</span>
                  <span className="font-bold text-foreground">₹{doctor.fees}</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{selectedDate || "Select a date"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium">{selectedSlot || "Select a slot"}</span>
                  </div>
                </div>

                <Link 
                  to={!selectedDate || !selectedSlot ? "#" : user ? `/booking/${doctor.id}` : "/login"} 
                  state={user ? { selectedDate, selectedSlot } : { from: `/booking/${doctor.id}`, selectedDate, selectedSlot }}
                >
                  <Button
                    className="w-full rounded-xl gradient-primary border-0 text-primary-foreground h-11"
                    disabled={!selectedDate || !selectedSlot}
                  >
                    <Building className="w-4 h-4 mr-2" /> Book In-person
                  </Button>
                </Link>
                <Link 
                  to={!selectedDate || !selectedSlot ? "#" : user ? `/consultation` : "/login"}
                  state={user ? { doctorId: doctor.id } : { from: "/consultation" }}
                >
                  <Button
                    variant="outline"
                    className="w-full rounded-xl h-11 mt-2"
                    disabled={!selectedDate || !selectedSlot}
                  >
                    <Video className="w-4 h-4 mr-2" /> Online Consult
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorProfile;
