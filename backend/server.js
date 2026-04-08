const express = require('express');
const mongoose = require('mongoose');
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
    origin: 'http://localhost:5173', // Vite default
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
// Prescription route is handled within appointmentRoutes for now, or we can make a separate route.


// Socket.io for Real-time Consultation
io.on('connection', (socket) => {
  console.log('User connected to socket:', socket.id);

  // Simple signaling
  socket.on('join_consultation', (consultationId) => {
    socket.join(consultationId);
    console.log(`Socket ${socket.id} joined room ${consultationId}`);
  });

  socket.on('send_message', (data) => {
    // data should contain { consultationId, message }
    io.to(data.consultationId).emit('receive_message', data);
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
