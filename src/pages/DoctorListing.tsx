import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DoctorCard from "@/components/doctors/DoctorCard";
import EmptyState from "@/components/shared/EmptyState";
import { doctors, specialties } from "@/data/mockData";

const DoctorListing = () => {
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = doctors.filter((d) => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = !selectedSpecialty || d.specialty === selectedSpecialty;
    return matchSearch && matchSpecialty;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Find Doctors</h1>
          <p className="text-muted-foreground">Book appointments with the best doctors near you</p>
        </motion.div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-11 rounded-xl"
            />
          </div>
          <div className="relative flex-1 sm:max-w-[200px]">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Location" className="pl-11 h-11 rounded-xl" />
          </div>
          <Button variant="outline" className="h-11 rounded-xl gap-2" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </Button>
          <div className="flex gap-1 border border-border rounded-xl p-1">
            <button onClick={() => setLayout("grid")} className={`p-2 rounded-lg transition-colors ${layout === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setLayout("list")} className={`p-2 rounded-lg transition-colors ${layout === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Specialty filters */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6">
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold mb-3">Specialty</h3>
              <div className="flex flex-wrap gap-2">
                {specialties.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedSpecialty(selectedSpecialty === s.name ? null : s.name)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedSpecialty === s.name ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedSpecialty && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Filtered by:</span>
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm flex items-center gap-1">
              {selectedSpecialty}
              <button onClick={() => setSelectedSpecialty(null)}><X className="w-3 h-3" /></button>
            </span>
          </div>
        )}

        {/* Results */}
        <p className="text-sm text-muted-foreground mb-4">{filtered.length} doctors found</p>

        {filtered.length === 0 ? (
          <EmptyState icon="search" title="No doctors found" description="Try adjusting your search or filters to find what you're looking for." />
        ) : (
          <div className={layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-4"}>
            {filtered.map((doctor, i) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={i} layout={layout} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DoctorListing;
