const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const Message = require('./models/Message');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for dev
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static prescriptions upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
// Prescription route is handled within appointmentRoutes for now, or we can make a separate route.


// Socket.io for Real-time Consultation
io.on('connection', (socket) => {
  console.log('User connected to socket:', socket.id);

  // Users join their personal room for direct messages
  socket.on('join_consultation', (userId) => {
    socket.join(`room_${userId}`);
    console.log(`Socket ${socket.id} joined personal room room_${userId}`);
  });

  socket.on('send_message', async (data) => {
    console.log(`Received send_message event from ${socket.id}:`, data);
    // data should contain { consultationId, senderId, receiverId, text, time }
    try {
      const newMessage = new Message({
        consultationId: data.consultationId,
        sender: data.senderId,
        receiver: data.receiverId,
        text: data.text
      });
      await newMessage.save();
      console.log(`Message saved successfully with id ${newMessage._id} for room ${data.consultationId}`);
      
      const msgPayload = {
        id: newMessage._id,
        text: newMessage.text,
        senderId: data.senderId,
        receiverId: data.receiverId,
        consultationId: data.consultationId,
        time: data.time || new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
      };
      
      // Emit to both sender and receiver personal rooms
      io.to(`room_${data.receiverId}`).emit('receive_message', msgPayload);
      io.to(`room_${data.senderId}`).emit('receive_message', msgPayload);
      console.log(`Broadcasted receive_message to room_${data.receiverId} and room_${data.senderId}`);
    } catch (err) {
      console.error('Socket message save error:', err);
      fs.appendFileSync('socket_error_log.txt', new Date().toISOString() + ' ' + err.stack + '\n');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from socket:', socket.id);
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
