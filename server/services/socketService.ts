import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

interface RoomParticipant {
  socketId: string;
  userId: string;
  userName: string;
  userRole: 'mentor' | 'candidate' | string;
  avatar?: string;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isSharingScreen?: boolean;
  joinedAt: number;
}

interface ActiveRoom {
  roomId: string;
  participants: Map<string, RoomParticipant>;
  isRecording: boolean;
  recordingStartedAt?: number;
}

const activeRooms = new Map<string, ActiveRoom>();
let globalIO: SocketIOServer | null = null;

export function getSocketIO(): SocketIOServer | null {
  return globalIO;
}

export function broadcastNewPost(post: any) {
  if (globalIO) {
    globalIO.emit('community:new_post', post);
  }
}

export function broadcastNewComment(postId: string, comment: any) {
  if (globalIO) {
    globalIO.emit('community:new_comment', { postId, comment });
    globalIO.to(`post:${postId}`).emit('community:post_comment', { postId, comment });
  }
}

export function sendUserNotification(recipientId: string, notification: any) {
  if (globalIO) {
    if (recipientId === 'all') {
      globalIO.emit('notification:received', notification);
    } else {
      globalIO.to(`user:${recipientId}`).emit('notification:received', notification);
      // Also broadcast to general room if recipient is connected
      globalIO.emit(`notification:user_${recipientId}`, notification);
    }
  }
}

export function setupSocketService(httpServer: HttpServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling']
  });

  globalIO = io;

  io.on('connection', (socket: Socket) => {
    console.log(`[Signaling] Socket connected: ${socket.id}`);

    // Register user for targeted push notifications
    socket.on('register-user', (data: { userId: string } | string) => {
      const userId = typeof data === 'string' ? data : data?.userId;
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`[Signaling] User "${userId}" registered for push notifications`);
      }
    });

    // Subscribe to a specific post discussion room
    socket.on('join-post-thread', (postId: string) => {
      if (postId) {
        socket.join(`post:${postId}`);
      }
    });

    // Join a mentorship video room
    socket.on('join-room', (data: { roomId: string; userId: string; userName: string; userRole?: string; avatar?: string }) => {
      const { roomId, userId, userName, userRole = 'candidate', avatar } = data;
      if (!roomId) return;

      socket.join(roomId);

      if (!activeRooms.has(roomId)) {
        activeRooms.set(roomId, {
          roomId,
          participants: new Map(),
          isRecording: false
        });
      }

      const room = activeRooms.get(roomId)!;
      const participant: RoomParticipant = {
        socketId: socket.id,
        userId: userId || socket.id,
        userName: userName || 'Peer User',
        userRole,
        avatar,
        isMuted: false,
        isVideoOff: false,
        isSharingScreen: false,
        joinedAt: Date.now()
      };

      room.participants.set(socket.id, participant);

      // Return list of other participants in room to new joiner
      const otherParticipants = Array.from(room.participants.values()).filter(p => p.socketId !== socket.id);
      socket.emit('room-joined', {
        roomId,
        yourSocketId: socket.id,
        participants: otherParticipants,
        isRecording: room.isRecording
      });

      // Notify other participants that a new peer joined
      socket.to(roomId).emit('user-connected', {
        participant,
        roomId
      });

      console.log(`[Signaling] User "${userName}" (${userRole}) joined room "${roomId}". Total participants: ${room.participants.size}`);
    });

    // Relay WebRTC Offer
    socket.on('offer', (data: { sdp: RTCSessionDescriptionInit; to: string; roomId: string }) => {
      const { sdp, to, roomId } = data;
      const room = activeRooms.get(roomId);
      const sender = room?.participants.get(socket.id);

      socket.to(to).emit('offer', {
        sdp,
        from: socket.id,
        sender,
        roomId
      });
    });

    // Relay WebRTC Answer
    socket.on('answer', (data: { sdp: RTCSessionDescriptionInit; to: string; roomId: string }) => {
      const { sdp, to, roomId } = data;
      socket.to(to).emit('answer', {
        sdp,
        from: socket.id,
        roomId
      });
    });

    // Relay ICE Candidate
    socket.on('ice-candidate', (data: { candidate: RTCIceCandidateInit; to: string; roomId: string }) => {
      const { candidate, to, roomId } = data;
      socket.to(to).emit('ice-candidate', {
        candidate,
        from: socket.id,
        roomId
      });
    });

    // Sync media controls (mute, camera toggle, screen sharing)
    socket.on('media-state-change', (data: { isMuted?: boolean; isVideoOff?: boolean; isSharingScreen?: boolean; roomId: string }) => {
      const { roomId, isMuted, isVideoOff, isSharingScreen } = data;
      const room = activeRooms.get(roomId);
      if (room && room.participants.has(socket.id)) {
        const p = room.participants.get(socket.id)!;
        if (typeof isMuted === 'boolean') p.isMuted = isMuted;
        if (typeof isVideoOff === 'boolean') p.isVideoOff = isVideoOff;
        if (typeof isSharingScreen === 'boolean') p.isSharingScreen = isSharingScreen;

        socket.to(roomId).emit('peer-media-state', {
          socketId: socket.id,
          userId: p.userId,
          isMuted: p.isMuted,
          isVideoOff: p.isVideoOff,
          isSharingScreen: p.isSharingScreen
        });
      }
    });

    // Sync live recording state
    socket.on('recording-state', (data: { isRecording: boolean; roomId: string }) => {
      const { roomId, isRecording } = data;
      const room = activeRooms.get(roomId);
      if (room) {
        room.isRecording = isRecording;
        room.recordingStartedAt = isRecording ? Date.now() : undefined;
        io.to(roomId).emit('recording-state-updated', {
          isRecording,
          startedAt: room.recordingStartedAt
        });
      }
    });

    // Disconnect cleanup
    socket.on('disconnecting', () => {
      for (const roomId of socket.rooms) {
        if (activeRooms.has(roomId)) {
          const room = activeRooms.get(roomId)!;
          const participant = room.participants.get(socket.id);
          room.participants.delete(socket.id);

          socket.to(roomId).emit('user-disconnected', {
            socketId: socket.id,
            userId: participant?.userId,
            userName: participant?.userName
          });

          if (room.participants.size === 0) {
            activeRooms.delete(roomId);
          }
        }
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Signaling] Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

