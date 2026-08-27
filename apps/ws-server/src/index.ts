import { JWT_SECRET } from "@repo/backend-common/config";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db/data";

const wss = new WebSocketServer({
    port: 8000
});

interface User {
    ws: WebSocket;
    rooms: number[];
    userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === "string") {
            return null;
        }

        if (!decoded || !decoded.userId) {
            return null;
        }

        return decoded.userId as string;

    } catch (err) {
        console.log("JWT ERROR:", err);
        return null;
    }
}

wss.on("connection", (ws, request) => {

    console.log("\nNEW CONNECTION");

    const url = request.url;

    if (!url) {
        ws.close();
        return;
    }

    const queryParams = new URLSearchParams(
        url.split("?")[1]
    );

    const token = queryParams.get("token") || "";

    const userId = checkUser(token);

    if (!userId) {
        console.log("INVALID TOKEN");
        ws.close();
        return;
    }

    const user: User = {
        ws,
        rooms: [],
        userId
    };

    users.push(user);

    console.log("USER CONNECTED:", userId);
    console.log("TOTAL USERS:", users.length);

    ws.on("message", async (data) => {

        try {
            const parsedData = JSON.parse(
                data.toString()
            );

            console.log("\nMESSAGE:", parsedData);

            // JOIN ROOM
           if (parsedData.type === "join_room") {
    const roomId = Number(parsedData.roomId);

    const user = users.find((x) => x.ws === ws);

    if (user && !user.rooms.includes(roomId)) {
        user.rooms.push(roomId);
    }

    console.log("USER JOINED ROOM:", roomId);
}

            // CHAT
          if (parsedData.type === "chat") {
    try {
        const roomId = Number(parsedData.roomId);
        const message = parsedData.message;

        console.log("\nCHAT RECEIVED");
        console.log("ROOM ID:", roomId);
        console.log("MESSAGE:", message);

        const room = await prismaClient.room.findUnique({
            where: {
                id: roomId
            }
        });

        if (!room) {
            console.log("ROOM DOES NOT EXIST:", roomId);
            return;
        }

        await prismaClient.chat.create({
            data: {
                roomId,
                message,
                userId
            }
        });

        console.log("MESSAGE SAVED");

        users.forEach((user) => {
            console.log(
                "CHECKING USER:",
                user.userId,
                "ROOMS:",
                user.rooms
            );

            if (user.rooms.includes(roomId)) {
                console.log("SENDING TO USER:", user.userId);

                if (user.ws.readyState === WebSocket.OPEN) {
                    user.ws.send(
                        JSON.stringify({
                            type: "chat",
                            message,
                            roomId
                        })
                    );
                }
            }
        });

    } catch (error) {
        console.error("MESSAGE ERROR:", error);
    }
}

        } catch (err) {
            console.error("MESSAGE ERROR:", err);
        }
    });

    ws.on("close", () => {

        console.log(
            "USER DISCONNECTED:",
            userId
        );

        const index = users.indexOf(user);

        if (index !== -1) {
            users.splice(index, 1);
        }

        console.log(
            "TOTAL USERS:",
            users.length
        );
    });
});

console.log(
    "WebSocket server running on port 8000"
);