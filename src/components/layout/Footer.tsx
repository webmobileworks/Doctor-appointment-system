import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="bg-card border-t border-border/50 mt-auto">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="MediBook" className="w-9 h-9 rounded-xl" loading="lazy" />
            <span className="text-lg font-bold">MediBook</span>
          </div>
          <p className="text-sm text-muted-foreground">Your trusted healthcare partner for booking appointments with top doctors.</p>
        </div>
        {[
          { title: "For Patients", links: [["Find Doctors", "/doctors"], ["Book Appointment", "/doctors"], ["Online Consult", "/consultation"]] },
          { title: "For Doctors", links: [["Doctor Portal", "/doctor-dashboard"], ["Join as Doctor", "/login"]] },
          { title: "Company", links: [["About Us", "/"], ["Contact", "/"], ["Privacy", "/"]] },
        ].map((section) => (
          <div key={section.title}>
            <h4 className="font-semibold mb-4">{section.title}</h4>
            <ul className="space-y-2">
              {section.links.map(([label, path]) => (
                <li key={label}>
                  <Link to={path} className="text-sm text-muted-foreground hover:text-primary transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">© 2026 MediBook. All rights reserved.</p>
        <p className="text-sm text-muted-foreground flex items-center gap-1">Made with <Heart className="w-3 h-3 text-destructive fill-destructive" /> for better healthcare</p>
      </div>
    </div>
  </footer>
);

export default Footer;
