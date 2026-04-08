import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { motion } from "framer-motion";
import { Send, Video, Phone, Paperclip, Smile, MoreVertical, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";

interface Message {
  id: string;
  text: string;
  sender: "patient" | "doctor";
  time: string;
}

const initialMessages: Message[] = [
  { id: "1", text: "Hello Doctor, I've been having headaches for the past week.", sender: "patient", time: "10:00 AM" },
  { id: "2", text: "Hello! I'm sorry to hear that. Can you describe the headaches?", sender: "doctor", time: "10:02 AM" },
  { id: "3", text: "It's a throbbing pain on the right side, usually in the morning.", sender: "patient", time: "10:03 AM" },
  { id: "4", text: "I see. Are you experiencing any nausea or sensitivity to light?", sender: "doctor", time: "10:05 AM" },
];

const ConsultationPage = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.emit("join_consultation", "test-room-1");

    newSocket.on("receive_message", (data: Message) => {
      setMessages((prev) => {
        // Prevent duplicate messages if sender is us
        if (prev.find(m => m.id === data.id)) return prev;
        return [...prev, data];
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    const newMsg: Message = { id: Date.now().toString(), text: input, sender: "patient", time: new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }) };
    
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    
    socket.emit("send_message", { consultationId: "test-room-1", ...newMsg });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-4 flex-1 flex flex-col max-w-3xl">
        {/* Video Call Placeholder */}
        {isVideoCall && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 rounded-2xl gradient-primary aspect-video flex items-center justify-center relative overflow-hidden">
            <div className="text-center text-primary-foreground">
              <Video className="w-12 h-12 mx-auto mb-3 opacity-80" />
              <p className="text-lg font-semibold">Video Consultation</p>
              <p className="text-sm opacity-80">Connected with Dr. Sarah Johnson</p>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              <Button size="icon" variant="secondary" className="rounded-full w-12 h-12"><Phone className="w-5 h-5" /></Button>
              <Button size="icon" className="rounded-full w-12 h-12 bg-destructive hover:bg-destructive/90" onClick={() => setIsVideoCall(false)}>
                <Phone className="w-5 h-5 rotate-[135deg]" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Chat Header */}
        <div className="glass-card p-4 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to="/doctors"><ArrowLeft className="w-5 h-5 text-muted-foreground" /></Link>
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">SJ</div>
            <div>
              <h3 className="font-semibold text-sm">Dr. Sarah Johnson</h3>
              <p className="text-xs text-success">Online</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setIsVideoCall(!isVideoCall)}>
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 px-2">
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === "patient" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-3.5 rounded-2xl ${
                msg.sender === "patient"
                  ? "gradient-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border rounded-bl-md"
              }`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === "patient" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{msg.time}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="glass-card p-2 sm:p-3 flex items-center gap-1.5 sm:gap-2">
          <Button variant="ghost" size="icon" className="rounded-xl shrink-0 h-9 w-9 sm:h-10 sm:w-10 hidden sm:flex"><Paperclip className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="rounded-xl shrink-0 h-9 w-9 sm:h-10 sm:w-10"><Smile className="w-4 h-4" /></Button>
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="rounded-xl border-0 bg-muted/50 h-10 text-sm"
          />
          <Button size="icon" onClick={sendMessage} className="rounded-xl gradient-primary border-0 text-primary-foreground shrink-0 h-9 w-9 sm:h-10 sm:w-10">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;
