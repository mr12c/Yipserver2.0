import { Server as socketIoServer } from "socket.io";
import Chat from "../models/chat.model.js";
import { ApiError } from "../utils/ApiError.js";

const setUpSocket = (server) => {
  const io = new socketIoServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
     
      credentials:true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        console.log(`User disconnected: ${userId}`);
        break;
      }
    }
  };

  const sendMessage = async (mess) => {
    console.log("Message received:", mess);

    try {
        const senderId = userSocketMap.get(mess.sender);
        const receiverId = userSocketMap.get(mess.receiver);
        const createdMessage = await Chat.create(mess);

        if (!createdMessage) {
            throw new Error("Error while creating message");
        }

        const messageData = await Chat.findById(createdMessage._id);

        if (senderId) {
            io.to(senderId).emit("receiveMessage", messageData);
        }

        if (receiverId) {
            io.to(receiverId).emit("receiveMessage", messageData);
        }

    } catch (error) {
        console.error("Error in sendMessage function:", error);
    }
};

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("yeraha con",userId);
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket: ${socket.id}`);
    }
    console.log(userSocketMap.get(userId),"uski socket.id")

    socket.on("sendMessage", sendMessage);

    socket.on("disconnect", () => disconnect(socket));
    Chat.watch().on('change', (change) => {
      console.log('Change detected:', change);
      const { operationType, fullDocument } = change;
      if (operationType === 'insert') {
          const messageData = fullDocument;
          const senderSocketId = userSocketMap.get(messageData.sender.toString());
          const receiverSocketId = userSocketMap.get(messageData.receiver.toString());

          if (senderSocketId) {
              io.to(senderSocketId).emit('receiveMessage', messageData);
          }

          if (receiverSocketId) {
              io.to(receiverSocketId).emit('receiveMessage', messageData);
          }
      }
  });
  });
};

export default setUpSocket;
