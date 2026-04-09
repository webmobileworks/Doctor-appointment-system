const Message = require('../models/Message');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Helper to generate consistent consultationId based on user IDs
const getConsultationId = (user1, user2) => {
  return [user1.toString(), user2.toString()].sort().join('_');
};

// @desc    Get contacts/conversations for the current user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role; // 'doctor' or 'patient'

    // We get conversations based on booked appointments
    let appointments;
    if (role === 'doctor') {
      appointments = await Appointment.find({ doctor: userId }).populate('patient', 'name image doctorDetails email phone gender');
    } else {
      appointments = await Appointment.find({ patient: userId }).populate('doctor', 'name image doctorDetails email phone gender');
    }

    // Extract unique users
    const uniqueUsersMap = new Map();
    appointments.forEach(apt => {
      const otherUser = role === 'doctor' ? apt.patient : apt.doctor;
      if (otherUser && !uniqueUsersMap.has(otherUser._id.toString())) {
        uniqueUsersMap.set(otherUser._id.toString(), {
          _id: otherUser._id,
          name: otherUser.name,
          role: role === 'doctor' ? 'patient' : 'doctor',
          details: role === 'patient' ? otherUser.doctorDetails : undefined,
          // Extract image properly if needed 
        });
      }
    });

    const conversations = Array.from(uniqueUsersMap.values());
    
    // Optional: fetch the latest message for each to make the UI richer
    for (let conv of conversations) {
      const consId = getConsultationId(userId, conv._id);
      const lastMsg = await Message.findOne({ consultationId: consId }).sort({ createdAt: -1 });
      conv.lastMessage = lastMsg ? lastMsg.text : null;
      conv.lastMessageTime = lastMsg ? lastMsg.createdAt : null;
    }

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Server error retrieving conversations' });
  }
}

// @desc    Get chat history with a specific user
// @route   GET /api/messages/:otherUserId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.otherUserId;
    const consultationId = getConsultationId(userId, otherUserId);

    const messages = await Message.find({ consultationId }).sort({ createdAt: 1 });
    res.json({
      consultationId,
      messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error retrieving messages' });
  }
}

module.exports = {
  getConversations,
  getMessages,
  getConsultationId
};
