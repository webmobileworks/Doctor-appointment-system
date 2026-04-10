export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviewCount: number;
  fees: number;
  location: string;
  image: string;
  qualification: string;
  about: string;
  languages: string[];
  availableSlots: string[];
  nextAvailable: string;
}

export const specialties = [
  { name: "Cardiology", icon: "Heart", color: "hsl(0 72% 55%)", count: 45 },
  { name: "Dentistry", icon: "Smile", color: "hsl(210 80% 50%)", count: 62 },
  { name: "Neurology", icon: "Brain", color: "hsl(280 60% 55%)", count: 28 },
  { name: "Orthopedics", icon: "Bone", color: "hsl(38 92% 50%)", count: 35 },
  { name: "Pediatrics", icon: "Baby", color: "hsl(160 45% 48%)", count: 51 },
  { name: "Dermatology", icon: "Sparkles", color: "hsl(330 60% 55%)", count: 39 },
  { name: "Ophthalmology", icon: "Eye", color: "hsl(190 70% 45%)", count: 22 },
  { name: "General Medicine", icon: "Stethoscope", color: "hsl(210 60% 45%)", count: 88 },
];

export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    experience: 15,
    rating: 4.9,
    reviewCount: 328,
    fees: 800,
    location: "Mumbai",
    image: "",
    qualification: "MBBS, MD (Cardiology), DM",
    about: "Dr. Sarah Johnson is a highly experienced cardiologist with over 15 years of expertise in treating complex cardiac conditions. She specializes in interventional cardiology and heart failure management.",
    languages: ["English", "Hindi"],
    availableSlots: ["09:00 AM", "09:30 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:30 PM"],
    nextAvailable: "Today",
  },
  {
    id: "2",
    name: "Dr. Rajesh Kumar",
    specialty: "Orthopedics",
    experience: 12,
    rating: 4.8,
    reviewCount: 256,
    fees: 600,
    location: "Delhi",
    image: "",
    qualification: "MBBS, MS (Orthopedics)",
    about: "Specializing in joint replacement surgery and sports medicine with over 12 years of experience.",
    languages: ["English", "Hindi", "Punjabi"],
    availableSlots: ["10:00 AM", "11:00 AM", "02:00 PM", "03:30 PM", "05:00 PM"],
    nextAvailable: "Today",
  },
  {
    id: "3",
    name: "Dr. Priya Sharma",
    specialty: "Dermatology",
    experience: 8,
    rating: 4.7,
    reviewCount: 189,
    fees: 500,
    location: "Bangalore",
    image: "",
    qualification: "MBBS, MD (Dermatology)",
    about: "Expert dermatologist specializing in cosmetic dermatology and skin cancer treatment.",
    languages: ["English", "Hindi", "Kannada"],
    availableSlots: ["09:00 AM", "10:30 AM", "11:30 AM", "03:00 PM", "04:00 PM"],
    nextAvailable: "Tomorrow",
  },
  {
    id: "4",
    name: "Dr. Amit Patel",
    specialty: "Neurology",
    experience: 20,
    rating: 4.9,
    reviewCount: 412,
    fees: 1000,
    location: "Mumbai",
    image: "",
    qualification: "MBBS, MD, DM (Neurology)",
    about: "Senior neurologist with two decades of experience in treating neurological disorders.",
    languages: ["English", "Hindi", "Gujarati"],
    availableSlots: ["10:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
    nextAvailable: "Today",
  },
  {
    id: "5",
    name: "Dr. Meera Reddy",
    specialty: "Pediatrics",
    experience: 10,
    rating: 4.8,
    reviewCount: 290,
    fees: 450,
    location: "Hyderabad",
    image: "",
    qualification: "MBBS, MD (Pediatrics)",
    about: "Compassionate pediatrician dedicated to providing comprehensive child healthcare.",
    languages: ["English", "Hindi", "Telugu"],
    availableSlots: ["09:00 AM", "10:00 AM", "11:30 AM", "02:30 PM", "04:00 PM", "05:30 PM"],
    nextAvailable: "Today",
  },
  {
    id: "6",
    name: "Dr. Arjun Singh",
    specialty: "Dentistry",
    experience: 7,
    rating: 4.6,
    reviewCount: 156,
    fees: 400,
    location: "Chennai",
    image: "",
    qualification: "BDS, MDS (Orthodontics)",
    about: "Skilled dentist specializing in cosmetic dentistry and orthodontic treatments.",
    languages: ["English", "Hindi", "Tamil"],
    availableSlots: ["09:30 AM", "10:30 AM", "11:30 AM", "03:00 PM", "04:30 PM"],
    nextAvailable: "Tomorrow",
  },
];

export const reviews = [
  { id: "1", doctorId: "1", userName: "Ankit M.", rating: 5, comment: "Excellent doctor! Very thorough and caring.", date: "2 days ago" },
  { id: "2", doctorId: "1", userName: "Priya S.", rating: 5, comment: "Best cardiologist in the city. Highly recommended.", date: "1 week ago" },
  { id: "3", doctorId: "1", userName: "Rahul K.", rating: 4, comment: "Great experience. Very professional and knowledgeable.", date: "2 weeks ago" },
];

export const appointments = [
  { id: "1", patientName: "Ankit Mehta", date: "2026-04-07", time: "10:00 AM", status: "confirmed" as const, type: "In-person" },
  { id: "2", patientName: "Priya Sharma", date: "2026-04-07", time: "11:00 AM", status: "pending" as const, type: "Video" },
  { id: "3", patientName: "Rahul Kumar", date: "2026-04-07", time: "02:00 PM", status: "confirmed" as const, type: "In-person" },
  { id: "4", patientName: "Sneha Patel", date: "2026-04-08", time: "09:00 AM", status: "pending" as const, type: "Video" },
  { id: "5", patientName: "Vikram Singh", date: "2026-04-08", time: "03:00 PM", status: "completed" as const, type: "In-person" },
];
