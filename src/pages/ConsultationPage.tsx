import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { motion } from "framer-motion";
import { Send, Video, Phone, Paperclip, Smile, MoreVertical, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";

import api from "@/lib/api";

const ConsultationPage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const [input, setInput] = useState("");
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChatRef = useRef<any>(null);
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) setProfile(JSON.parse(userInfo));
  }, []);

  // Fetch conversations
  useEffect(() => {
    if (!profile) return;
    const fetchConversations = async () => {
      try {
        const res = await api.get('/messages/conversations');
        setConversations(res.data);
        if (res.data.length > 0) setActiveChat(res.data[0]);
      } catch (err) {
        console.error("Error fetching conversations", err);
      }
    };
    fetchConversations();
  }, [profile]);

  useEffect(() => {
    if (!profile?._id) return;
    const newSocket = io("http://localhost:5050");
    setSocket(newSocket);

    // Join personal room for messages once connected
    newSocket.on("connect", () => {
      newSocket.emit("join_consultation", profile._id.toString());
    });

    newSocket.on("receive_message", (data: any) => {
      setConversations((prevConvs) => prevConvs.map(c => {
        if (c._id === data.senderId || c._id === data.receiverId) {
          return { ...c, lastMessage: data.text };
        }
        return c;
      }));

      const currentActiveChat = activeChatRef.current;
      if (!currentActiveChat) return;

      const user1 = profile._id.toString();
      const user2 = currentActiveChat._id.toString();
      const activeConsultationId = [user1, user2].sort().join('_');

      if (data.consultationId === activeConsultationId) {
        setMessages((prev) => {
          if (prev.find(m => m._id === data.id || m.id === data.id)) return prev;
          return [...prev, { ...data, sender: data.senderId, id: data.id }];
        });
      }
    });

    return () => {
       newSocket.disconnect();
    }
  }, [profile?._id]);

  useEffect(() => {
    if (!activeChat || !profile || !socket) return;
    
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${activeChat._id}`);
        setMessages(res.data.messages);
      } catch (err) {
        console.error("Fetch msg error", err);
      }
    };
    fetchMessages();
  }, [activeChat, profile, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket || !activeChat || !profile) return;
    
    const user1 = profile._id.toString();
    const user2 = activeChat._id.toString();
    const consultationId = [user1, user2].sort().join('_');

    const newMsg = {
      consultationId,
      senderId: profile._id,
      receiverId: activeChat._id,
      text: input,
      senderRole: "patient"
    };

    setInput("");
    socket.emit("send_message", newMsg);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col max-w-6xl">
        <div className="flex-1 flex bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm h-[calc(100vh-10rem)]">
          
          {/* Sidebar */}
          <div className="w-80 border-r border-border/50 flex flex-col bg-muted/10 shrink-0">
            <div className="p-5 border-b border-border/50 font-semibold bg-card">My Consultations</div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 && (
                 <p className="p-6 text-sm text-muted-foreground text-center">No active consultations found.</p>
              )}
              {conversations.map(c => (
                <div key={c._id} onClick={() => setActiveChat(c)} className={`p-4 flex gap-3 cursor-pointer transition-colors border-b border-border/50 ${activeChat?._id === c._id ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-muted/50 border-l-4 border-l-transparent'}`}>
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">Dr</div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="font-semibold text-sm truncate">{c.name}</h4>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{c.lastMessage || "Start chatting..."}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-background relative">
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="glass-card p-4 flex items-center justify-between border-b border-border/50 shrink-0 rounded-none bg-card/50">
                  <div className="flex items-center gap-3">
                    <Link to="/doctors" className="lg:hidden"><ArrowLeft className="w-5 h-5 text-muted-foreground" /></Link>
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">Dr</div>
                    <div>
                      <h3 className="font-semibold text-sm">{activeChat.name}</h3>
                      <p className="text-xs text-success flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success"></span> Online</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10" onClick={() => setIsVideoCall(!isVideoCall)}>
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {isVideoCall && (
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="m-4 rounded-2xl gradient-primary aspect-video flex items-center justify-center relative overflow-hidden shrink-0">
                    <div className="text-center text-primary-foreground">
                      <Video className="w-12 h-12 mx-auto mb-3 opacity-80" />
                      <p className="text-lg font-semibold">Video Consultation</p>
                      <p className="text-sm opacity-80">Connected with {activeChat.name}</p>
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                      <Button size="icon" variant="secondary" className="rounded-full w-12 h-12"><Phone className="w-5 h-5" /></Button>
                      <Button size="icon" className="rounded-full w-12 h-12 bg-destructive hover:bg-destructive/90" onClick={() => setIsVideoCall(false)}>
                        <Phone className="w-5 h-5 rotate-[135deg]" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">
                  {messages.map((msg: any) => {
                    const isMe = msg.sender === profile._id || msg.senderId === profile._id;
                    return (
                      <motion.div key={msg._id || msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] p-3.5 rounded-2xl shadow-sm ${isMe
                          ? "gradient-primary text-primary-foreground rounded-br-sm"
                          : "bg-card border border-border rounded-bl-sm"
                          }`}>
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                          <p className={`text-[10px] mt-1.5 text-right ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                             {msg.time || new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Input */}
                <div className="p-4 bg-card border-t border-border/50 flex items-center gap-2 sm:gap-3 shrink-0">
                  <Button variant="ghost" size="icon" className="rounded-xl shrink-0 h-10 w-10 hidden sm:flex hover:bg-primary/10"><Paperclip className="w-5 h-5" /></Button>
                  <Button variant="ghost" size="icon" className="rounded-xl shrink-0 h-10 w-10 hover:bg-primary/10"><Smile className="w-5 h-5" /></Button>
                  <Input
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="rounded-xl border-0 bg-muted h-12 text-sm"
                  />
                  <Button size="icon" onClick={sendMessage} className="rounded-xl gradient-primary border-0 text-primary-foreground shrink-0 h-12 w-12 hover:opacity-90 shadow-sm">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-primary -ml-1" />
                </div>
                <p className="font-semibold text-foreground text-lg">My Consultations</p>
                <p className="text-sm mt-2 max-w-sm text-center">Select a doctor from the sidebar to view your messages and start consulting.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;
