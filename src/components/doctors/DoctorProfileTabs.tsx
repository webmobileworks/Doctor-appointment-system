import { motion } from "framer-motion";
import { Star, GraduationCap, Clock, IndianRupee, Languages, Calendar, Heart, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const tabs = ["Overview", "Reviews", "Availability"];

interface Props {
  doctor: any;
  reviewsData: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDate: string | null;
  setSelectedDate: (d: string | null) => void;
  selectedSlot: string | null;
  setSelectedSlot: (s: string | null) => void;
  dates: { date: string; day: string; num: number; month: string }[];
  availableForDay: string[];
}

const DoctorProfileTabs = ({
  doctor, reviewsData, activeTab, setActiveTab,
  selectedDate, setSelectedDate, selectedSlot, setSelectedSlot,
  dates, availableForDay
}: Props) => {

  // Calculate rating distribution
  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    count: reviewsData.filter((rev: any) => rev.rating === r).length,
    pct: reviewsData.length ? Math.round((reviewsData.filter((rev: any) => rev.rating === r).length / reviewsData.length) * 100) : 0
  }));

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex gap-1 bg-muted/50 rounded-2xl p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all ${
              activeTab === tab
                ? "bg-card text-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "Overview" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* About */}
          <div className="glass-card p-5 sm:p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-primary" /> About Doctor
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{doctor.about || "No bio available."}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { icon: GraduationCap, label: "Qualification", value: doctor.qualification, color: "text-primary" },
              { icon: Clock, label: "Experience", value: `${doctor.experience} years`, color: "text-accent-foreground" },
              { icon: IndianRupee, label: "Consultation Fee", value: `₹${doctor.fees}`, color: "text-success" },
              { icon: Languages, label: "Languages", value: (doctor.languages || []).join(", ") || "Hindi, English", color: "text-warning" },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.02 }}
                className="glass-card p-4 space-y-2 group cursor-default"
              >
                <div className={`w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center ${item.color} group-hover:bg-primary/10 transition-colors`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold leading-tight">{item.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Specializations Tags */}
          <div className="glass-card p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" /> Specializations
            </h3>
            <div className="flex flex-wrap gap-2">
              {[doctor.specialty, "General Medicine", "Preventive Care"].map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-primary/5 text-primary text-xs font-medium rounded-full border border-primary/10">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Reviews */}
      {activeTab === "Reviews" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Rating Summary */}
          {reviewsData.length > 0 && (
            <div className="glass-card p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-5xl font-bold text-foreground">{doctor.rating}</p>
                  <div className="flex gap-0.5 justify-center sm:justify-start mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(doctor.rating) ? "text-warning fill-warning" : "text-muted"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{reviewsData.length} reviews</p>
                </div>
                <div className="flex-1 space-y-2">
                  {ratingDist.map(r => (
                    <div key={r.stars} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-3">{r.stars}</span>
                      <Star className="w-3 h-3 text-warning fill-warning" />
                      <Progress value={r.pct} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground w-8">{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Review Cards */}
          {reviewsData.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Star className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No reviews yet for this doctor.</p>
            </div>
          ) : (
            reviewsData.map((rev: any, i: number) => (
              <motion.div
                key={rev._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary text-sm font-bold">
                      {rev.patient?.name ? rev.patient.name[0].toUpperCase() : "U"}
                    </div>
                    <div>
                      <span className="font-semibold text-sm">{rev.patient?.name || "Anonymous"}</span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(rev.createdAt || rev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? "text-warning fill-warning" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{rev.comment}</p>
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      {/* Availability */}
      {activeTab === "Availability" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 sm:p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Select Date
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {dates.map((d) => (
                <button
                  key={d.date}
                  onClick={() => { setSelectedDate(d.date); setSelectedSlot(null); }}
                  className={`flex-shrink-0 w-16 sm:w-20 p-3 rounded-2xl text-center transition-all ${
                    selectedDate === d.date
                      ? "gradient-primary text-primary-foreground shadow-lg scale-105"
                      : "bg-muted/50 hover:bg-muted border border-transparent hover:border-border"
                  }`}
                >
                  <p className="text-[10px] sm:text-xs opacity-80 uppercase">{d.day}</p>
                  <p className="text-xl sm:text-2xl font-bold leading-tight">{d.num}</p>
                  <p className="text-[10px] sm:text-xs opacity-80">{d.month}</p>
                </button>
              ))}
            </div>
          </div>
          {selectedDate && (
            <div>
              <h3 className="font-semibold mb-4">Available Slots</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableForDay.length > 0 ? (
                  availableForDay.map((slot: string) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                        selectedSlot === slot
                          ? "gradient-primary text-primary-foreground shadow-md"
                          : "border border-border hover:border-primary hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      {slot}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground col-span-full py-4 text-center">No slots available for this day.</p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default DoctorProfileTabs;
