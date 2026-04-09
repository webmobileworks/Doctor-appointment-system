import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Find Doctors", path: "/doctors" },
  { label: "Consultations", path: "/consultation" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const userInfoStr = localStorage.getItem('userInfo');
  const user = userInfoStr ? JSON.parse(userInfoStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="MediBook" className="w-9 h-9 rounded-xl" />
          <span className="text-lg font-bold text-foreground">MediBook</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
          </Button>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to={user.role === 'doctor' ? "/doctor-dashboard" : "/profile"} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{user.role === 'doctor' ? "Portal" : user.name}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-xl">Logout</Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="rounded-xl gap-2">
                  <User className="w-4 h-4" />
                  Login
                </Button>
              </Link>
              <Link to="/doctor-dashboard">
                <Button size="sm" className="rounded-xl gradient-primary border-0 text-primary-foreground">
                  Doctor Portal
                </Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-card"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
                  <Link to={user.role === 'doctor' ? "/doctor-dashboard" : "/profile"} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{user.role === 'doctor' ? "Doctor Portal" : user.name}</span>
                  </Link>
                  <Button variant="outline" onClick={handleLogout} className="w-full rounded-xl">Logout</Button>
                </div>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full rounded-xl">Login</Button>
                  </Link>
                  <Link to="/doctor-dashboard" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full rounded-xl gradient-primary border-0 text-primary-foreground">Doctor</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
