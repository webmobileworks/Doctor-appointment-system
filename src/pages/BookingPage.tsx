import { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle, ArrowLeft, User, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/layout/Navbar";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

const BookingPage = () => {
  const { id } = useParams();
  const location = useLocation();

  
  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const res = await api.get(`/doctors/${id}`);
      const doc = res.data;
      return {
        id: doc._id,
        name: doc.name,
        specialty: doc.doctorDetails?.specialty || '',
        fees: doc.doctorDetails?.fees || 0,
        availableSlots: doc.doctorDetails?.availableSlots || []
      };
    }
  });

  const passedState = location.state as { selectedDate?: string, selectedSlot?: string } | null;
  const initDate = passedState?.selectedDate || null;
  const initSlot = passedState?.selectedSlot || null;

  const [step, setStep] = useState((initDate && initSlot) ? 2 : 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(initDate);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(initSlot);
  
  const userInfoStr = localStorage.getItem('userInfo');
  const user = userInfoStr ? JSON.parse(userInfoStr) : null;

  const [patientName, setPatientName] = useState(user?.name || "");
  const [patientPhone, setPatientPhone] = useState(user?.phone || "");
  const [patientSymptoms, setPatientSymptoms] = useState("");

  const bookMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return api.post('/appointments', bookingData);
    },
    onSuccess: () => {
      setStep(3);
      toast.success("Appointment booked successfully!");
    },
    onError: () => {
      toast.error("Failed to book appointment. Are you logged in?");
    }
  });

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return { date: d.toISOString().split("T")[0], day: d.toLocaleDateString("en", { weekday: "short" }), num: d.getDate() };
  });

  const selectedDateObj = dates.find(d => d.date === selectedDate);
  const availableForDay = selectedDateObj && doctor 
    ? doctor.availableSlots
        .filter((s: string) => s.startsWith(selectedDateObj.day))
        .map((s: string) => s.split("-")[1])
    : [];

  const handleConfirm = () => {
    bookMutation.mutate({
      doctorId: id,
      date: selectedDate,
      time: selectedSlot,
      type: "In-person",
      symptoms: patientSymptoms,
      amount: doctor?.fees
    });
  };

  if (isLoading || !doctor) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (step === 3) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground mb-8">Your appointment with {doctor.name} has been booked successfully.</p>
            <div className="glass-card p-6 text-left space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Doctor</span>
                <span className="font-medium">{doctor.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{selectedDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{selectedSlot}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fee</span>
                <span className="font-medium">₹{doctor.fees}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/payment" className="flex-1">
                <Button className="w-full rounded-xl gradient-primary border-0 text-primary-foreground">Pay Now</Button>
              </Link>
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full rounded-xl">Go Home</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link to={`/doctor/${doctor.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          {["Select Slot", "Patient Details"].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step > i + 1 ? "bg-success text-success-foreground" : step === i + 1 ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>{i + 1}</div>
              <span className={`text-sm ${step === i + 1 ? "font-medium" : "text-muted-foreground"}`}>{label}</span>
              {i < 1 && <div className="flex-1 h-px bg-border" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                {doctor.name.split(" ")[1]?.[0]}
              </div>
              <div>
                <h3 className="font-semibold">{doctor.name}</h3>
                <p className="text-sm text-primary">{doctor.specialty}</p>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" /> Select Date</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
                {dates.map((d) => (
                  <button key={d.date} onClick={() => { setSelectedDate(d.date); setSelectedSlot(null); }}
                    className={`flex-shrink-0 w-[60px] p-3 rounded-xl text-center transition-all snap-center ${selectedDate === d.date ? "gradient-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted"}`}>
                    <p className="text-xs opacity-80">{d.day}</p>
                    <p className="text-lg font-bold">{d.num}</p>
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Clock className="w-4 h-4" /> Select Time</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableForDay.length > 0 ? availableForDay.map((slot: string) => (
                    <button key={slot} onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                        selectedSlot === slot ? "gradient-primary text-primary-foreground" : "border border-border hover:border-primary"
                      }`}>{slot}</button>
                  )) : (
                    <p className="text-sm text-muted-foreground col-span-full">No active slots available for this day.</p>
                  )}
                </div>
              </motion.div>
            )}

            <Button onClick={() => setStep(2)} disabled={!selectedDate || !selectedSlot}
              className="w-full h-12 rounded-xl gradient-primary border-0 text-primary-foreground">
              Continue
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-semibold">Patient Details</h3>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Patient Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="pl-11 h-11 rounded-xl" />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Phone Number" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} className="pl-11 h-11 rounded-xl" />
              </div>
              <div className="relative">
                <FileText className="absolute left-4 top-3 w-4 h-4 text-muted-foreground" />
                <Textarea placeholder="Reason for visit (optional)" value={patientSymptoms} onChange={(e) => setPatientSymptoms(e.target.value)} className="pl-11 rounded-xl min-h-[80px]" />
              </div>
            </div>

            <div className="glass-card p-6 space-y-3">
              <h3 className="font-semibold">Booking Summary</h3>
              {[
                ["Doctor", doctor.name],
                ["Date", selectedDate || ""],
                ["Time", selectedSlot || ""],
                ["Fee", `₹${doctor.fees}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 rounded-xl">Back</Button>
              <Button onClick={handleConfirm} disabled={bookMutation.isPending} className="flex-1 h-12 rounded-xl gradient-primary border-0 text-primary-foreground">
                {bookMutation.isPending ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
