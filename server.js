// server.js — Pavyon WebSocket Sunucusu
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
const prisma = new PrismaClient();

const roomUsers = new Map();

function getRoomKey(roomType, tableId) {
    return roomType === "table" && tableId != null ? `table:${tableId}` : "global";
}

function getRoomUsers(roomKey) {
    if (!roomUsers.has(roomKey)) roomUsers.set(roomKey, new Map());
    return roomUsers.get(roomKey);
}

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(httpServer, {
        cors: { origin: "*", methods: ["GET", "POST"] },
        transports: ["websocket", "polling"],
    });

    io.on("connection", (socket) => {
        console.log(`[+] Bağlandı: ${socket.id}`);
        let currentUser = null;
        let currentRoomKey = null;

        socket.on("user:join", ({ userId, nickname, avatar }) => {
            currentUser = { socketId: socket.id, userId, nickname, avatar };
        });

        socket.on("room:join", async ({ roomType, tableId }) => {
            if (!currentUser) return;
            const roomKey = getRoomKey(roomType, tableId);
            if (currentRoomKey && currentRoomKey !== roomKey) {
                socket.leave(currentRoomKey);
                const prevUsers = getRoomUsers(currentRoomKey);
                prevUsers.delete(socket.id);
                io.to(currentRoomKey).emit("room:users", Array.from(prevUsers.values()));
            }
            currentRoomKey = roomKey;
            socket.join(roomKey);
            const users = getRoomUsers(roomKey);
            users.set(socket.id, currentUser);
            io.to(roomKey).emit("room:users", Array.from(users.values()));
            try {
                const where = roomType === "table" && tableId != null
                    ? { roomType: "table", tableId: Number(tableId) }
                    : { roomType: "global" };
                const history = await prisma.message.findMany({
                    where, orderBy: { createdAt: "asc" }, take: 30,
                });
                socket.emit("room:history", history);
            } catch (err) {
                console.error("[room:join] History fetch error:", err);
                socket.emit("room:history", []);
            }
        });

        socket.on("message:send", async ({ content, roomType, tableId }) => {
            if (!currentUser || !content?.trim()) return;
            const roomKey = getRoomKey(roomType, tableId);
            try {
                const saved = await prisma.message.create({
                    data: {
                        content: content.trim(),
                        senderId: currentUser.userId,
                        senderNickname: currentUser.nickname,
                        senderAvatar: currentUser.avatar || "",
                        roomType: roomType || "global",
                        tableId: tableId != null ? Number(tableId) : null,
                    },
                });
                io.to(roomKey).emit("message:new", saved);
            } catch (err) {
                console.error("[message:send] DB error:", err);
            }
        });

        socket.on("typing:start", ({ roomType, tableId }) => {
            if (!currentUser) return;
            const roomKey = getRoomKey(roomType, tableId);
            socket.to(roomKey).emit("typing:update", { nickname: currentUser.nickname, isTyping: true });
        });

        socket.on("typing:stop", ({ roomType, tableId }) => {
            if (!currentUser) return;
            const roomKey = getRoomKey(roomType, tableId);
            socket.to(roomKey).emit("typing:update", { nickname: currentUser.nickname, isTyping: false });
        });

        socket.on("room:leave", () => {
            if (!currentRoomKey) return;
            socket.leave(currentRoomKey);
            const users = getRoomUsers(currentRoomKey);
            users.delete(socket.id);
            io.to(currentRoomKey).emit("room:users", Array.from(users.values()));
            currentRoomKey = null;
        });

        socket.on("disconnect", () => {
            if (currentRoomKey) {
                const users = getRoomUsers(currentRoomKey);
                users.delete(socket.id);
                io.to(currentRoomKey).emit("room:users", Array.from(users.values()));
                if (currentUser) {
                    io.to(currentRoomKey).emit("typing:update", { nickname: currentUser.nickname, isTyping: false });
                }
            }
        });
    });

    httpServer.listen(port, hostname, () => {
        const { networkInterfaces } = require("os");
        const nets = networkInterfaces();
        let localIP = "localhost";
        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                if (net.family === "IPv4" && !net.internal) { localIP = net.address; break; }
            }
        }
        console.log(`\n🍷 Pavyon sunucusu ayakta!`);
        console.log(`   Yerel: http://localhost:${port}`);
        console.log(`   Ağ:    http://${localIP}:${port}\n`);
    });
});
