import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import DoctorProfileHeader from "@/components/doctors/DoctorProfileHeader";
import DoctorProfileTabs from "@/components/doctors/DoctorProfileTabs";
import BookingSidebar from "@/components/doctors/BookingSidebar";

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
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Loading doctor profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Doctor not found.</p>
        </div>
      </div>
    );
  }

  const backendUrl = "http://localhost:5050";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Link to="/doctors" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Doctors
        </Link>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <DoctorProfileHeader doctor={doctor} backendUrl={backendUrl} />
            <DoctorProfileTabs
              doctor={doctor}
              reviewsData={reviewsData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
              dates={dates}
              availableForDay={availableForDay}
            />
          </div>
          <BookingSidebar
            doctor={doctor}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            user={user}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorProfile;
